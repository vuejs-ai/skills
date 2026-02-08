---
title: Component Data Flow Best Practices
impact: HIGH
impactDescription: Clear data flow between components prevents state bugs, stale UI, and brittle coupling
type: best-practice
tags: [vue3, props, emits, v-model, provide-inject, data-flow, typescript]
---

# Component Data Flow Best Practices

**Impact: HIGH** - Vue components stay reliable when data flow is explicit: props go down, events go up, `v-model` handles two-way bindings, and provide/inject supports cross-tree dependencies. Blurring these boundaries leads to stale state, hidden coupling, and hard-to-debug UI.

## Table of Contents

- Props: one-way data down
- Emits: explicit events up
- `v-model`: predictable two-way bindings
- Provide/Inject: shared context without prop drilling
- Use TypeScript contracts for public component APIs

## Task Checklist

- [ ] Treat props as read-only inputs
- [ ] Emit events instead of mutating parent state directly
- [ ] Use `defineModel` for v-model in modern Vue (3.4+)
- [ ] Handle v-model modifiers deliberately in child components
- [ ] Use symbols for provide/inject keys to avoid collisions
- [ ] Keep mutations in the provider or expose explicit actions
- [ ] In TypeScript projects, prefer type-based `defineProps`, `defineEmits`, and `InjectionKey`

## Props: One-Way Data Down

Props are inputs. Do not mutate them in the child. If state needs to change, emit an event or create a local copy.

**Incorrect:**
```vue
<script setup>
const props = defineProps({ count: Number })

function increment() {
  props.count++
}
</script>
```

**Correct:**
```vue
<script setup>
const props = defineProps({ count: Number })
const emit = defineEmits(['update:count'])

function increment() {
  emit('update:count', props.count + 1)
}
</script>
```

## Emits: Explicit Events Up

Component events do not bubble. If a parent needs to know about an event, re-emit it explicitly.

**Incorrect:**
```vue
<!-- Parent expects "saved" from grandchild, but it won't bubble -->
<Child @saved="onSaved" />
```

**Correct:**
```vue
<!-- Child.vue -->
<script setup>
const emit = defineEmits(['saved'])

function onGrandchildSaved(payload) {
  emit('saved', payload)
}
</script>

<template>
  <Grandchild @saved="onGrandchildSaved" />
</template>
```

**Event naming:** use kebab-case in templates and camelCase in script:
```vue
<script setup>
const emit = defineEmits(['updateUser'])
</script>

<template>
  <ProfileForm @update-user="emit('updateUser', $event)" />
</template>
```

## `v-model`: Predictable Two-Way Bindings

Use `defineModel` by default for component bindings and emit updates on input. Only use the `modelValue` + `update:modelValue` pattern if you are on Vue < 3.4.

**Incorrect:**
```vue
<script setup>
const props = defineProps({ value: String })
</script>

<template>
  <input :value="props.value" @input="$emit('input', $event.target.value)" />
</template>
```

**Correct (Modern, Vue 3.4+):**
```vue
<script setup>
const model = defineModel({ type: String })
</script>

<template>
  <input v-model="model" />
</template>
```

**Correct (Outdated, Vue < 3.4):**
```vue
<script setup>
const props = defineProps({ modelValue: String })
const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <input
    :value="props.modelValue"
    @input="emit('update:modelValue', $event.target.value)"
  />
</template>
```

If you need the updated value immediately after a change, use the input event value or `nextTick` in the parent.

## Provide/Inject: Shared Context Without Prop Drilling

Use provide/inject for cross-tree state, but keep mutations centralized in the provider and expose explicit actions.

**Incorrect:**
```vue
// Provider.vue
provide('theme', reactive({ dark: false }))

// Consumer.vue
const theme = inject('theme')
// Mutating shared state from any depth becomes hard to track
theme.dark = true
```

**Correct:**
```vue
// Provider.vue
const theme = reactive({ dark: false })
const toggleTheme = () => { theme.dark = !theme.dark }

provide(themeKey, readonly(theme))
provide(themeActionsKey, { toggleTheme })

// Consumer.vue
const theme = inject(themeKey)
const { toggleTheme } = inject(themeActionsKey)
```

Use symbols for keys to avoid collisions in large apps:
```ts
export const themeKey = Symbol('theme')
export const themeActionsKey = Symbol('theme-actions')
```

## Use TypeScript Contracts for Public Component APIs

In TypeScript projects, type component boundaries directly with `defineProps`, `defineEmits`, and `InjectionKey` so invalid payloads and mismatched injections fail at compile time.

**Incorrect:**
```vue
<script setup lang="ts">
import { inject } from 'vue'

const props = defineProps({
  userId: String
})

const emit = defineEmits(['save'])
const settings = inject('settings')

// Payload shape is not checked here
emit('save', 123)

// Key is string-based and not type-safe
settings?.theme = 'dark'
</script>
```

**Correct:**
```vue
<script setup lang="ts">
import { inject, provide } from 'vue'
import type { InjectionKey } from 'vue'

interface Props {
  userId: string
}

interface Emits {
  save: [payload: { id: string; draft: boolean }]
}

interface Settings {
  theme: 'light' | 'dark'
}

const settingsKey: InjectionKey<Settings> = Symbol('settings')

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

provide(settingsKey, { theme: 'light' })

const settings = inject(settingsKey)
if (settings) {
  emit('save', { id: props.userId, draft: false })
}
</script>
```

## References

- [Vue.js Props](https://vuejs.org/guide/components/props.html)
- [Vue.js Emits](https://vuejs.org/guide/components/events.html)
- [Vue.js v-model](https://vuejs.org/guide/components/v-model.html)
- [Vue.js Provide/Inject](https://vuejs.org/guide/components/provide-inject.html)
