---
title: Directive Best Practices
impact: MEDIUM
impactDescription: Custom directives are powerful but easy to misuse; following patterns prevents leaks, invalid usage, and unclear abstractions
type: best-practice
tags: [vue3, directives, custom-directives, composition]
---

# Directive Best Practices

**Impact: MEDIUM** - Directives are for low-level DOM access. Use them sparingly, keep them side-effect safe, and prefer components or composables when you need stateful or reusable UI behavior.

## Table of Contents

- Treat directive arguments as read-only
- Avoid directives on components
- Clean up side effects in `unmounted`
- Prefer function shorthand for single-hook directives
- Use the `v-` prefix and script setup registration
- Prefer declarative templates when possible
- Decide between directives and components

## Task Checklist

- [ ] Use directives only when you need direct DOM access
- [ ] Do not mutate directive arguments or binding objects
- [ ] Clean up timers, listeners, and observers in `unmounted`
- [ ] Register directives in `<script setup>` with the `v-` prefix
- [ ] Prefer components or composables for complex behavior

## Treat Directive Arguments as Read-Only

Directive bindings are not reactive storage. Don’t write to them.

```ts
const vFocus = {
  mounted(el, binding) {
    // binding.value is read-only
    el.focus()
  }
}
```

## Avoid Directives on Components

Directives apply to DOM elements. When used on components, they attach to the root element and can break if the root changes.

```vue
<!-- Prefer applying to an element inside the component -->
<MyInput v-focus />
```

## Clean Up Side Effects in `unmounted`

Any timers, listeners, or observers must be removed to avoid leaks.

```ts
const vResize = {
  mounted(el) {
    const observer = new ResizeObserver(() => {})
    observer.observe(el)
    el._observer = observer
  },
  unmounted(el) {
    el._observer?.disconnect()
  }
}
```

## Prefer Function Shorthand for Single-Hook Directives

If you only need `mounted`/`updated`, use the function form.

```ts
const vAutofocus = (el) => el.focus()
```

## Use the `v-` Prefix and Script Setup Registration

```vue
<script setup>
const vFocus = (el) => el.focus()
</script>

<template>
  <input v-focus />
</template>
```

## Prefer Declarative Templates When Possible

If a standard attribute or binding works, use it instead of a directive.

## Decide Between Directives and Components

Use a directive for DOM-level behavior. Use a component when behavior affects structure, state, or rendering.

## References

- [Vue.js Custom Directives](https://vuejs.org/guide/reusability/custom-directives.html)
