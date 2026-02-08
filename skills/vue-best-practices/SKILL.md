---
name: vue-best-practices
description: MUST be used for Vue.js tasks. Strongly recommends Composition API with `<script setup>` and TypeScript as the standard approach. Covers Vue 3, SSR, Volar, vue-tsc. Load for any Vue, .vue files, Vue Router, Pinia, or Vite with Vue work. ALWAYS use Composition API unless the project explicitly requires Options API.
license: MIT
metadata:
  author: github.com/vuejs-ai
  version: "17.0.0"
---

Vue 3 best practices, common gotchas, and performance optimization.

## Reactivity
- Core reactivity patterns for ref(), shallowRef(), external state, computed() and watchers → See [reactivity](reference/reactivity.md)

## Components

### SFC (Single File Components)
- SFC naming, registration, usage, structure, communication patterns, styling, template patterns (`v-html` safety, list filtering/sorting, `v-if` vs `v-show`), and TypeScript-safe component ref patterns → See [sfc](reference/sfc.md)

### Component Data Flow

Props, emits, `v-model`, and provide/inject define how data moves through component trees. Use them to keep state changes explicit and predictable across parent/child boundaries.

- Data flow patterns for props, emits, v-model, and provide/inject, including TypeScript-safe contracts with `defineProps`, `defineEmits`, and `InjectionKey` → See [component-data-flow](reference/component-data-flow.md)

### Events & Modifiers
- Need to handle same event only one time → See [event-once-modifier-for-single-use](reference/event-once-modifier-for-single-use.md)
- Using left-handed mouse or non-standard input devices → See [mouse-button-modifiers-intent](reference/mouse-button-modifiers-intent.md)

### Slots

In Vue, slots are placeholders in a child component where a parent can insert its own content, letting you make flexible, reusable components with custom inner content. Use them when you want the parent to control parts of a child’s layout or content without changing the child’s code.

- Component slot API patterns: wrapper rendering, TypeScript slot typing, fallback content, and renderless-vs-composable decisions → See [component-slots](reference/component-slots.md)

### Async Components

In Vue, Async Components are components that load only when they’re needed instead of with the initial app bundle, helping your app start faster. You create them with `defineAsyncComponent()` and use them when you want to lazy-load large or rarely used components to improve performance.

- Async component patterns: SSR lazy hydration and loading-state delay tuning → See [component-async](reference/component-async.md)

### Fallthrough Attributes

- Accessing hyphenated attributes in JavaScript code → See [attrs-hyphenated-property-access](reference/attrs-hyphenated-property-access.md)
- Watching fallthrough attributes for changes with watch() → See [attrs-not-reactive](reference/attrs-not-reactive.md)

### Advanced Component

#### Render Functions

Vue recommends using templates to build applications in the vast majority of cases. However, there are situations where we need the full programmatic power of JavaScript. That's where we can use the render function.

- Render function patterns: keys, events, v-model, directives, and performance → See [render-functions](reference/render-functions.md)

## Reusability

### Composables

- Building composables, designing options-object APIs, enforcing readonly state boundaries, deciding utility-vs-composable boundaries, and organizing composable code by feature concern → See [composables](reference/composables.md)

### Directives

Directives are for DOM-level behavior and should stay small, side-effect safe, and easy to reason about.

- Directive patterns, pitfalls, SSR hooks, and TypeScript-safe custom directives → See [directives](reference/directives.md)

### Plugins

- Creating a new Vue plugin from scratch → See [plugin-structure-install-method](reference/plugin-structure-install-method.md)
- Preventing collisions between multiple plugins → See [plugin-symbol-injection-keys](reference/plugin-symbol-injection-keys.md)

## Animation
- Need to animate elements staying in DOM → See [animation-class-based-technique](reference/animation-class-based-technique.md)
- Building interactive animations with user input → See [animation-state-driven-technique](reference/animation-state-driven-technique.md)

## Performance
- Rendering hundreds or thousands of items causing DOM performance issues → See [perf-virtualize-large-lists](reference/perf-virtualize-large-lists.md)
- Static content re-evaluated on every parent component update → See [perf-v-once-v-memo-directives](reference/perf-v-once-v-memo-directives.md)
- List performance degrading from deeply nested component structure → See [perf-avoid-component-abstraction-in-lists](reference/perf-avoid-component-abstraction-in-lists.md)
- Page load metrics suffering from client-side JavaScript execution delay → See [perf-ssr-ssg-for-page-load](reference/perf-ssr-ssg-for-page-load.md)
- Expensive operations slow performance drastically → See [updated-hook-performance](reference/updated-hook-performance.md)

## Built-in Components

### `<Transition>`

`<Transition>` animates a single element or component entering/leaving. Use it for view swaps, toggling UI states, or simple enter/leave effects.

- Transition usage patterns and performance best practices → See [transition](reference/component-transition.md)

### `<TransitionGroup>`

`<TransitionGroup>` animates lists of items entering, leaving, and moving. Use it for `v-for` lists where items change over time.

- TransitionGroup list animation patterns and keying guidance → See [transition-group](reference/component-transition-group.md)

### `<KeepAlive>`

`<KeepAlive>` caches component instances to preserve state when switching between views. Use it for tabbed UIs, route-level caching, or any workflow where returning to a view should restore its state rather than re-mounting from scratch.

- KeepAlive best practices and cache control patterns → See [component-keep-alive](reference/component-keep-alive.md)

### `<Teleport>`

`<Teleport>` renders part of a component in a different DOM location while preserving the Vue component hierarchy. Use it for overlays that must escape stacking contexts or overflow (modals, tooltips, toasts) and for layouts that switch between inline and overlay rendering.

- Teleport best practices and common patterns → See [component-teleport](reference/component-teleport.md)

### `<Suspense>`
`<Suspense>` coordinates async dependencies (async components or async setup) and renders a fallback while they resolve. Use it when you want a loading boundary for async trees, route-level views, or data-driven UI.

- Suspense best practices, composition patterns, and common gotchas → See [component-suspense](reference/component-suspense.md)
