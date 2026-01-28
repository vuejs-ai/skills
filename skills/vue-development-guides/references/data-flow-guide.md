# Data Flow Guide

This guide is SUPER important for maintaining clear and predictable data flow in your Vue.js applications. Follow these best practices when passing and receiving data between components.

## Tasks Checklist

- [ ] Follow Props Down / Events Up principle
- [ ] When using `defineProps`, follow best practices
- [ ] When using `defineEmits`, follow best practices
- [ ] When using `v-model`, follow best practices
- [ ] Use provide/inject to avoid props drilling (over ~3 layers)

---

## Main principle: Props Down / Events Up

The main principle of data flow in Vue.js is **Props Down / Events Up**, this is the most maintainable default. One-way data flow scales well. ([Reference](https://vuejs.org/guide/components/props.html#one-way-data-flow))

Bad: child reaches into parent state (tight coupling)

```ts
// ❌ e.g. cross-component mutation or global singleton objects
parentState.count++
```

Good: explicit contract

```vue
<!-- Parent -->
<Counter :count="count" @increment="count++" />
```

```vue
<!-- Child -->
<script setup lang="ts">
defineProps<{ count: number }>()
defineEmits<{ (e: 'increment'): void }>()
</script>

<template>
  <button @click="$emit('increment')">{{ count }}</button>
</template>
```

---

## `defineProps` best practices

* Treat props as your **public API**: small, stable, well-typed.
* Avoid “god props” (one prop that configures everything).
* Never mutate props (they are readonly).

### Prefer props destructuring with defaults (Vue 3.5+)

In Vue 3.5+, destructured values from `defineProps()` remain reactive, and you can use native JS defaults.

```ts
const { size = 'md' } = defineProps<{
  size?: 'sm' | 'md' | 'lg'
}>()
```

---

## `defineEmits` best practices

Good: prefer tuple syntax for event payloads.

```ts
const emit = defineEmits<{
  change: [id: number] // named tuple syntax
  update: [value: string]
}>()
```

## `v-model` best practices

Good: prefer `defineModel()` for component `v-model`:

```vue
<script setup lang="ts">
const model = defineModel<string>()
</script>

<template>
  <input v-model="model" />
</template>
```

---

## Provide / Inject

Use provide/inject to avoid props drilling (over ~3 layers).

Good for shared context:

* Forms (validation context)
* Theme / design tokens
* Parent-child coordination APIs
* Dependency injection (services)

In TypeScript, prefer `InjectionKey<T>` and keep keys in a shared module.

Bad: deep prop drilling

```vue
<!-- App -> Layout -> Page -> Card -> Button -->
<Button :theme="theme" :locale="locale" :permissions="permissions" />
```

Good: provide context once

```ts
// keys.ts
import type { InjectionKey, Ref } from 'vue'

export type Theme = 'light' | 'dark'
export const themeKey: InjectionKey<Ref<Theme>> = Symbol('theme')
```

```vue
<!-- Parent.vue -->
<script setup lang="ts">
import { provide, ref } from 'vue'
import { themeKey } from './keys'

const theme = ref<"light" | "dark">('light')
provide(themeKey, theme)
</script>
```

```vue
<!-- DeepChild.vue -->
<script setup lang="ts">
import { inject } from 'vue'
import { themeKey } from './keys'

const theme = inject(themeKey)
if (!theme) throw new Error('themeKey was not provided')
</script>
```
