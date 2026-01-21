# vue-skills

Agent skills for Vue 3 development.

## Installation

```bash
npx add-skill hyf0/vue-skills
```

## Available Skills

### 1. vue-best-practices (41 rules)

Comprehensive Vue 3 development best practices, TypeScript configuration, tooling troubleshooting, testing patterns, and composition API gotchas.

| Type | Count | Examples |
|------|-------|----------|
| Capability | 22 | vue-tsc compatibility, Volar 3.0, vueCompilerOptions, template directive comments |
| Efficiency | 19 | Testing patterns, composition API, SFC patterns, TypeScript utilities |

### 2. pinia-best-practices (2 rules)

Pinia store TypeScript configuration and typing issues.

| Type | Count | Examples |
|------|-------|----------|
| Capability | 1 | storeToRefs type loss with Vue 3.5+ |
| Efficiency | 1 | Getters circular type references |

### 3. vueuse-best-practices (2 rules)

VueUse composable patterns and TypeScript integration.

| Type | Count | Examples |
|------|-------|----------|
| Efficiency | 2 | SSR compatibility, target element refs |

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
- **Consistency test**: Run multiple times to ensure reliable behavior

**3. Model Tier Validation**

Skills are tested across model capabilities:

| Model | Without Skill | With Skill | Requirement |
|-------|--------------|------------|-------------|
| Haiku | Expected: Fail | Pass | Skill kept |
| Sonnet | Expected: Fail | Pass | Skill kept |
| Opus | May pass | Should pass | Reference |

**Acceptance criteria**: A skill is only kept if it enables Haiku or Sonnet to solve a problem they couldn't solve without it.

## License

MIT
