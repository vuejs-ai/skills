---
title: Reactivity Core Patterns (ref, shallowRef, computed)
impact: MEDIUM
impactDescription: Consistent reactivity patterns keep state predictable and avoid unnecessary overhead in Vue 3 apps
type: efficiency
tags: [vue3, reactivity, ref, reactive, shallowRef, computed, watchEffect, external-state, best-practice]
---

# Reactivity Core Patterns (ref, shallowRef, computed)

**Impact: MEDIUM** - Standardizing how you declare state and derive values makes components easier to reason about and reduces reactivity overhead.

These patterns cover the default choices for local state, large or external data, and derived values.

## Task Checklist

- [ ] Default to `ref()` for local state that can be replaced or is a primitive
- [ ] Use `reactive()` only for tightly related state you will mutate in place
- [ ] Use `shallowRef()` for large data or external state objects
- [ ] Use `computed()` for derived values; reserve `watchEffect()` for side effects

## Prefer `ref()` for local state

**Incorrect:**
```javascript
import { reactive } from 'vue'

// Avoid: reactive for primitive or replaceable state
const count = reactive(0)
let state = reactive({ items: [] })

// Replacing the whole object loses intent and consistency
state = reactive({ items: [1, 2, 3] })
```

**Correct:**
```javascript
import { ref } from 'vue'

const count = ref(0)
const state = ref({ items: [] })

// Replace the whole value explicitly
state.value = { items: [1, 2, 3] }
```

## Use `shallowRef()` for large or external data

**Incorrect:**
```javascript
import { ref } from 'vue'

// Deep proxying a huge payload adds overhead
const users = ref(await fetchUsers())
```

**Correct:**
```javascript
import { shallowRef } from 'vue'

const users = shallowRef(await fetchUsers())

// Replace the value to trigger updates
users.value = await fetchUsers()
```

## External state integration pattern

**Incorrect:**
```javascript
import { reactive } from 'vue'

// External state gets deeply proxied and mutated in place
const store = reactive(createExternalStore())
store.state.count++
```

**Correct:**
```javascript
import { shallowRef, readonly } from 'vue'

const state = shallowRef(createExternalStore().getState())

function dispatch(action) {
  const nextState = reduce(state.value, action)
  state.value = nextState
}

export const store = {
  state: readonly(state),
  dispatch,
}
```

## Computed

### Prefer computed for derived state instead of watcher

**Incorrect:**
```javascript
import { ref, watchEffect } from 'vue'

const items = ref([{ price: 10 }, { price: 20 }])
const total = ref(0)

watchEffect(() => {
  total.value = items.value.reduce((sum, item) => sum + item.price, 0)
})
```

**Correct:**
```javascript
import { ref, computed } from 'vue'

const items = ref([{ price: 10 }, { price: 20 }])

const total = computed(() =>
  items.value.reduce((sum, item) => sum + item.price, 0)
)
```

### Use computed for cached derivations (vs methods)

**Incorrect:**
```vue
<template>
  <!-- Runs on every re-render -->
  <p>{{ getFilteredItems() }}</p>
</template>

<script setup>
import { ref } from 'vue'

const items = ref([{ name: 'A', active: true }, { name: 'B', active: false }])

function getFilteredItems() {
  return items.value.filter(item => item.active)
}
</script>
```

**Correct:**
```vue
<template>
  <!-- Cached until items change -->
  <p>{{ filteredItems }}</p>
</template>

<script setup>
import { ref, computed } from 'vue'

const items = ref([{ name: 'A', active: true }, { name: 'B', active: false }])

const filteredItems = computed(() => {
  return items.value.filter(item => item.active)
})
</script>
```

### Use computed for complex class/style bindings

**Incorrect:**
```vue
<template>
  <button
    :class="{
      'btn': true,
      'btn-primary': type === 'primary' && !disabled,
      'btn-secondary': type === 'secondary' && !disabled,
      'btn-disabled': disabled,
      'btn-loading': isLoading
    }"
  >
    {{ label }}
  </button>
</template>
```

**Correct:**
```vue
<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: { type: String, default: 'primary' },
  disabled: Boolean,
  isLoading: Boolean,
  label: String
})

const buttonClasses = computed(() => ({
  btn: true,
  [`btn-${props.type}`]: !props.disabled,
  'btn-disabled': props.disabled,
  'btn-loading': props.isLoading
}))
</script>

<template>
  <button :class="buttonClasses">
    {{ label }}
  </button>
</template>
```

## Reference
- [Vue.js Reactivity Fundamentals](https://vuejs.org/guide/essentials/reactivity-fundamentals.html)
- [Vue.js shallowRef API](https://vuejs.org/api/reactivity-advanced.html#shallowref)
- [Vue.js computed API](https://vuejs.org/api/reactivity-core.html#computed)
- [Vue.js watchEffect API](https://vuejs.org/api/reactivity-core.html#watcheffect)
- [Vue.js Computed Caching vs Methods](https://vuejs.org/guide/essentials/computed.html#computed-caching-vs-methods)
- [Vue.js Class and Style Bindings](https://vuejs.org/guide/essentials/class-and-style.html)
