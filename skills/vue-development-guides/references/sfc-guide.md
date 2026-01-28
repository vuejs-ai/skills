# Vue SFC Guide

## Tasks Checklist

- [ ] Used `v-for` and `v-if` correctly
- [ ] Followed slot best practices
- [ ] Access DOM / component refs correctly
- [ ] Handled fallthrough attributes (`$attrs`) correctly if needed
- [ ] Used component-scoped styles appropriately

---

## `v-for` best practices

### Always provide a stable `:key`

* Prefer primitive keys (`string | number`).
* Avoid using objects as keys.

Good

```vue
<li v-for="item in items" :key="item.id">
  <input v-model="item.text" />
</li>
```

### Avoid `v-if` and `v-for` on the same element

It leads to unclear intent and unnecessary work.
([Reference](https://vuejs.org/guide/essentials/list.html#v-for-with-v-if))

**To filter items**
Bad

```vue
<li v-for="user in users" v-if="user.active" :key="user.id">
  {{ user.name }}
</li>
```

Good: filter in computed

```vue
<script setup lang="ts">
import { computed } from 'vue'

const activeUsers = computed(() => users.value.filter(u => u.active))
</script>

<template>
  <li v-for="user in activeUsers" :key="user.id">
    {{ user.name }}
  </li>
</template>
```

**To conditionally show/hide the entire list**
Good: move `v-if` to a container element or `<template>`

```vue
<ul v-if="shouldShowUsers">
  <li v-for="user in users" :key="user.id">
    {{ user.name }}
  </li>
</ul>
```

## Slot best practices

### Shorthand syntax for named slots

Bad: use verbose syntax
```vue
<MyComponent>
  <template v-slot:header> ... </template>
</MyComponent>
```

Good: use shorthand syntax
```vue
<MyComponent>
  <template #header> ... </template>
</MyComponent>
```

[Reference](https://vuejs.org/guide/components/slots.html#named-slots)

## Access DOM / component refs

For Vue 3.5+: use `useTemplateRef()` to access template refs.

Good

```vue
<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue'

const inputRef = useTemplateRef<HTMLInputElement>('input')

onMounted(() => {
  inputRef.value?.focus()
})
</script>

<template>
  <input ref="input" />
</template>
```

## Fallthrough attributes (`$attrs`)

Fallthrough attributes let consumers pass `class`, `id`, `aria-*`, and listeners onto your component’s root by default.

When you need control:

* Disable inheritance
* Forward `$attrs` to the real target

Good: disable inheritance + forward `$attrs`

```vue
<script setup lang="ts">
// Vue 3.3+ macro
defineOptions({ inheritAttrs: false })
</script>

<template>
  <div class="wrapper">
    <BaseInput v-bind="$attrs" />
  </div>
</template>
```

## Prefer component-scoped styles

* Use `<style scoped>` for styles that belong to a component.
* Keep **global CSS** in a dedicated file (e.g. `src/assets/main.css`) for resets, typography, tokens, etc.
* Use `:deep()` sparingly (edge cases only).

Bad: global styles inside random components

```vue
<style>
/* ❌ leaks everywhere */
button { border-radius: 999px; }
</style>
```

Good: scoped by default

```vue
<style scoped>
.button { border-radius: 999px; }
</style>
```

Good: global CSS belongs in a global entry

```css
/* src/assets/main.css */
/* ✅ resets, tokens, typography, app-wide rules */
:root { --radius: 999px; }
```
