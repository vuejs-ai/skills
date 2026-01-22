---
title: Vue 3.5+ Deep Watch Numeric Depth
impact: MEDIUM
impactDescription: enables efficient array mutation watching with numeric deep option
type: capability
tags: watch, deep, vue-3.5, array, mutation, performance
---

# Vue 3.5+ Deep Watch Numeric Depth

**Impact: MEDIUM** - enables efficient array mutation watching with numeric deep option

Vue 3.5 introduced `deep: number` for watch depth control. This allows watching array mutations without the performance cost of deep traversal.

## Symptoms

- Array mutations not triggering watch callback
- Deep watch causing performance issues on large nested objects
- Unaware of new Vue 3.5 feature

> **Note:** TypeScript error "Type 'number' is not assignable to type 'boolean'" no longer occurs with Vue 3.5+ and current TypeScript versions. The types now correctly support numeric `deep` values.

## The Feature

```typescript
// Vue 3.5+ only
watch(items, (newVal) => {
  // Triggered on array mutations (push, pop, splice, etc.)
}, { deep: 1 })
```

| deep value | Behavior |
|------------|----------|
| `true` | Full recursive traversal (original behavior) |
| `false` | Only reference changes |
| `1` | One level deep - array mutations, not nested objects |
| `2` | Two levels deep |
| `n` | N levels deep |

## Fix

**Step 1: Ensure Vue 3.5+**
```bash
npm install vue@^3.5.0
```

**Step 2: Use numeric depth**
```typescript
import { watch, ref } from 'vue'

const items = ref([{ id: 1, data: { nested: 'value' } }])

// Watch array mutations only (push, pop, etc.)
watch(items, (newItems) => {
  console.log('Array mutated')
}, { deep: 1 })

// Won't trigger on: items.value[0].data.nested = 'new'
// Will trigger on: items.value.push(newItem)
```

## Performance Comparison

```typescript
const largeNestedData = ref({ /* deeply nested structure */ })

// SLOW - traverses entire structure
watch(largeNestedData, handler, { deep: true })

// FAST - only watches top-level changes
watch(largeNestedData, handler, { deep: 1 })

// FASTEST - only reference changes
watch(largeNestedData, handler, { deep: false })
```

## Alternative: watchEffect for Selective Tracking

```typescript
// Only tracks properties actually accessed
watchEffect(() => {
  // Only re-runs when items.value.length or first item changes
  console.log(items.value.length, items.value[0]?.id)
})
```

## TypeScript Note

If TypeScript complains about numeric deep, ensure:
1. Vue version is 3.5+
2. TypeScript version is current (types are included with `vue` package)
3. tsconfig targets correct node_modules types

## Reference

- [Vue Watchers Docs](https://vuejs.org/guide/essentials/watchers.html)
- [Vue 3.5 Release Notes](https://blog.vuejs.org/posts/vue-3-5)
