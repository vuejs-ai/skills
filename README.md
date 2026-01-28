# vue-skills

Agent skills for Vue 3 development.

> 🚧 **Early Experiment**
>
> This repository is an early experiment in creating specialized skills for AI agents to enhance their capabilities in Vue 3 development. The skills are derived from real-world issues and best practices, but might be incomplete or inaccurate due to hallucinations.
>
> Please give feedback when encountering any issues.
>
> 🚧 **This is a community project**
>
> I created this project to explore how AI can improve Vue 3 development. If it proves valuable, I plan to propose transferring it to the Vue organization so it can benefit the wider community.

## Installation

```bash
npx add-skill vuejs-ai/skills
```

## Usage

For most reliable results, prefix your prompt with `use vue skill`:

```
Use vue skill, <your prompt here>
```

This explicitly triggers the skill and ensures the AI follows the documented patterns. Without the prefix, skill triggering may be inconsistent depending on how closely your prompt matches the skill's description keywords.

## Available Skills

### vue-development-guides

Original from `vue-best-practices` of [`serkodev/vue-skills`](https://github.com/serkodev/vue-skills/tree/main)

#### Demo - Todo App

Prompt

```
create a todo app
```

🔎 See demo [full output](./demo/todo-app).

#### Changes after using skill

- More readable [code](demo/todo-app/with-skills/App.vue)
- [Components](demo/todo-app/with-skills/components) split
- Moved states into composables ([useTodos.ts](demo/todo-app/with-skills/composables/useTodos.ts))
- Use `shallowRef` for primitive reactive data (see [Reactivity Guide](skills/vue-development-guides/references/reactivity-guide.md))

### create-adaptable-composable

Original from `create-agnostic-composable` of [`serkodev/vue-skills`](https://github.com/serkodev/vue-skills/tree/main)


#### Demo - useHidden

Prompt

```
create a reusable composable for controlling hidden for a element
```

🔎 See demo [full output](./demo/hidden-composable).

#### Changes after using skill

- Used `MaybeRef` and `MaybeRefOrGetter` for input parameters for reactivity flexibility.

```ts
export interface UseHiddenOptions {
  hidden?: MaybeRef<boolean>
  initialHidden?: MaybeRefOrGetter<boolean>
  syncAria?: boolean
}

export function useHidden(
  target?: MaybeRefOrGetter<HTMLElement | null | undefined>,
  options: UseHiddenOptions = {},
)
```

### vue-best-practices (17 rules)

Vue 3 development best practices covering TypeScript configuration, component typing, tooling troubleshooting, and testing patterns.

| Type | Count | Examples |
|------|-------|----------|
| Capability | 15 | Component props extraction, vue-tsc strictTemplates, Volar 3.0 breaking changes, @vue-ignore directives |
| Efficiency | 2 | HMR in SSR, Pinia store mocking |

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

## Related projects

- [vueuse/vueuse-skills](https://github.com/vueuse/vueuse-skills) - Agent skills for VueUse development
- [onmax/nuxt-skills](https://github.com/onmax/nuxt-skills) - Agent skills for Nuxt development

## License

MIT
