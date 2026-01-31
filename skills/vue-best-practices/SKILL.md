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
- Accessing ref() values without .value in scripts → See [ref-value-access](reference/ref-value-access.md)
- Destructuring reactive() objects, losing reactivity → See [reactive-destructuring](reference/reactive-destructuring.md)
- Choosing between ref() and reactive() for state → See [prefer-ref-over-reactive](reference/prefer-ref-over-reactive.md)
- Accessing refs inside arrays and collections → See [refs-in-collections-need-value](reference/refs-in-collections-need-value.md)
- Large objects or external library data overhead → See [shallow-ref-for-performance](reference/shallow-ref-for-performance.md)
- Using nested refs in template expressions → See [template-ref-unwrapping-top-level](reference/template-ref-unwrapping-top-level.md)
- Comparing reactive objects with === operator → See [reactivity-proxy-identity-hazard](reference/reactivity-proxy-identity-hazard.md)
- Library instances breaking in reactive state → See [reactivity-markraw-for-non-reactive](reference/reactivity-markraw-for-non-reactive.md)
- Expecting watchers to fire for each state change → See [reactivity-same-tick-batching](reference/reactivity-same-tick-batching.md)
- Integrating external state management libraries → See [reactivity-external-state-integration](reference/reactivity-external-state-integration.md)
- Deriving state with watchEffect instead of computed → See [reactivity-computed-over-watcheffect-mutations](reference/reactivity-computed-over-watcheffect-mutations.md)

## Computed
- Computed getter is making API calls or mutations → See [computed-no-side-effects](reference/computed-no-side-effects.md)
- Mutating computed values causes lost changes unexpectedly → See [computed-return-value-readonly](reference/computed-return-value-readonly.md)
- Computed property doesn't update when expected → See [computed-conditional-dependencies](reference/computed-conditional-dependencies.md)
- Sorting or reversing arrays destroys original data → See [computed-array-mutation](reference/computed-array-mutation.md)
- Expensive operations running too frequently every render → See [computed-vs-methods-caching](reference/computed-vs-methods-caching.md)
- Trying to pass arguments to computed properties → See [computed-no-parameters](reference/computed-no-parameters.md)
- Complex conditions bloating inline class bindings → See [computed-properties-for-class-logic](reference/computed-properties-for-class-logic.md)

## Watchers
- Need to watch a reactive object property → See [watch-reactive-property-getter](reference/watch-reactive-property-getter.md)
- Large nested data structures causing performance issues → See [watch-deep-performance](reference/watch-deep-performance.md)
- Dependencies accessed after await not tracking → See [watcheffect-async-dependency-tracking](reference/watcheffect-async-dependency-tracking.md)
- Need to access updated DOM in watchers → See [watch-flush-timing](reference/watch-flush-timing.md)
- Uncertain whether to use watch or watchEffect → See [watch-vs-watcheffect](reference/watch-vs-watcheffect.md)
- Duplicating initial calls and watch callbacks → See [watch-immediate-option](reference/watch-immediate-option.md)
- Can't compare old and new values correctly → See [watch-deep-same-object-reference](reference/watch-deep-same-object-reference.md)
- Template refs appearing null or stale → See [watcheffect-flush-post-for-refs](reference/watcheffect-flush-post-for-refs.md)

## Components
- Distinguishing Vue components from native elements → See [component-naming-pascalcase](reference/component-naming-pascalcase.md)
- Bundle includes components that aren't used → See [prefer-local-component-registration](reference/prefer-local-component-registration.md)
- Tight coupling through component ref access → See [prefer-props-emit-over-component-refs](reference/prefer-props-emit-over-component-refs.md)

## Component Data Flow

Props, emits, `v-model`, and provide/inject define how data moves through component trees. Use them to keep state changes explicit and predictable across parent/child boundaries.

- Data flow patterns for props, emits, v-model, and provide/inject → See [component-data-flow](reference/component-data-flow.md)

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

## Templates
- Rendering untrusted user content as HTML → See [v-html-xss-security](reference/v-html-xss-security.md)
- Filtering or conditionally hiding list items → See [no-v-if-with-v-for](reference/no-v-if-with-v-for.md)
- Functions in templates modifying data unexpectedly → See [template-functions-no-side-effects](reference/template-functions-no-side-effects.md)
- Performance issues with filtered or sorted lists → See [v-for-use-computed-for-filtering](reference/v-for-use-computed-for-filtering.md)
- Deciding between v-if and v-show for conditionals → See [v-if-vs-v-show-performance](reference/v-if-vs-v-show-performance.md)

## Events & Modifiers
- Need to handle same event only one time → See [event-once-modifier-for-single-use](reference/event-once-modifier-for-single-use.md)
- Keyboard shortcuts fire with unintended modifier combinations → See [exact-modifier-for-precise-shortcuts](reference/exact-modifier-for-precise-shortcuts.md)
- Using left-handed mouse or non-standard input devices → See [mouse-button-modifiers-intent](reference/mouse-button-modifiers-intent.md)
- Preventing default browser action and scroll performance together → See [no-passive-with-prevent](reference/no-passive-with-prevent.md)

## Lifecycle
- Lifecycle hooks don't execute asynchronously → See [lifecycle-hooks-synchronous-registration](reference/lifecycle-hooks-synchronous-registration.md)
- Expensive operations slow performance drastically → See [updated-hook-performance](reference/updated-hook-performance.md)

## Slots
- Accessing child component data in slot content → See [slot-render-scope-parent-only](reference/slot-render-scope-parent-only.md)
- Mixing named and scoped slots together → See [slot-named-scoped-explicit-default](reference/slot-named-scoped-explicit-default.md)
- Using v-slot on native HTML elements → See [slot-v-slot-on-components-or-templates-only](reference/slot-v-slot-on-components-or-templates-only.md)
- Empty wrapper elements rendering unnecessarily → See [slot-conditional-rendering-with-slots](reference/slot-conditional-rendering-with-slots.md)
- Scoped slot props lack TypeScript type safety → See [slot-define-slots-for-typescript](reference/slot-define-slots-for-typescript.md)
- Rendering empty component slots without defaults → See [slot-fallback-content-default-values](reference/slot-fallback-content-default-values.md)
- Confused about which slot content goes where → See [slot-implicit-default-content](reference/slot-implicit-default-content.md)
- Expecting name property in scoped slot props → See [slot-name-reserved-prop](reference/slot-name-reserved-prop.md)
- Choosing between renderless components and composables → See [slot-renderless-components-vs-composables](reference/slot-renderless-components-vs-composables.md)

## Attrs
- Accessing hyphenated attributes in JavaScript code → See [attrs-hyphenated-property-access](reference/attrs-hyphenated-property-access.md)
- Watching fallthrough attributes for changes with watch() → See [attrs-not-reactive](reference/attrs-not-reactive.md)

## Composables
- Composable has unexpected side effects affecting external state → See [composable-avoid-hidden-side-effects](reference/composable-avoid-hidden-side-effects.md)
- Building complex logic from smaller focused composables → See [composable-composition-pattern](reference/composable-composition-pattern.md)
- Inconsistent composable names or destructuring loses reactivity → See [composable-naming-return-pattern](reference/composable-naming-return-pattern.md)
- Composable has many optional parameters or confusing argument order → See [composable-options-object-pattern](reference/composable-options-object-pattern.md)
- Need to prevent uncontrolled mutations of composable state → See [composable-readonly-state](reference/composable-readonly-state.md)
- Unsure whether logic belongs in composable or utility function → See [composable-vs-utility-functions](reference/composable-vs-utility-functions.md)

## Composition API
- Optimizing production bundle size and performance → See [composition-api-bundle-size-minification](reference/composition-api-bundle-size-minification.md)
- Composition API code becoming scattered and hard to maintain → See [composition-api-code-organization](reference/composition-api-code-organization.md)
- Fixing naming conflicts and unclear data origins in mixins → See [composition-api-mixins-replacement](reference/composition-api-mixins-replacement.md)
- Applying functional patterns incorrectly to Vue state → See [composition-api-not-functional-programming](reference/composition-api-not-functional-programming.md)
- Gradually migrating large Options API codebase → See [composition-api-options-api-coexistence](reference/composition-api-options-api-coexistence.md)
- Coming from React, over-engineering Vue patterns unnecessarily → See [composition-api-vs-react-hooks-differences](reference/composition-api-vs-react-hooks-differences.md)

## Directives
- Storing state across directive hooks → See [directive-arguments-read-only](reference/directive-arguments-read-only.md)
- Applying custom directives to Vue components → See [directive-avoid-on-components](reference/directive-avoid-on-components.md)
- Creating intervals or event listeners in directives → See [directive-cleanup-in-unmounted](reference/directive-cleanup-in-unmounted.md)
- Simplifying directives with identical behavior → See [directive-function-shorthand](reference/directive-function-shorthand.md)
- Using custom directives in script setup → See [directive-naming-v-prefix](reference/directive-naming-v-prefix.md)
- Choosing between custom and built-in directives → See [directive-prefer-declarative-templating](reference/directive-prefer-declarative-templating.md)
- Deciding between directives and components → See [directive-vs-component-decision](reference/directive-vs-component-decision.md)
- Migrating Vue 2 directives to Vue 3 → See [directive-vue2-migration-hooks](reference/directive-vue2-migration-hooks.md)


## Animation
- Need to animate elements staying in DOM → See [animation-class-based-technique](reference/animation-class-based-technique.md)
- Animations not triggering on content changes → See [animation-key-for-rerender](reference/animation-key-for-rerender.md)
- Building interactive animations with user input → See [animation-state-driven-technique](reference/animation-state-driven-technique.md)
- Animating list changes causing noticeable lag → See [animation-transitiongroup-performance](reference/animation-transitiongroup-performance.md)

## Async Components
- Setting up Vue Router route component loading → See [async-component-vue-router](reference/async-component-vue-router.md)
- Improving Time to Interactive with SSR apps → See [async-component-hydration-strategies](reference/async-component-hydration-strategies.md)
- Loading spinner flashing on fast networks → See [async-component-loading-delay](reference/async-component-loading-delay.md)

## Render Functions
- Render function from setup doesn't update reactively → See [rendering-render-function-return-from-setup](reference/rendering-render-function-return-from-setup.md)
- Same vnode appearing multiple times in tree → See [render-function-vnodes-must-be-unique](reference/render-function-vnodes-must-be-unique.md)
- Rendering lists in render functions without keys → See [render-function-v-for-keys-required](reference/render-function-v-for-keys-required.md)
- Implementing .stop, .prevent in render functions → See [render-function-event-modifiers](reference/render-function-event-modifiers.md)
- Two-way binding on components in render functions → See [render-function-v-model-implementation](reference/render-function-v-model-implementation.md)
- Using string names for components in render functions → See [rendering-resolve-component-for-string-names](reference/rendering-resolve-component-for-string-names.md)
- Accessing vnode internals like el or shapeFlag → See [render-function-avoid-internal-vnode-properties](reference/render-function-avoid-internal-vnode-properties.md)
- Creating simple stateless presentational components → See [render-function-functional-components](reference/render-function-functional-components.md)
- Applying custom directives in render functions → See [render-function-custom-directives](reference/render-function-custom-directives.md)
- Excessive rerenders from watchers or deep watchers → See [rendering-excessive-rerenders-watch-vs-computed](reference/rendering-excessive-rerenders-watch-vs-computed.md)
- Choosing render functions over templates → See [rendering-prefer-templates-over-render-functions](reference/rendering-prefer-templates-over-render-functions.md)
- Migrating Vue 2 render functions to Vue 3 → See [rendering-render-function-h-import-vue3](reference/rendering-render-function-h-import-vue3.md)
- Passing slot content to h() incorrectly → See [rendering-render-function-slots-as-functions](reference/rendering-render-function-slots-as-functions.md)
- Understanding Vue's vdom optimization blocks → See [rendering-understand-vdom-block-structure](reference/rendering-understand-vdom-block-structure.md)


## TypeScript
- Declaring props with TypeScript in composition API components → See [ts-defineprops-type-based-declaration](reference/ts-defineprops-type-based-declaration.md)
- Providing default values to mutable prop types → See [ts-withdefaults-mutable-factory-function](reference/ts-withdefaults-mutable-factory-function.md)
- Typing reactive state with ref unwrapping concerns → See [ts-reactive-no-generic-argument](reference/ts-reactive-no-generic-argument.md)
- Accessing DOM elements after component mounts → See [ts-template-ref-null-handling](reference/ts-template-ref-null-handling.md)
- Typing refs to child Vue components → See [ts-component-ref-typeof-instancetype](reference/ts-component-ref-typeof-instancetype.md)
- Using custom directives with TypeScript support → See [ts-custom-directive-type-augmentation](reference/ts-custom-directive-type-augmentation.md)
- Declaring component events with full type safety → See [ts-defineemits-type-based-syntax](reference/ts-defineemits-type-based-syntax.md)
- Handling optional boolean props in TypeScript → See [ts-defineprops-boolean-default-false](reference/ts-defineprops-boolean-default-false.md)
- Using imported types safely in defineProps → See [ts-defineprops-imported-types-limitations](reference/ts-defineprops-imported-types-limitations.md)
- Handling DOM events with strict TypeScript checking → See [ts-event-handler-explicit-typing](reference/ts-event-handler-explicit-typing.md)
- Sharing data between components with type safety → See [ts-provide-inject-injection-key](reference/ts-provide-inject-injection-key.md)
- Storing Vue components in reactive state → See [ts-shallowref-for-dynamic-components](reference/ts-shallowref-for-dynamic-components.md)
- Working with union types in Vue templates → See [ts-template-type-casting](reference/ts-template-type-casting.md)

## SSR
- User data leaking between server requests → See [state-ssr-cross-request-pollution](reference/state-ssr-cross-request-pollution.md)
- Code runs on both server and browser environments → See [ssr-platform-specific-apis](reference/ssr-platform-specific-apis.md)
- Custom directives not displaying on server-rendered HTML → See [ssr-custom-directive-getssrprops](reference/ssr-custom-directive-getssrprops.md)

## Performance
- Many list items re-rendering unnecessarily during state changes → See [perf-props-stability-update-optimization](reference/perf-props-stability-update-optimization.md)
- Rendering hundreds or thousands of items causing DOM performance issues → See [perf-virtualize-large-lists](reference/perf-virtualize-large-lists.md)
- Static content re-evaluated on every parent component update → See [perf-v-once-v-memo-directives](reference/perf-v-once-v-memo-directives.md)
- List performance degrading from deeply nested component structure → See [perf-avoid-component-abstraction-in-lists](reference/perf-avoid-component-abstraction-in-lists.md)
- Computed properties returning objects triggering effects unexpectedly → See [perf-computed-object-stability](reference/perf-computed-object-stability.md)
- Page load metrics suffering from client-side JavaScript execution delay → See [perf-ssr-ssg-for-page-load](reference/perf-ssr-ssg-for-page-load.md)

## SFC (Single File Components)
- Starting a Vue project with a build setup → See [sfc-recommended-for-build-projects](reference/sfc-recommended-for-build-projects.md)
- Styling child component elements with scoped CSS → See [sfc-scoped-css-child-component-styling](reference/sfc-scoped-css-child-component-styling.md)
- Styling content added dynamically with v-html → See [sfc-scoped-css-dynamic-content](reference/sfc-scoped-css-dynamic-content.md)
- Optimizing scoped CSS selector performance → See [sfc-scoped-css-performance](reference/sfc-scoped-css-performance.md)
- Styling content passed through component slots → See [sfc-scoped-css-slot-content](reference/sfc-scoped-css-slot-content.md)
- Organizing component template, logic, and styles → See [sfc-separation-of-concerns-colocate](reference/sfc-separation-of-concerns-colocate.md)
- Binding inline styles with property names → See [style-binding-camelcase](reference/style-binding-camelcase.md)
- Building Tailwind classes with string concatenation → See [tailwind-dynamic-class-generation](reference/tailwind-dynamic-class-generation.md)
- Recursive component needs to reference itself → See [self-referencing-component-name](reference/self-referencing-component-name.md)

## Plugins
- Global properties not available in setup function → See [plugin-prefer-provide-inject-over-global-properties](reference/plugin-prefer-provide-inject-over-global-properties.md)
- Creating a new Vue plugin from scratch → See [plugin-structure-install-method](reference/plugin-structure-install-method.md)
- Preventing collisions between multiple plugins → See [plugin-symbol-injection-keys](reference/plugin-symbol-injection-keys.md)
- Global properties missing TypeScript autocomplete support → See [plugin-typescript-type-augmentation](reference/plugin-typescript-type-augmentation.md)

## App Configuration
- Need to chain app configuration methods after mount → See [mount-return-value](reference/mount-return-value.md)
- Vue only controlling specific page sections → See [multiple-app-instances](reference/multiple-app-instances.md)
- Migrating dynamic component registration to Vite → See [dynamic-component-registration-vite](reference/dynamic-component-registration-vite.md)
