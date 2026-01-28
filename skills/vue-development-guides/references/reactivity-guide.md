# Reactivity Guide

## Tasks Checklist

- [ ] Declare reactive state correctly
- [ ] Avoid destructuring from `reactive()` directly
- [ ] Watch correctly for `reactive` state if needed
- [ ] Follow `computed()` best practices
- [ ] Clean up async effects for watchers

---

## Declare reactive state correctly in Vue.js

### Primitive values (string, number, boolean, null, etc.)

- Always use `shallowRef()` instead of `ref()` for better performance.

### Objects / arrays / Map / Set

- `ref()`:
  - Use when you often **replace the whole value** (`state.value = newObj`) and still want deep reactivity for nested fields.
- `reactive()`:
  - Use when you mainly **mutate properties** (`state.count++`, `state.nested.x = ...`) and full replacement is uncommon.
- `shallowRef()`:
  - Use for **opaque/non-reactive objects** (class instances, external libs, very large nested data).
  - Only triggers updates when you replace `state.value` (no deep tracking).
- `shallowReactive()`:
  - Use when you want **only top-level properties reactive**; nested objects stay raw.

Bad: using `reactive()` for replaceable state. ([Reference](https://vuejs.org/guide/essentials/reactivity-fundamentals.html#limitations-of-reactive))

```ts
let user = reactive({ id: 1, name: 'Tom' })

async function reload() {
  // ❌ Replacing the proxy breaks references held elsewhere
  user = reactive(await fetchUser())
}
```

Good: use a `ref()` for replaceable objects

```ts
const user = ref<{ id: number; name: string }>()

async function reload() {
  user.value = await fetchUser()
}
```

## Avoid destructuring from `reactive()` directly

Bad: Destructuring breaks reactivity for primitives.

```ts
const state = reactive({ count: 0 })
const { count } = state // ❌ disconnected from reactivity
```

### Watch correctly for reactive

Bad: passing a non-getter value into `watch()`

```ts
const state = reactive({ count: 0 })

// ❌ watch expects a getter, ref, reactive object, or array of these
watch(state.count, () => { /* ... */ })
```

Good: preserve reactivity with `toRefs()` and use a getter for `watch()`

```ts
const state = reactive({ count: 0 })
const { count } = toRefs(state) // ✅ count is a ref

watch(() => state.count, () => { /* ... */ }) // ✅
```

## `computed()` best practices

### Keep computed getters pure (no side effects)

A computed getter should only derive a value. No mutation, no API calls, no storage writes, no event emits.
([Reference](https://vuejs.org/guide/essentials/computed.html#best-practices))

Bad: side effects inside computed

```ts
const count = ref(0)

const doubled = computed(() => {
  // ❌ side effect
  if (count.value > 10) console.warn('Too big!')
  return count.value * 2
})
```

Good: pure computed + `watch()` for side effects

```ts
const count = ref(0)
const doubled = computed(() => count.value * 2)

watch(count, (value) => {
  if (value > 10) console.warn('Too big!')
})
```

### Prefer computed over “derived state stored in refs”

If a value is fully derived from other state, **store the source of truth** and compute the derived value.

```ts
const firstName = ref('John')
const lastName = ref('Doe')

// ❌ derived state stored and manually synced
const fullName = ref('John Doe')
watch([firstName, lastName], () => {
  fullName.value = `${firstName.value} ${lastName.value}`
})

// ✅ single source of truth + derived value
const fullName = computed(() => `${firstName.value} ${lastName.value}`)
```

### Computed vs function call in templates

* `computed()` is cached based on dependencies.
* Methods/functions run whenever the component renders.

Bad: expensive work inside template method

```vue
<script setup lang="ts">
const items = ref<number[]>([])

function expensiveFilter(values: number[]) {
  // ❌ imagine this is heavy
  return values.filter(x => x % 2 === 0).sort((a, b) => a - b)
}
</script>

<template>
  <div>{{ expensiveFilter(items) }}</div>
</template>
```

Good: computed for expensive derived data

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'

const items = ref<number[]>([])

const filtered = computed(() => {
  return items.value
    .filter(x => x % 2 === 0)
    .sort((a, b) => a - b)
})
</script>

<template>
  <div>{{ filtered }}</div>
</template>
```

## Clean up async effects for watchers

When reacting to rapid changes (search boxes, filters), cancel the previous request.

Good

```ts
const query = ref('')
const results = ref<string[]>([])

watch(query, async (q, _prev, onCleanup) => {
  const controller = new AbortController()
  onCleanup(() => controller.abort())

  const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, {
    signal: controller.signal,
  })

  results.value = await res.json()
})
```
