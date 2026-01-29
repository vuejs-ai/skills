# Evals

Automated evaluation system for validating skill effectiveness.

## How It Works

1. Each eval is a self-contained Vue project with a coding task
2. Claude generates code based on the task prompt
3. The project is built and tested with Vitest assertions
4. Results compare baseline (no skill) vs with-skill performance

## Directory Structure

```
evals/
├── lib/
│   ├── cli.ts      # CLI entry point
│   ├── runner.ts   # Eval execution logic
│   └── types.ts    # TypeScript types
├── suites/skills/
│   └── <skill-name>/
│       └── <reference-name>/
│           ├── 1/              # Scenario 1
│           │   ├── eval.json   # Task config
│           │   ├── eval.ts     # Vitest assertions
│           │   ├── package.json
│           │   └── src/        # Vue project files
│           ├── 2/              # Scenario 2
│           └── 3/              # Scenario 3
└── README.md
```

## Eval Config (eval.json)

```json
{
  "skills": ["vue-best-practices"],
  "query": "Create a Vue component that...",
  "files": ["src/components/Example.vue"],
  "expected_behavior": [
    "Uses computed property for derived data",
    "Does not call methods in template"
  ]
}
```

## Writing Tests (eval.ts)

Tests validate generated code using file content pattern matching:

```typescript
import { expect, test } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

test("Uses computed property", () => {
  const content = readFileSync(
    join(process.cwd(), "src/components/Example.vue"),
    "utf-8"
  );

  // Pattern SHOULD exist
  expect(content).toMatch(/computed\s*\(/);

  // Pattern should NOT exist
  expect(content).not.toMatch(/methods.*filter/);
});
```

## CLI Usage

```bash
# Run both tiers (baseline and with-skill) for a specific scenario
pnpm eval computed-vs-methods/1

# Run specific tier only
pnpm eval computed-vs-methods/1 --baseline
pnpm eval computed-vs-methods/1 --with-skill

# Run all scenarios for a reference
pnpm eval computed-vs-methods

# Select model
pnpm eval computed-vs-methods/1 --model haiku

# Dry run (validate fixtures only)
pnpm eval computed-vs-methods --dry

# Verbose output
pnpm eval computed-vs-methods/1 --verbose
```

## Results Format

Results are stored in `results.json` within each eval directory:

```json
{
  "sonnet": {
    "version": "claude-sonnet-4-20250514",
    "timestamp": "2026-01-29T15:10:22Z",
    "tiers": {
      "baseline": { "passed": false, "duration": 38000 },
      "with-skill": { "passed": true, "duration": 55000 }
    }
  }
}
```

## Credits

This eval system is inspired by:

- [vercel/next-evals-oss](https://github.com/vercel/next-evals-oss) - Next.js evaluation framework
- [Claude Skills Best Practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices) - Anthropic's guidance on skill evaluation
