#!/usr/bin/env tsx
import { existsSync, readdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join, resolve } from "path";
import { fileURLToPath } from "url";
import { runEval, type RunResult } from "./claude-runner.js";
import type { EvalConfig, ResultsFile, ModelResult } from "./types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const evalsDir = resolve(__dirname, "..");
const suitesDir = join(evalsDir, "suites", "skills");

// Parse args
const args = process.argv.slice(2);
let evalName: string | undefined;
let baselineOnly = false;
let withSkillOnly = false;
let model = "sonnet";
let runs = 1;
let dry = false;
let all = false;
let verbose = false;
let force = false;
let modelExplicit = false;

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg === "--baseline") {
    baselineOnly = true;
  } else if (arg === "--with-skill") {
    withSkillOnly = true;
  } else if (arg === "--dry") {
    dry = true;
  } else if (arg === "--all") {
    all = true;
  } else if (arg === "--verbose" || arg === "-v") {
    verbose = true;
  } else if (arg === "--force") {
    force = true;
  } else if (arg === "--model" && args[i + 1]) {
    model = args[++i];
    modelExplicit = true;
  } else if (arg === "--runs" && args[i + 1]) {
    runs = parseInt(args[++i], 10);
  } else if (!arg.startsWith("-")) {
    evalName = arg;
  }
}

// Check suites directory exists
if (!existsSync(suitesDir)) {
  console.error(`Suites directory not found: ${suitesDir}`);
  console.error("Create evals/suites/skills/ with your evaluation suites.");
  process.exit(1);
}

interface SuiteInfo {
  path: string;
  skill: string;
  name: string;
}

// Discover all suites (supports both flat and scenario-based structure)
function discoverSuites(): SuiteInfo[] {
  const suites: SuiteInfo[] = [];
  const skillDirs = readdirSync(suitesDir, { withFileTypes: true });

  for (const skillDir of skillDirs) {
    if (!skillDir.isDirectory()) continue;

    const skillPath = join(suitesDir, skillDir.name);
    const referenceDirs = readdirSync(skillPath, { withFileTypes: true });

    for (const referenceDir of referenceDirs) {
      if (!referenceDir.isDirectory()) continue;

      const referencePath = join(skillPath, referenceDir.name);

      // Check for flat structure (eval.json directly in reference dir)
      if (existsSync(join(referencePath, "eval.json"))) {
        suites.push({
          path: referencePath,
          skill: skillDir.name,
          name: referenceDir.name,
        });
        continue;
      }

      // Check for numbered scenario structure (1/, 2/, 3/, etc.)
      const scenarioDirs = readdirSync(referencePath, { withFileTypes: true });
      for (const scenarioDir of scenarioDirs) {
        if (!scenarioDir.isDirectory()) continue;
        if (!/^\d+$/.test(scenarioDir.name)) continue;

        const scenarioPath = join(referencePath, scenarioDir.name);
        if (existsSync(join(scenarioPath, "eval.json"))) {
          suites.push({
            path: scenarioPath,
            skill: skillDir.name,
            name: `${referenceDir.name}/${scenarioDir.name}`,
          });
        }
      }
    }
  }

  return suites;
}

// Find suites by name (supports various formats)
// - "skill/reference/scenario" - exact match
// - "reference/scenario" - match by eval name
// - "reference" - match all scenarios for that reference
// - "skill" - match all evals for that skill
function findSuites(name: string): SuiteInfo[] {
  const allSuites = discoverSuites();
  const parts = name.split("/");

  // skill/reference/scenario - exact match
  if (parts.length === 3) {
    const [skill, reference, scenario] = parts;
    const evalName = `${reference}/${scenario}`;
    return allSuites.filter((s) => s.skill === skill && s.name === evalName);
  }

  // Two parts: could be skill/reference or reference/scenario
  if (parts.length === 2) {
    const [first, second] = parts;

    // Try as reference/scenario (exact name match)
    const exactMatch = allSuites.filter((s) => s.name === name);
    if (exactMatch.length > 0) {
      return exactMatch;
    }

    // Try as skill/reference (all scenarios for that reference)
    const skillRefMatch = allSuites.filter(
      (s) => s.skill === first && s.name.startsWith(`${second}/`)
    );
    if (skillRefMatch.length > 0) {
      return skillRefMatch;
    }
  }

  // Single part: could be reference name or skill name
  if (parts.length === 1) {
    // Try matching all scenarios for a reference
    const refMatch = allSuites.filter((s) => s.name.startsWith(`${name}/`));
    if (refMatch.length > 0) {
      return refMatch;
    }

    // Try matching all evals for a skill
    const skillMatch = allSuites.filter((s) => s.skill === name);
    if (skillMatch.length > 0) {
      return skillMatch;
    }
  }

  return [];
}

// Get skill from eval.json
function fetchEvalConfigFromPath(suitePath: string): EvalConfig | undefined {
  const configPath = join(suitePath, "eval.json");
  if (!existsSync(configPath)) return undefined;

  try {
    const config: EvalConfig = JSON.parse(readFileSync(configPath, "utf-8"));
    return config
  } catch {
    return undefined;
  }
}

// Determine which suites to run
let suites: SuiteInfo[];

if (all) {
  suites = discoverSuites();
} else if (evalName) {
  suites = findSuites(evalName);

  if (suites.length === 0) {
    console.error(`Suite not found: ${evalName}`);
    console.error(
      `Available suites: ${discoverSuites()
        .map((s) => `${s.skill}/${s.name}`)
        .join(", ")}`
    );
    process.exit(1);
  }
} else {
  console.error(
    "Usage: pnpm eval <suite-name> [--baseline] [--with-skill] [--model opus] [--force]"
  );
  console.error("");
  console.error("Options:");
  console.error("  --baseline     Run only baseline tier (no skills)");
  console.error("  --with-skill   Run only with-skill tier");
  console.error("  --model <m>    Model to use (haiku, sonnet, opus). Default: sonnet");
  console.error("  --runs <n>     Number of runs per tier");
  console.error("  --dry          Dry run (validate fixtures only)");
  console.error("  --all          Run all suites");
  console.error("  --force        Re-run even if results exist");
  console.error("  --verbose, -v  Show detailed output, keep temp dir");
  console.error("");
  console.error("Examples:");
  console.error("  pnpm eval computed-vs-methods/1        # run both tiers");
  console.error("  pnpm eval computed-vs-methods/1 --baseline");
  console.error("  pnpm eval computed-vs-methods/1 --with-skill");
  console.error("  pnpm eval computed-vs-methods          # run all scenarios");
  console.error("  pnpm eval vue-best-practices           # run all evals for skill");
  process.exit(1);
}

if (suites.length === 0) {
  console.error("No suites found to run.");
  process.exit(1);
}

// Determine tiers to run
const runBothTiers = !baselineOnly && !withSkillOnly;
const tiersToRun: Array<"baseline" | "with-skill"> = [];
if (baselineOnly || runBothTiers) tiersToRun.push("baseline");
if (withSkillOnly || runBothTiers) tiersToRun.push("with-skill");

console.log(`\nRunning ${suites.length} suite(s) with model=${model}`);
console.log(`Tiers: ${tiersToRun.join(", ")} (${tiersToRun.length * runs} run(s) per scenario)\n`);

// Track results
const results: { suite: SuiteInfo; results: RunResult[] }[] = [];

// Run evals
for (const suite of suites) {
  const displayName = `${suite.skill}/${suite.name}`;
  console.log(`\n━━━ ${displayName} ━━━`);

  if (dry) {
    const hasEvalJson = existsSync(join(suite.path, "eval.json"));
    const hasEval =
      existsSync(join(suite.path, "eval.ts")) ||
      existsSync(join(suite.path, "eval.tsx"));
    const hasPackage = existsSync(join(suite.path, "package.json"));

    console.log(`  eval.json:    ${hasEvalJson ? "✓" : "✗"}`);
    console.log(`  eval.ts:      ${hasEval ? "✓" : "✗"}`);
    console.log(`  package.json: ${hasPackage ? "✓" : "✗"}`);

    if (!hasEvalJson || !hasEval || !hasPackage) {
      console.log("  ⚠ Missing required files");
    } else {
      console.log("  ✓ Ready to run");
    }
    continue;
  }

  // Check for existing results (skip unless --force)
  const ALL_MODELS = ["haiku", "sonnet", "opus"];
  if (!force) {
    const resultsPath = join(suite.path, "results.json");
    if (existsSync(resultsPath)) {
      try {
        const existingResults = JSON.parse(readFileSync(resultsPath, "utf-8"));

        if (modelExplicit) {
          // Skip if specified model has results
          if (existingResults[model]) {
            console.log(`  ⏭ Skipped (${model} results exist). Use --force to re-run.`);
            continue;
          }
        } else {
          // Skip only if ALL models have results
          const hasAllResults = ALL_MODELS.every((m) => existingResults[m]);
          if (hasAllResults) {
            console.log(`  ⏭ Skipped (all model results exist). Use --force to re-run.`);
            continue;
          }
        }
      } catch {
        // If results.json is invalid, proceed with run
      }
    }
  }

  const suiteResults: RunResult[] = [];

  // Build list of (tier, runIndex) pairs to run
  type RunConfig = { tier: "baseline" | "with-skill"; runIndex: number };
  const runConfigs: RunConfig[] = [];

  for (const tier of tiersToRun) {
    for (let i = 0; i < runs; i++) {
      runConfigs.push({ tier, runIndex: i });
    }
  }

  // Track failed tiers for fail-fast behavior
  const failedTiers = new Set<"baseline" | "with-skill">();

  for (const config of runConfigs) {
    // Fail-fast: skip remaining runs for a tier that already failed
    if (failedTiers.has(config.tier)) {
      continue;
    }

    const isBaseline = config.tier === "baseline";
    const suitConfig = fetchEvalConfigFromPath(suite.path);
    const skill = isBaseline ? undefined : suitConfig?.skills?.[0];
    const tierLabel = config.tier;
    const runLabel = runBothTiers || runs > 1 ? ` [${tierLabel}${runs > 1 ? `#${config.runIndex + 1}` : ""}]` : "";
    const isTTY = process.stdout.isTTY;

    const template = suitConfig?.template ?? "default"
    const templatePath = template !== false ? join(evalsDir, "templates", template) : undefined;

    // Progress callback - updates the line in place (only on TTY)
    const onProgress = isTTY
      ? (step: string) => {
          process.stdout.clearLine?.(0);
          process.stdout.cursorTo?.(0);
          process.stdout.write(`  Running${runLabel}... ${step}`);
        }
      : undefined;

    process.stdout.write(`  Running${runLabel}... `);

    try {
      const result = await runEval(
        suite.path,
        {
          model,
          skill,
          baseline: isBaseline,
          timeout: 600000, // 10 minutes
          verbose,
          templatePath
        },
        onProgress
      );

      suiteResults.push(result);

      // Clear and write final result
      if (isTTY) {
        process.stdout.clearLine?.(0);
        process.stdout.cursorTo?.(0);
        process.stdout.write(`  Running${runLabel}... `);
      }

      const status = result.success ? "✓ PASS" : "✗ FAIL";
      const details: string[] = [];

      if (!result.buildSuccess) details.push("build failed");
      if (!result.testSuccess) details.push("tests failed");

      const detailStr = details.length > 0 ? ` (${details.join(", ")})` : "";
      const modelIdStr = result.modelId ? ` (${result.modelId})` : "";
      console.log(`${status}${detailStr} [${formatDuration(result.duration)}]${modelIdStr}`);

      if (verbose && result.workDir) {
        console.log(`  Work dir: ${result.workDir}`);
      }

      // Save result to results.json using short model name as key, with version field
      saveResult(suite.path, model, isBaseline, result);

      // Fail-fast: if this run failed, mark tier as failed to skip remaining runs
      if (!result.success) {
        failedTiers.add(config.tier);
      }
    } catch (error) {
      if (isTTY) {
        process.stdout.clearLine?.(0);
        process.stdout.cursorTo?.(0);
        process.stdout.write(`  Running${runLabel}... `);
      }
      console.log(`✗ ERROR: ${error}`);
      const failedResult: RunResult = {
        success: false,
        buildSuccess: false,
        testSuccess: false,
        duration: 0,
        output: String(error),
      };
      suiteResults.push(failedResult);

      // Fail-fast: errors also stop remaining runs for this tier
      saveResult(suite.path, model, isBaseline, failedResult);
      failedTiers.add(config.tier);
    }
  }

  results.push({ suite, results: suiteResults });
}

// Print summary
if (!dry && results.length > 0) {
  console.log("\n━━━ Summary ━━━");

  let totalPass = 0;
  let totalRuns = 0;

  for (const { suite, results: suiteResults } of results) {
    const passed = suiteResults.filter((r) => r.success).length;
    totalPass += passed;
    totalRuns += suiteResults.length;

    const passRate =
      suiteResults.length > 0
        ? Math.round((passed / suiteResults.length) * 100)
        : 0;
    console.log(
      `  ${suite.skill}/${suite.name}: ${passed}/${suiteResults.length} (${passRate}%)`
    );
  }

  console.log(
    `\nTotal: ${totalPass}/${totalRuns} passed (${Math.round((totalPass / totalRuns) * 100)}%)`
  );
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${Math.floor(ms / 60000)}m ${Math.round((ms % 60000) / 1000)}s`;
}

// Save result to results.json in the suite directory
function saveResult(
  suitePath: string,
  model: string,
  isBaseline: boolean,
  result: RunResult
): void {
  const resultsPath = join(suitePath, "results.json");
  const tier = isBaseline ? "baseline" : "with-skill";

  // Load existing results or create new
  let results: ResultsFile = {};
  if (existsSync(resultsPath)) {
    try {
      results = JSON.parse(readFileSync(resultsPath, "utf-8"));
    } catch {
      results = {};
    }
  }

  // Initialize model entry if needed
  if (!results[model]) {
    results[model] = {
      timestamp: new Date().toISOString(),
      tiers: {},
    };
  }

  // Update model entry
  results[model].timestamp = new Date().toISOString();
  if (result.modelId) {
    results[model].version = result.modelId;
  }
  results[model].tiers[tier] = {
    passed: result.success,
    duration: result.duration,
  };

  // Write back
  writeFileSync(resultsPath, JSON.stringify(results, null, 2) + "\n");
}
