# Vue Skills Development Guide

## Branch Strategy

> **IMPORTANT: Never develop on `main` branch!**
>
> - `main` is the **publishing branch** — it only contains released skills
> - `dev` is the **development branch** — all work happens here
> - Use the "Sync to Main" GitHub Action to publish changes from `dev` to `main`

| Branch | Purpose | Direct commits |
|--------|---------|----------------|
| `main` | Publishing (`npx skills add vuejs-ai/skills`) | Forbidden |
| `dev` | Development, tests, experiments | Via PR only |

## Development Workflow

After completing any task, run:

```bash
pnpm typecheck
```

This ensures TypeScript types are correct before committing.

## Skill Scopes

| Skill | Scope |
|-------|-------|
| **vue-best-practices** | Vue 3 with Composition API, `<script setup lang="ts">`, TypeScript, SSR. Includes render functions for cases where templates can't handle the requirement. |
| **vue-options-api-best-practices** | Vue 3 Options API style (`data()`, `methods`, `this` context). Each rule shows Options API solution only. |
| **vue-jsx-best-practices** | JSX syntax in Vue (e.g., `class` vs `className`, JSX plugin config). |
| **vue-testing-best-practices** | Testing with Vitest, Vue Test Utils, and Playwright for E2E. |
| **vue-router-best-practices** | Vue Router 4 patterns, navigation guards, route params, and route-component lifecycle interactions. |
| **vue-pinia-best-practices** | Pinia stores, state management patterns, store setup, and reactivity with stores. |
| **vue-development-guides** | Building a Vue/Nuxt project: component splitting, data flow, and core principles. |
| **vue-debug-guides** | Debugging and troubleshooting Vue 3: runtime errors, warnings, async error handling, SSR hydration issues. |
| **create-adaptable-composable** | Creating reusable composables with `MaybeRef`/`MaybeRefOrGetter` input patterns. |

## Common Pitfalls & Best Practices

- **Vue-specific only:** Reference files must cover Vue patterns and gotchas, not general web/JS knowledge.
- **No edge cases:** Avoid niche scenarios, tool-specific quirks, and obvious/well-known practices.
- **Required structure:** Each reference file needs title, impact level, task checklist, and incorrect/correct code examples.
- **SKILL.md is for coding agents:** Follow [official best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices): be concise (context window is a public good), assume the coding agent is smart (only add what it doesn't know), no hardcoded counts or historical background. Use progressive disclosure — SKILL.md is an overview that points to reference files.

## Checklist for effective Skills

Before sharing a Skill, verify:

### Core quality
- [ ] Description is specific and includes key terms
- [ ] Description includes both what the Skill does and when to use it
- [ ] SKILL.md body is under 500 lines
- [ ] Additional details are in separate files (if needed)
- [ ] No time-sensitive information (or in "old patterns" section)
- [ ] Consistent terminology throughout
- [ ] Examples are concrete, not abstract
- [ ] File references are one level deep
- [ ] Progressive disclosure used appropriately
- [ ] Workflows have clear steps

### Code and scripts
- [ ] Scripts solve problems rather than punt to Claude
- [ ] Error handling is explicit and helpful
- [ ] No "voodoo constants" (all values justified)
- [ ] Required packages listed in instructions and verified as available
- [ ] Scripts have clear documentation
- [ ] No Windows-style paths (all forward slashes)
- [ ] Validation/verification steps for critical operations
- [ ] Feedback loops included for quality-critical tasks

## Evaluating Skills

### Evaluation-Driven Development

Following [Anthropic's best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices#evaluation-and-iteration):

1. **Create evaluations FIRST** - Before writing extensive documentation
2. **Establish baseline** - Run without skill, document failures
3. **Test with skill** - Run with skill loaded, compare improvement
4. **Iterate** - Refine skill based on evaluation results

### Eval Structure

Each reference file requires 3 evals organized as scenarios:

```
evals/suites/skills/vue-best-practices/
├── computed-vs-methods/           # Reference name
│   ├── scenario-1/                # Eval 1 of 3
│   │   ├── eval.json
│   │   ├── eval.ts
│   │   ├── results.json           # Tracks run results
│   │   └── src/...
│   ├── scenario-2/                # Eval 2 of 3
│   └── scenario-3/                # Eval 3 of 3
```

Each scenario is a self-contained Vue project:

```
evals/suites/skills/vue-best-practices/computed-vs-methods/scenario-1/
├── eval.json           # Eval configuration with query and expected behavior
├── eval.ts             # Vitest assertions (withheld from agent)
├── results.json        # Tracks run results per model
├── package.json        # Self-contained Vue project
├── vite.config.ts
├── tsconfig.json
├── index.html
├── eslint.config.js
└── src/
    ├── main.ts
    ├── App.vue
    ├── vite-env.d.ts
    └── components/
        └── ProductList.vue   # Empty stub component
```

**Key files:**
- `eval.json` - Eval configuration with query, skills, and expected_behavior
- `eval.ts` - Vitest tests that validate the generated code (withheld from agent during generation)
- `results.json` - Tracks run results per model (auto-generated)
- `package.json` - Each suite is self-contained with all dependencies

**eval.json format:**
```json
{
  "skills": ["vue-best-practices"],
  "query": "Create a Vue component that displays a filtered list...",
  "files": ["src/components/ProductList.vue"],
  "expected_behavior": [
    "Uses computed property for filtered list, not a method",
    "Does not call filtering function in template"
  ]
}
```

### Eval Tiers

Each eval runs through 4 tiers to measure skill effectiveness:

| Tier | Prompt | Setup |
|------|--------|-------|
| `baseline` | `[original prompt]` | No skill |
| `with-skill` | `[original prompt]` | Skill installed |
| `with-skill-prompt` | `use vue-best-practices skill, [original prompt]` | Skill installed |
| `with-agents-md` | `[original prompt]` | Skill content embedded in project AGENTS.md |

### Results Tracking

Results are stored in `results.json` within each eval directory. Only the latest result per model is kept. Standalone runs with specific tiers are not recorded.

**results.json format:**
```json
{
  "haiku": {
    "timestamp": "2025-01-29T14:32:05Z",
    "tiers": {
      "baseline": { "passed": true, "duration": 45000 },
      "with-skill": { "passed": true, "duration": 52000 },
      "with-skill-prompt": { "passed": true, "duration": 48000 },
      "with-agents-md": { "passed": true, "duration": 41000 }
    }
  },
  "sonnet": {
    "timestamp": "2025-01-29T15:10:22Z",
    "tiers": {
      "baseline": { "passed": false, "duration": 38000 },
      "with-skill": { "passed": true, "duration": 55000 },
      "with-skill-prompt": { "passed": true, "duration": 51000 },
      "with-agents-md": { "passed": true, "duration": 47000 }
    }
  }
}
```

**Field definitions:**
- Model keys: `haiku`, `sonnet`, `opus` (absent = not run yet)
- `timestamp`: ISO 8601 format with seconds precision
- `duration`: total milliseconds for both runs
- `passed`: true = both runs passed, false = failed on run 1 or 2 (fail fast)

**Run logic (2 runs, fail fast):**
1. Run 1: if fails → stop, record `passed: false`
2. Run 1: if passes → proceed to run 2
3. Run 2: if fails → record `passed: false`
4. Run 2: if passes → record `passed: true`

New runs overwrite previous results for that model.

### Writing eval.ts

Tests validate generated code using **file content pattern matching**:

```typescript
import { expect, test } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

test("Uses computed property for filtering", () => {
  const content = readFileSync(
    join(process.cwd(), "src/components/Example.vue"),
    "utf-8"
  );

  // Assert pattern SHOULD exist
  expect(content).toMatch(/const\s+\w+\s*=\s*computed\s*\(/);

  // Assert pattern should NOT exist
  expect(content).not.toMatch(/v-for="[^"]*\s+in\s+\w+\(\)"/);
});
```

### Eval Guidelines

1. **Self-contained projects** - Each suite includes all files needed to build
2. **Input stubs must be clean** - No comments, hints, TODOs, or any information suggesting how to solve the task. The query alone should define the work.
3. **Tests read file content** - Use `readFileSync()` to get generated code
4. **Use regex for flexibility** - Match patterns, not exact strings
5. **Test what matters** - Focus on the specific pattern being tested
6. **Binary scoring** - Build + eval.ts tests = Pass/Fail
7. **Multi-model testing** - Test with Haiku, Sonnet, and Opus

### Running Evals

```bash
# Full run - all 4 tiers (skips if results.json exists for model)
pnpm eval computed-vs-methods

# Force re-run even if results exist
pnpm eval computed-vs-methods --force

# Run all missing evals
pnpm eval --all

# Re-run everything
pnpm eval --all --force

# Select model (haiku, sonnet, opus)
pnpm eval computed-vs-methods --model haiku

# Single tier run (for debugging, NOT recorded to results.json)
pnpm eval computed-vs-methods --tier baseline
pnpm eval computed-vs-methods --tier with-skill
pnpm eval computed-vs-methods --tier with-skill-prompt
pnpm eval computed-vs-methods --tier with-agents-md

# Dry run (validate fixtures only, no LLM call)
pnpm eval computed-vs-methods --dry

# Verbose output (keep temp dir, show details)
pnpm eval computed-vs-methods --verbose

# Type check evals library
pnpm --filter @vue-skills/evals typecheck
```

**Skip logic:**
- If `results.json` has an entry for the selected model → skip (unless `--force`)
- Only full runs (all 4 tiers) are recorded
- Single tier runs with `--tier` flag are for debugging and not tracked

### How the Runner Works

1. Copies eval suite to temp directory (excludes eval.ts and eval.json)
2. Installs skill via `npx skills add` (unless `--baseline`)
3. Reads query from eval.json and runs Claude Code with safe tool permissions
4. Copies eval.ts back to temp directory
5. Runs `pnpm install` and `pnpm run build`
6. Runs `vitest run eval.ts`
7. Reports pass/fail based on build + test results

### Available Evals

| Eval | Skill | Tests |
|------|-------|-------|
| `computed-vs-methods` | vue-best-practices | Uses computed() for derived data |
| `no-v-if-with-v-for` | vue-best-practices | Separates v-if and v-for |
| `v-for-key-attribute` | vue-best-practices | Uses :key with unique id |
| `testing-vitest` | vue-testing-best-practices | Uses Vitest + Vue Test Utils |
| `testing-async-flushpromises` | vue-testing-best-practices | Uses flushPromises for async |
| `router-param-change` | vue-router-best-practices | Watches route params |
| `pinia-store-destructuring` | vue-pinia-best-practices | Uses storeToRefs |
| `no-arrow-functions-methods` | vue-options-api-best-practices | Regular function syntax |
| `jsx-vue-vs-react` | vue-jsx-best-practices | Uses class not className |
| `create-composable` | vue-best-practices | Creates reusable composable |

### Full Eval Matrix

Each reference file requires:

3 evals × 4 tiers × 3 models × 2 runs = 72 runs (fail fast)

Example for one reference:
- 3 evals (scenario-1, scenario-2, scenario-3)
- × 4 tiers (baseline, with-skill, with-skill-prompt, with-agents-md)
- × 3 models (haiku, sonnet, opus)
- × 2 runs (both must pass, fail fast on first failure)

Only latest result per model is kept. Re-run with `--force` to update.

### Validation Checklist

Before considering a skill validated:

- [ ] 3 evals per reference file
- [ ] Each eval has results for all 3 models (haiku, sonnet, opus)
- [ ] Each model run covers all 4 tiers (baseline, with-skill, with-skill-prompt, with-agents-md)
- [ ] Results show improvement over baseline
