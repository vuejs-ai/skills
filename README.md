# vue-skills

Agent skills for Vue 3 development.

> 🚧 **Early Experiment / Community Project**
>
> This repository is an early experiment in creating specialized skills for AI agents to enhance Vue 3 development. Skills are derived from real-world issues but may be incomplete due to hallucinations—please give feedback. If valuable, I plan to propose transferring this project to the Vue organization to benefit the wider community.

## Installation

```bash
npx skills add vuejs-ai/skills
```

### Claude Code Marketplace

An alternative for Claude Code users:

```bash
# Add marketplace
/plugin marketplace add vuejs-ai/skills

# Install individual skills
/plugin install create-adaptable-composable@vue-skills

# Install multiple skills
/plugin install create-adaptable-composable@vue-skills vue-best-practices@vue-skills  vue-development-guides@vue-skills 
```

## Usage

For most reliable results, prefix your prompt with `use vue skill`:

```
Use vue skill, <your prompt here>
```

This explicitly triggers the skill and ensures the AI follows the documented patterns. Without the prefix, skill triggering may be inconsistent depending on how closely your prompt matches the skill's description keywords.

## Available Skills

| Skill | When to use | Description |
|-------|-------------|-------------|
| **vue-best-practices** | Vue 3 + Composition API + TypeScript | Best practices, common gotchas, SSR guidance, performance |
| **vue-options-api-best-practices** | Options API (`data()`, `methods`) | `this` context, lifecycle, TypeScript with Options API |
| **vue-router-best-practices** | Vue Router 4 | Navigation guards, route params, route-component lifecycle |
| **vue-pinia-best-practices** | Pinia for state management | Store setup, reactivity, state patterns |
| **vue-testing-best-practices** | Writing component or E2E tests | Vitest, Vue Test Utils, Playwright |
| **vue-jsx-best-practices** | JSX in Vue | Syntax differences from React JSX |
| **vue-development-guides** | Building a Vue/Nuxt project | Component splitting, data flow, core principles |
| **vue-debug-guides** | Debugging Vue 3 issues | Runtime errors, warnings, async error handling, hydration issues |
| **create-adaptable-composable** | Creating reusable composables | `MaybeRef`/`MaybeRefOrGetter` input patterns |

## Examples

### vue-development-guides

Original from `vue-best-practices` of [`serkodev/vue-skills`](https://github.com/serkodev/vue-skills/tree/main)

#### Demo - Todo App

Prompt

```
create a todo app
```

🔎 See demo [full output](https://github.com/vuejs-ai/skills/tree/dev/demo/todo-app).

#### Changes after using skill

- More readable [code](https://github.com/vuejs-ai/skills/tree/dev/demo/todo-app/with-skills/App.vue)
- [Components](https://github.com/vuejs-ai/skills/tree/dev/demo/todo-app/with-skills/components) split
- Moved states into composables ([useTodos.ts](https://github.com/vuejs-ai/skills/tree/dev/demo/todo-app/with-skills/composables/useTodos.ts))
- Use `shallowRef` for primitive reactive data (see [Reactivity Guide](skills/vue-development-guides/references/reactivity-guide.md))

### create-adaptable-composable

Original from `create-agnostic-composable` of [`serkodev/vue-skills`](https://github.com/serkodev/vue-skills/tree/main)

#### Demo - useHidden

Prompt

```
create a reusable composable for controlling hidden for a element
```

🔎 See demo [full output](https://github.com/vuejs-ai/skills/tree/dev/demo/hidden-composable).

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

## Methodology

### Skill Types

Skills are classified into two categories:

- **Capability**: AI *cannot* solve the problem without the skill. These address version-specific issues, undocumented behaviors, recent features, or edge cases outside AI's training data.

- **Efficiency**: AI *can* solve the problem but not well. These provide optimal patterns, best practices, and consistent approaches that improve solution quality.

### Validation Process

Each skill rule is validated through automated evals:

1. **Baseline**: Run without skill installed
2. **With-skill**: Run with skill installed

A rule is kept only if it enables the model to solve problems it couldn't solve without it.

| Baseline | With Skill | Action |
|----------|------------|--------|
| Fail | Pass | Keep |
| Pass | Pass | Considered removed |

## Contributing

Development happens on the `dev` branch. The `main` branch is reserved for published skills only.

1. Create a feature branch from `dev`
2. Submit a PR to `dev`
3. After approval, changes are merged to `dev`
4. Maintainers sync `dev` → `main` via GitHub Action when ready to publish

## Related projects

- [antfu/skills](https://github.com/antfu/skills) - Anthony Fu's curated collection of agent skills for Vue/Vite/Nuxt
- [vueuse/vueuse-skills](https://github.com/vueuse/vueuse-skills) - Agent skills for VueUse development
- [onmax/nuxt-skills](https://github.com/onmax/nuxt-skills) - Agent skills for Nuxt development

## License

MIT
