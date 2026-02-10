---
title: Component Slots Best Practices
impact: MEDIUM
impactDescription: Poor slot API design causes empty DOM wrappers, weak TypeScript safety, brittle defaults, and unnecessary component overhead
type: best-practice
tags: [vue3, slots, components, typescript, composables]
---

# Component Slots Best Practices

**Impact: MEDIUM** - Slots are a core component API surface in Vue. Structure them intentionally so templates stay predictable, typed, and performant.

## Task Checklist

- [ ] Use shorthand syntax for named slots (`#` instead of `v-slot:`)
- [ ] Render optional slot wrapper elements only when slot content exists (`$slots` checks)
- [ ] Type scoped slot contracts with `defineSlots` in TypeScript components
- [ ] Provide fallback content for optional slots
- [ ] Prefer composables over renderless components for pure logic reuse

## Shorthand syntax for named slots

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

## Conditionally Render Optional Slot Wrappers

Use `$slots` checks when wrapper elements add spacing, borders, or layout constraints.

**Incorrect:**
```vue
<!-- Card.vue -->
<template>
  <article class="card">
    <header class="card-header">
      <slot name="header" />
    </header>

    <section class="card-body">
      <slot />
    </section>

    <footer class="card-footer">
      <slot name="footer" />
    </footer>
  </article>
</template>
```

**Correct:**
```vue
<!-- Card.vue -->
<template>
  <article class="card">
    <header v-if="$slots.header" class="card-header">
      <slot name="header" />
    </header>

    <section v-if="$slots.default" class="card-body">
      <slot />
    </section>

    <footer v-if="$slots.footer" class="card-footer">
      <slot name="footer" />
    </footer>
  </article>
</template>
```

## Type Scoped Slot Props with defineSlots

In `<script setup lang="ts">`, use `defineSlots` so slot consumers get autocomplete and static checks.

**Incorrect:**
```vue
<!-- ProductList.vue -->
<script setup lang="ts">
interface Product {
  id: number
  name: string
}

defineProps<{ products: Product[] }>()
</script>

<template>
  <ul>
    <li v-for="(product, index) in products" :key="product.id">
      <slot :product="product" :index="index" />
    </li>
  </ul>
</template>
```

**Correct:**
```vue
<!-- ProductList.vue -->
<script setup lang="ts">
interface Product {
  id: number
  name: string
}

defineProps<{ products: Product[] }>()

defineSlots<{
  default(props: { product: Product; index: number }): any
  empty(): any
}>()
</script>

<template>
  <ul v-if="products.length">
    <li v-for="(product, index) in products" :key="product.id">
      <slot :product="product" :index="index" />
    </li>
  </ul>
  <slot v-else name="empty" />
</template>
```

## Provide Slot Fallback Content

Fallback content makes components resilient when parents omit optional slots.

**Incorrect:**
```vue
<!-- SubmitButton.vue -->
<template>
  <button type="submit" class="btn-primary">
    <slot />
  </button>
</template>
```

**Correct:**
```vue
<!-- SubmitButton.vue -->
<template>
  <button type="submit" class="btn-primary">
    <slot>Submit</slot>
  </button>
</template>
```

## Prefer Composables for Pure Logic Reuse

Renderless components are still useful for slot-driven composition, but composables are usually cleaner for logic-only reuse.

**Incorrect (unnecessary renderless abstraction):**
```vue
<!-- MouseTracker.vue -->
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const x = ref(0)
const y = ref(0)

function onMove(event: MouseEvent) {
  x.value = event.pageX
  y.value = event.pageY
}

onMounted(() => window.addEventListener('mousemove', onMove))
onUnmounted(() => window.removeEventListener('mousemove', onMove))
</script>

<template>
  <slot :x="x" :y="y" />
</template>
```

**Correct (composable for logic):**
```ts
// composables/useMouse.ts
import { ref, onMounted, onUnmounted } from 'vue'

export function useMouse() {
  const x = ref(0)
  const y = ref(0)

  function onMove(event: MouseEvent) {
    x.value = event.pageX
    y.value = event.pageY
  }

  onMounted(() => window.addEventListener('mousemove', onMove))
  onUnmounted(() => window.removeEventListener('mousemove', onMove))

  return { x, y }
}
```

```vue
<!-- MousePosition.vue -->
<script setup lang="ts">
import { useMouse } from '@/composables/useMouse'

const { x, y } = useMouse()
</script>

<template>
  <p>{{ x }}, {{ y }}</p>
</template>
```

## Reference

- [Vue.js Slots](https://vuejs.org/guide/components/slots.html)
- [Vue.js Slots - Conditional Slots](https://vuejs.org/guide/components/slots.html#conditional-slots)
- [Vue.js Slots - Fallback Content](https://vuejs.org/guide/components/slots.html#fallback-content)
- [Vue.js Slots - TypeScript](https://vuejs.org/guide/components/slots.html#slots-with-typescript)
- [Vue.js Composables](https://vuejs.org/guide/reusability/composables.html)
