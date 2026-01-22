# vue-skills

Agent skills for Vue 3 development.

> 🚧 **Early Experiment**
>
> This repository is an early experiment in creating specialized skills for AI agents to enhance their capabilities in Vue 3 development. The skills are derived from real-world issues and best practices, but might be incomplete or inaccurate due to hallucinations.
>
> Please give feedback when encountering any issues.

## Installation

```bash
npx add-skill hyf0/vue-skills
```

## Available Skills

### vue-best-practices (17 rules)

Vue 3 development best practices covering TypeScript configuration, tooling troubleshooting, and testing patterns.

| Type | Count | Examples |
|------|-------|----------|
| Capability | 15 | vue-tsc strictTemplates, Volar 3.0 breaking changes, Vue 3.5 deep watch, @vue-ignore directives |
| Efficiency | 2 | HMR in SSR, Pinia store mocking |

**Key rules that models don't know without the skill:**
- `vue-tsc-strict-templates` - vueCompilerOptions.strictTemplates config
- `deep-watch-numeric` - Vue 3.5 `deep: 1` for efficient partial-depth watching
- `vue-directive-comments` - @vue-ignore, @vue-expect-error, @vue-skip directives
- `pinia-store-mocking` - createSpy requirement in @pinia/testing 1.0+

## Rule Types

Rules are classified into two categories:

- **Capability**: AI *cannot* solve the problem without the skill. These address version-specific issues, undocumented behaviors, recent features, or edge cases outside AI's training data.

- **Efficiency**: AI *can* solve the problem but not well. These provide optimal patterns, best practices, and consistent approaches that improve solution quality.

## Methodology

Every skill in this repository is created through a rigorous, evidence-based process:

**1. Real-World Issue Collection**

Skills are sourced from actual developer pain points encountered in production.

**2. Multi-Model Verification**

Each skill undergoes systematic testing:
- **Baseline test**: Verify the model fails to solve the problem *without* the skill
- **Skill test**: Confirm the model correctly solves the problem *with* the skill
- **Deletion criteria**: If both Sonnet AND Haiku pass without the skill, the rule will be deleted

**3. Model Tier Validation**

| Model | Without Skill | With Skill | Action |
|-------|--------------|------------|--------|
| Haiku | Fail | Pass | Keep |
| Sonnet | Fail | Pass | Keep |
| Both | Pass | - | Delete |

**Acceptance criteria**: A skill is only kept if it enables Haiku or Sonnet to solve a problem they couldn't solve without it.

## License

MIT
