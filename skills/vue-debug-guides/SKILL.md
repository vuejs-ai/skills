---
name: vue-debug-guides
description: Vue 3 debugging and error handling for runtime errors, warnings, async failures, and SSR/hydration issues. Use when diagnosing or fixing Vue issues.
---

Vue 3 debugging and error handling for runtime issues, warnings, async failures, and hydration bugs.
For development best practices and common gotchas, use `vue-best-practices`.

### Reactivity
- Tracing unexpected re-renders and state updates → See [reactivity-debugging-hooks](reference/reactivity-debugging-hooks.md)
- Ref values not updating due to missing .value access → See [ref-value-access](reference/ref-value-access.md)
- State stops updating after destructuring reactive objects → See [reactive-destructuring](reference/reactive-destructuring.md)
- Refs inside arrays, Maps, or Sets not unwrapping → See [refs-in-collections-need-value](reference/refs-in-collections-need-value.md)
- Nested refs rendering as [object Object] in templates → See [template-ref-unwrapping-top-level](reference/template-ref-unwrapping-top-level.md)
- Reactive proxy identity comparisons always return false → See [reactivity-proxy-identity-hazard](reference/reactivity-proxy-identity-hazard.md)
- Third-party instances breaking when proxied → See [reactivity-markraw-for-non-reactive](reference/reactivity-markraw-for-non-reactive.md)
- Watchers only firing once per tick unexpectedly → See [reactivity-same-tick-batching](reference/reactivity-same-tick-batching.md)

### Computed
- Computed getter triggers mutations or requests unexpectedly → See [computed-no-side-effects](reference/computed-no-side-effects.md)
- Mutating computed values causes changes to disappear → See [computed-return-value-readonly](reference/computed-return-value-readonly.md)
- Computed value never updates after conditional logic → See [computed-conditional-dependencies](reference/computed-conditional-dependencies.md)
- Sorting or reversing arrays breaks original state → See [computed-array-mutation](reference/computed-array-mutation.md)
- Passing parameters to computed properties fails → See [computed-no-parameters](reference/computed-no-parameters.md)

### Watchers
- Async operations overwriting with stale data → See [watch-async-cleanup](reference/watch-async-cleanup.md)
- Creating watchers inside async callbacks → See [watch-async-creation-memory-leak](reference/watch-async-creation-memory-leak.md)

### Components
- Child component throws "component not found" error → See [local-components-not-in-descendants](reference/local-components-not-in-descendants.md)
- Click listener doesn't fire on custom component → See [click-events-on-components](reference/click-events-on-components.md)
- Parent can't access child ref data in script setup → See [component-ref-requires-defineexpose](reference/component-ref-requires-defineexpose.md)
- HTML template parsing breaks Vue component syntax → See [in-dom-template-parsing-caveats](reference/in-dom-template-parsing-caveats.md)
- Wrong component renders due to naming collisions → See [component-naming-conflicts](reference/component-naming-conflicts.md)
- Parent styles don't apply to multi-root component → See [multi-root-component-class-attrs](reference/multi-root-component-class-attrs.md)

### Props & Emits
- Variables referenced in defineProps cause errors → See [prop-defineprops-scope-limitation](reference/prop-defineprops-scope-limitation.md)
- Component emits undeclared event causing warnings → See [declare-emits-for-documentation](reference/declare-emits-for-documentation.md)
- defineEmits used inside function or conditional → See [defineEmits-must-be-top-level](reference/defineEmits-must-be-top-level.md)
- defineEmits has both type and runtime arguments → See [defineEmits-no-runtime-and-type-mixed](reference/defineEmits-no-runtime-and-type-mixed.md)
- Native event listeners not responding to clicks → See [native-event-collision-with-emits](reference/native-event-collision-with-emits.md)
- Component event fires twice when clicking → See [undeclared-emits-double-firing](reference/undeclared-emits-double-firing.md)

### Templates
- Getting template compilation errors with statements → See [template-expressions-restrictions](reference/template-expressions-restrictions.md)
- "Cannot read property of undefined" runtime errors → See [v-if-null-check-order](reference/v-if-null-check-order.md)
- Dynamic directive arguments not working properly → See [dynamic-argument-constraints](reference/dynamic-argument-constraints.md)
- v-else elements rendering unconditionally always → See [v-else-must-follow-v-if](reference/v-else-must-follow-v-if.md)
- Child components in loops showing undefined data → See [v-for-component-props](reference/v-for-component-props.md)
- Array order changing after sorting or reversing → See [v-for-computed-reverse-sort](reference/v-for-computed-reverse-sort.md)
- List items disappearing or swapping state unexpectedly → See [v-for-key-attribute](reference/v-for-key-attribute.md)
- Getting off-by-one errors with range iteration → See [v-for-range-starts-at-one](reference/v-for-range-starts-at-one.md)
- v-show or v-else not working on template elements → See [v-show-template-limitation](reference/v-show-template-limitation.md)

### Template Refs
- Ref becomes null when element is conditionally hidden → See [template-ref-null-with-v-if](reference/template-ref-null-with-v-if.md)
- Ref array indices don't match data array in loops → See [template-ref-v-for-order](reference/template-ref-v-for-order.md)
- Refactoring template ref names breaks silently in code → See [use-template-ref-vue35](reference/use-template-ref-vue35.md)

### Forms & v-model
- Initial form values not showing when using v-model → See [v-model-ignores-html-attributes](reference/v-model-ignores-html-attributes.md)
- Textarea content changes not updating the ref → See [textarea-no-interpolation](reference/textarea-no-interpolation.md)
- iOS users cannot select dropdown first option → See [select-initial-value-ios-bug](reference/select-initial-value-ios-bug.md)
- Parent and child components have different values → See [define-model-default-value-sync](reference/define-model-default-value-sync.md)
- Object property changes not syncing to parent → See [definemodel-object-mutation-no-emit](reference/definemodel-object-mutation-no-emit.md)
- Real-time search/validation broken for Chinese/Japanese input → See [v-model-ime-composition](reference/v-model-ime-composition.md)
- Number input returns empty string instead of zero → See [v-model-number-modifier-behavior](reference/v-model-number-modifier-behavior.md)
- Custom checkbox values not submitted in forms → See [checkbox-true-false-value-form-submission](reference/checkbox-true-false-value-form-submission.md)

### Events & Modifiers
- Chaining multiple event modifiers produces unexpected results → See [event-modifier-order-matters](reference/event-modifier-order-matters.md)
- Keyboard shortcuts don't fire with system modifier keys → See [keyup-modifier-timing](reference/keyup-modifier-timing.md)

### Lifecycle
- Memory leaks from unremoved event listeners → See [cleanup-side-effects](reference/cleanup-side-effects.md)
- DOM access fails before component mounts → See [lifecycle-dom-access-timing](reference/lifecycle-dom-access-timing.md)
- DOM reads return stale values after state changes → See [dom-update-timing-nexttick](reference/dom-update-timing-nexttick.md)
- SSR rendering differs from client hydration → See [lifecycle-ssr-awareness](reference/lifecycle-ssr-awareness.md)

### Slots
- Wrapper components breaking child slot functionality → See [slot-forwarding-to-child-components](reference/slot-forwarding-to-child-components.md)

### Provide/Inject
- Calling provide after async operations fails silently → See [provide-inject-synchronous-setup](reference/provide-inject-synchronous-setup.md)
- Tracing where provided values come from → See [provide-inject-debugging-challenges](reference/provide-inject-debugging-challenges.md)
- Injected values not updating when provider changes → See [provide-inject-reactivity-not-automatic](reference/provide-inject-reactivity-not-automatic.md)
- Multiple components share same default object → See [provide-inject-default-value-factory](reference/provide-inject-default-value-factory.md)

### Attrs
- Both internal and fallthrough event handlers execute → See [attrs-event-listener-merging](reference/attrs-event-listener-merging.md)
- Explicit attributes overwritten by fallthrough values → See [fallthrough-attrs-overwrite-vue3](reference/fallthrough-attrs-overwrite-vue3.md)
- Attributes applying to wrong element in wrappers → See [inheritattrs-false-for-wrapper-components](reference/inheritattrs-false-for-wrapper-components.md)

### Composables
- Composable called outside setup context or asynchronously → See [composable-call-location-restrictions](reference/composable-call-location-restrictions.md)
- Composable reactive dependency not updating when input changes → See [composable-tovalue-inside-watcheffect](reference/composable-tovalue-inside-watcheffect.md)

### Composition API
- Lifecycle hooks failing silently after async operations → See [composition-api-script-setup-async-context](reference/composition-api-script-setup-async-context.md)
- Parent component refs unable to access exposed properties → See [define-expose-before-await](reference/define-expose-before-await.md)

### Async Components
- Network failures or timeouts loading components → See [async-component-error-handling](reference/async-component-error-handling.md)
- Template refs undefined after component reactivation → See [async-component-keepalive-ref-issue](reference/async-component-keepalive-ref-issue.md)

### KeepAlive
- Child components mount twice with nested Vue Router routes → See [keepalive-router-nested-double-mount](reference/keepalive-router-nested-double-mount.md)
- Memory grows when combining KeepAlive with Transition animations → See [keepalive-transition-memory-leak](reference/keepalive-transition-memory-leak.md)

### Transitions
- JavaScript transition hooks hang without done callback → See [transition-js-hooks-done-callback](reference/transition-js-hooks-done-callback.md)
- Move animations fail on inline list elements → See [transition-group-flip-inline-elements](reference/transition-group-flip-inline-elements.md)
- List items jump instead of smoothly animating → See [transition-group-move-animation-position-absolute](reference/transition-group-move-animation-position-absolute.md)
- Vue 2 to Vue 3 TransitionGroup wrapper changes break layout → See [transition-group-no-default-wrapper-vue3](reference/transition-group-no-default-wrapper-vue3.md)
- Nested transitions cut off before finishing → See [transition-nested-duration](reference/transition-nested-duration.md)
- Scoped styles stop working in reusable transition wrappers → See [transition-reusable-scoped-style](reference/transition-reusable-scoped-style.md)
- RouterView transitions animate unexpectedly on first render → See [transition-router-view-appear](reference/transition-router-view-appear.md)
- Mixing CSS transitions and animations causes timing issues → See [transition-type-when-mixed](reference/transition-type-when-mixed.md)
- Cleanup hooks missed during rapid transition swaps → See [transition-unmount-hook-timing](reference/transition-unmount-hook-timing.md)

### Teleport
- Teleport target element not found in DOM → See [teleport-target-must-exist](reference/teleport-target-must-exist.md)
- Teleported content breaks SSR hydration → See [teleport-ssr-hydration](reference/teleport-ssr-hydration.md)
- Scoped styles not applying to teleported content → See [teleport-scoped-styles-limitation](reference/teleport-scoped-styles-limitation.md)

### Suspense
- Need to handle async errors from Suspense components → See [suspense-no-builtin-error-handling](reference/suspense-no-builtin-error-handling.md)
- Using Suspense with server-side rendering → See [suspense-ssr-hydration-issues](reference/suspense-ssr-hydration-issues.md)
- Async component loading/error UI ignored under Suspense → See [async-component-suspense-control](reference/async-component-suspense-control.md)

### SSR
- HTML differs between server and client renders → See [ssr-hydration-mismatch-causes](reference/ssr-hydration-mismatch-causes.md)

### SFC (Single File Components)
- Trying to use named exports from component script blocks → See [sfc-named-exports-forbidden](reference/sfc-named-exports-forbidden.md)
- Variables not updating in template after changes → See [sfc-script-setup-reactivity](reference/sfc-script-setup-reactivity.md)

### Plugins
- Debugging why global properties cause naming conflicts → See [plugin-global-properties-sparingly](reference/plugin-global-properties-sparingly.md)
- Plugin not working or inject returns undefined → See [plugin-install-before-mount](reference/plugin-install-before-mount.md)

### App Configuration
- App configuration methods not working after mount call → See [configure-app-before-mount](reference/configure-app-before-mount.md)
