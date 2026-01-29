import { spawn, execSync } from "child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "fs";
import { dirname, join } from "path";
import { tmpdir } from "os";
import type { EvalConfig, RunOptions, RunResult } from "./types.js";

// Files withheld from agent
const TEST_FILE_PATTERNS = ["eval.ts", "eval.tsx", "eval.json"];

// Files ignored during collection
const IGNORED_PATTERNS = [
  ".git",
  "node_modules",
  ".DS_Store",
  "dist",
  "build",
  "pnpm-lock.yaml",
  "package-lock.json",
];

export type { RunOptions, RunResult };

type ProgressCallback = (step: string) => void;

export async function runEval(
  suitePath: string,
  options: RunOptions,
  onProgress?: ProgressCallback
): Promise<RunResult> {
  const startTime = Date.now();
  const workDir = join(tmpdir(), `vue-eval-${Date.now()}`);
  const log = onProgress || (() => {});

  try {
    // 1. Copy suite to temp dir (excluding test files)
    log("copying files");
    copyDir(suitePath, workDir, (name) => !isTestFile(name));

    // 2. Install skill if specified
    if (options.skill) {
      log(`installing skill: ${options.skill}`);
      const claudeDir = join(workDir, ".claude");
      mkdirSync(claudeDir, { recursive: true });

      if (options.verbose) {
        console.log(`  Installing skill: ${options.skill}`);
      }

      const skillResult = await execAsync(
        `npx skills add vuejs-ai/skills --skill ${options.skill} -y --copy`,
        { cwd: workDir }
      );

      if (skillResult.exitCode !== 0 && options.verbose) {
        console.log(`  Skill install warning: ${skillResult.stderr}`);
      }
    }

    // 3. Read eval config
    const evalConfigPath = join(suitePath, "eval.json");
    const evalConfig: EvalConfig = JSON.parse(
      readFileSync(evalConfigPath, "utf-8")
    );
    const prompt = evalConfig.query;

    // 4. Run Claude Code (safe tools prevent Bash)
    log(`generating code with ${options.model}`);
    if (options.verbose) {
      console.log(`  Running Claude Code with model: ${options.model}`);
    }

    const claudeResult = await runClaudeCode(
      prompt,
      workDir,
      options.model,
      options.timeout,
      options.baseline,
      options.verbose
    );

    if (options.verbose) {
      console.log(`  Claude output length: ${claudeResult.stdout.length}`);
    }

    // 5. Copy test files back
    copyTestFiles(suitePath, workDir);

    // 6. Install deps and run build
    log("installing dependencies");
    if (options.verbose) {
      console.log(`  Installing dependencies...`);
    }

    const installResult = await execAsync("pnpm install", { cwd: workDir });
    if (installResult.exitCode !== 0 && options.verbose) {
      console.log(`  Install warning: ${installResult.stderr}`);
    }

    log("building project");
    if (options.verbose) {
      console.log(`  Running build...`);
    }

    const buildResult = await execAsync("pnpm run build", { cwd: workDir });
    const buildSuccess = buildResult.exitCode === 0;

    if (!buildSuccess && options.verbose) {
      console.log(`  Build failed: ${buildResult.stderr}`);
    }

    // 7. Run eval.ts with vitest
    log("running tests");
    writeVitestConfig(workDir);

    if (options.verbose) {
      console.log(`  Running tests...`);
    }

    const testResult = await execAsync(
      "pnpm exec vitest run -c vitest.eval.config.ts --reporter=verbose",
      { cwd: workDir }
    );
    const testSuccess = testResult.exitCode === 0;

    if (!testSuccess && options.verbose) {
      console.log(`  Test output: ${testResult.stdout}`);
      console.log(`  Test errors: ${testResult.stderr}`);
    }

    return {
      success: testSuccess && buildSuccess,
      buildSuccess,
      testSuccess,
      duration: Date.now() - startTime,
      output: claudeResult.result || claudeResult.stdout,
      workDir: options.verbose ? workDir : undefined,
      modelId: claudeResult.modelId,
    };
  } finally {
    if (!options.verbose) {
      rmSync(workDir, { recursive: true, force: true });
    }
  }
}

// Safe tools that allow file operations but prevent arbitrary shell commands
const SAFE_TOOLS = ["Read", "Edit", "Write", "Glob", "Grep", "LSP"];

interface ExecResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

interface ClaudeResult extends ExecResult {
  modelId?: string;
  result?: string;
}

async function runClaudeCode(
  prompt: string,
  cwd: string,
  model: string,
  timeout: number,
  disableSkills: boolean,
  verbose: boolean = false
): Promise<ClaudeResult> {
  // Write prompt to a file to avoid shell escaping issues
  const promptFile = join(cwd, ".eval-prompt.txt");
  const enhancedPrompt = `${prompt}\n\nDo not run npm, pnpm, yarn, or any package manager commands. Just write the code files.`;
  writeFileSync(promptFile, enhancedPrompt);

  // Build command
  const args = [
    "claude",
    "--print",
    "--model",
    model,
    "--output-format",
    "json",
    "--allowedTools",
    SAFE_TOOLS.join(","),
    "--dangerously-skip-permissions",
    "--no-session-persistence",
  ];

  // Disable global skills for baseline runs
  if (disableSkills) {
    args.push("--disable-slash-commands");
  }

  // Use cat to read the prompt file
  const command = `${args.join(" ")} "$(cat '${promptFile}')"`;

  if (verbose) {
    console.log(`  Claude command: ${args.join(" ")} "<prompt from file>"`);
  }

  try {
    const stdout = execSync(command, {
      cwd,
      timeout,
      encoding: "utf-8",
      maxBuffer: 50 * 1024 * 1024, // 50MB buffer
    });

    // Parse JSON response to extract model ID
    let modelId: string | undefined;
    let result: string | undefined;
    try {
      const response = JSON.parse(stdout);
      // Extract model ID from modelUsage keys
      if (response.modelUsage && typeof response.modelUsage === "object") {
        const modelIds = Object.keys(response.modelUsage);
        if (modelIds.length > 0) {
          modelId = modelIds[0];
        }
      }
      // Extract actual result text
      result = response.result;
    } catch {
      // If parsing fails, use raw stdout
      result = stdout;
    }

    if (verbose) {
      console.log(`  Claude exit code: 0`);
      console.log(`  Model ID: ${modelId || "unknown"}`);
      console.log(`  Claude result (first 200): ${(result || stdout).slice(0, 200)}`);
    }

    // Clean up prompt file
    try {
      rmSync(promptFile);
    } catch {
      // Ignore
    }

    return { stdout, stderr: "", exitCode: 0, modelId, result };
  } catch (error: unknown) {
    const err = error as { stdout?: string; stderr?: string; status?: number };
    if (verbose) {
      console.log(`  Claude error: ${err}`);
      if (err.stderr) {
        console.log(`  Claude stderr: ${err.stderr.slice(0, 500)}`);
      }
    }

    // Clean up prompt file
    try {
      rmSync(promptFile);
    } catch {
      // Ignore
    }

    return {
      stdout: err.stdout || "",
      stderr: err.stderr || "",
      exitCode: err.status || 1,
    };
  }
}

async function execAsync(
  command: string,
  options: { cwd: string; timeout?: number; verbose?: boolean }
): Promise<ExecResult> {
  return new Promise((resolve) => {
    const child = spawn(command, {
      cwd: options.cwd,
      shell: true,
      env: { ...process.env, CI: "true" },
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (d: Buffer) => {
      stdout += d.toString();
    });

    child.stderr.on("data", (d: Buffer) => {
      stderr += d.toString();
    });

    child.on("error", (err) => {
      if (options.verbose) {
        console.log(`  Spawn error: ${err.message}`);
      }
      resolve({ stdout, stderr, exitCode: 1 });
    });

    const timer = options.timeout
      ? setTimeout(() => {
          child.kill();
          resolve({ stdout, stderr, exitCode: 1 });
        }, options.timeout)
      : null;

    child.on("close", (code) => {
      if (timer) clearTimeout(timer);
      if (options.verbose && stderr) {
        console.log(`  stderr: ${stderr.slice(0, 500)}`);
      }
      resolve({ stdout, stderr, exitCode: code ?? 1 });
    });
  });
}

function isTestFile(name: string): boolean {
  return TEST_FILE_PATTERNS.some(
    (p) =>
      name === p || name.endsWith(".test.ts") || name.endsWith(".test.tsx")
  );
}

function isIgnored(name: string): boolean {
  return IGNORED_PATTERNS.includes(name);
}

function copyDir(
  src: string,
  dest: string,
  filter?: (name: string) => boolean
): void {
  mkdirSync(dest, { recursive: true });

  const entries = readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    if (isIgnored(entry.name)) continue;
    if (filter && !filter(entry.name)) continue;

    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath, filter);
    } else {
      const destDir = dirname(destPath);
      if (!existsSync(destDir)) {
        mkdirSync(destDir, { recursive: true });
      }
      cpSync(srcPath, destPath);
    }
  }
}

function copyTestFiles(src: string, dest: string): void {
  const entries = readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    if (isIgnored(entry.name)) continue;

    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);

    if (entry.isDirectory()) {
      copyTestFiles(srcPath, destPath);
    } else if (isTestFile(entry.name)) {
      const destDir = dirname(destPath);
      if (!existsSync(destDir)) {
        mkdirSync(destDir, { recursive: true });
      }
      cpSync(srcPath, destPath);
    }
  }
}

function writeVitestConfig(workDir: string): void {
  const configPath = join(workDir, "vitest.eval.config.ts");
  const config = `
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["eval.ts", "eval.tsx"],
  },
});
`;
  writeFileSync(configPath, config);
}
