---
title: Vue 3.6 Vapor Mode Adoption Notes (beta)
impact: HIGH
impactDescription: helps you adopt Vue 3.6 Vapor Mode safely with correct app setup and VDOM interop patterns
type: capability
tags: vapor, vapor-mode, vue-3.6, beta, createVaporApp, vaporInteropPlugin, vdom-interop, slots, dynamic-component, directives
---

# Vue 3.6 Vapor Mode Adoption Notes (beta)

**Impact: HIGH** - helps you adopt Vue 3.6 Vapor Mode safely with correct app setup and VDOM interop patterns.

> **Version Note:** Vue 3.6 entered beta on **2025-12-23 (3.6.0-beta.1)**. This rule summarizes the key Vapor-related behavior and fixes in:
>
> - **3.6.0-beta.2 (2026-01-04)**
> - **3.6.0-beta.3 (2026-01-12)**
> - **3.6.0-beta.4 (2026-01-23)**

When adopting Vapor Mode, most breakages fall into 3 buckets:

- missing opt-in (SFC/app)
- using unsupported APIs (Vapor is a subset)
- using a beta version before a needed Vapor fix landed

## Symptoms

You may see one or more of these:

- Vapor components render / compile as if they were normal VDOM SFCs.
- Vapor components fail when mounted in a VDOM app.
- VDOM render-function components calling `slots.default()` fails / behaves unexpectedly.
- `<component :is="..." />` fails when `:is` is a **VNode** (e.g. `h(SomeComp)`), not a component type/tag.
- Vapor compiler error when using `v-if` and `v-for` on the same `<template>` element.
- Vapor runtime crash when doing `v-for` over `null` or `undefined`.
- Vapor compiler error/crash when a `<Transition>` v-if branch contains multiple children.
- Scoped styles not applied correctly to nested slotted content.
- Tooling/build errors mentioning duplicated imports like `unref` in Vapor SFC output.

## Root Cause

- **Vapor Mode is opt-in** at both the SFC level (`<script setup vapor>`) and the app level (`createVaporApp` or `vaporInteropPlugin`).
- Vapor supports a **subset** of Vue APIs; some instance APIs and patterns don’t exist.
- In the 3.6 beta series, several Vapor compiler/runtime edge cases were fixed incrementally (beta.2/beta.3/beta.4).

## Fix

### 1) Opt-in correctly (SFC + app)

#### SFC opt-in

Vapor Mode only works for SFCs using `<script setup>`. Add the `vapor` attribute:

```vue
<script setup vapor lang="ts">
// ...
</script>
```

#### App opt-in (two supported ways)

**Vapor-only app** (avoids pulling in the Virtual DOM runtime):

```ts
import { createVaporApp } from 'vue'
import App from './App.vue'

createVaporApp(App).mount('#app')
```

**VDOM app that uses Vapor components**:

```ts
import { createApp, vaporInteropPlugin } from 'vue'
import App from './App.vue'

createApp(App)
  .use(vaporInteropPlugin)
  .mount('#app')
```

### 2) Avoid unsupported APIs in Vapor components

In Vue 3.6 Vapor Mode, avoid relying on:

- Options API
- `app.config.globalProperties`
- `getCurrentInstance()` (returns `null` in Vapor components)
- `@vue:xxx` per-element lifecycle events

### 3) Custom directives: binding value is a reactive getter

Vapor directives receive the binding value as a getter `() => any`. Use `watchEffect()` and optionally return a cleanup.

```ts
import { watchEffect } from 'vue'

export const vFocus = (el: HTMLElement, value?: () => boolean) => {
  watchEffect(() => {
    if (value?.()) el.focus()
  })
}
```

### 4) VDOM interop: slots

If you’re on **Vue 3.6.0-beta.3 (2026-01-12)** or later, VDOM components can call Vapor slot functions directly:

```ts
import { defineComponent, h } from 'vue'

export default defineComponent({
  setup(_, { slots }) {
    return () => h('div', slots.default?.({ msg: 'hello' }))
  },
})
```

For maximum compatibility across render-function codebases (and to avoid mode-specific edge cases), `renderSlot()` is still safe:

```ts
import { defineComponent, h, renderSlot } from 'vue'

export default defineComponent({
  setup(_, { slots }) {
    return () => h('div', renderSlot(slots, 'default', { msg: 'hello' }))
  },
})
```

### 5) VDOM interop: dynamic components can render VNodes (3.6.0-beta.3+)

In Vapor, `<component :is="..." />` can render a **VNode** passed from VDOM code (e.g. `const Component = h(SomeComp)`), not only component types / tag strings.

This enables patterns where a VDOM component passes a VNode via slot props:

```ts
// VDOM parent (render function) passes a VNode via slot props:
slots.default?.({ Component: h(VaporComp) })

// Vapor child can render it dynamically:
// <component :is="Component" />
```

### 6) If you hit a specific error, upgrade to the right beta

#### Upgrade to 3.6.0-beta.4 (2026-01-23) if you need:

- `<Transition>` v-if branches containing multiple children.
- Scoped CSS working correctly with nested slotted content (scopeId fixes).
- `v-for` not crashing when iterating `null` / `undefined`.

Even with the `v-for` fix, prefer `items ?? []` for intent and type stability:

```vue
<div v-for="item in (items ?? [])" :key="item.id" />
```

#### Upgrade to 3.6.0-beta.3 (2026-01-12) if you need:

- `v-if` and `v-for` on the same `<template>` element.
- VDOM components calling Vapor slot functions via `slots.name?.()`.
- dynamic components rendering VNodes.

#### Upgrade to 3.6.0-beta.2 (2026-01-04) if you hit:

- duplicated `unref` import (or similar) in Vapor SFC output.

## Reference

- [Vue core changelog (3.6 betas)](https://github.com/vuejs/core/blob/main/CHANGELOG.md)
- [compiler-sfc: avoid duplicated `unref` import for Vapor mode (#14267)](https://github.com/vuejs/core/issues/14267)
- [runtime-vapor: allow VDOM components to directly invoke vapor slots via `slots.name()` (#14273)](https://github.com/vuejs/core/issues/14273)
- [vapor: support rendering VNodes in dynamic components (#14278)](https://github.com/vuejs/core/issues/14278)
- [compiler-vapor: support `v-if` and `v-for` on the same `<template>` (#14289)](https://github.com/vuejs/core/issues/14289)
- [compiler-vapor: allow multiple children in Transition v-if branch elements (#14317)](https://github.com/vuejs/core/issues/14317)
- [runtime-vapor: handle component scopeId on nested slot (#14326)](https://github.com/vuejs/core/issues/14326)
- [runtime-vapor: prevent `v-for` crash on `null` / `undefined` (#14328)](https://github.com/vuejs/core/issues/14328)
