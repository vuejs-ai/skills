# State Management Guide (Stores)

## Tasks Checklist

- [ ] Chose an appropriate store approach if applicable
  - [ ] Followed best practices for store usage

---

## Choosing a store approach

### Option 1: Store-pattern composable (singleton composable)

* Suitable for Vue SPA and **non-SSR** apps
* Great for small apps
* Dependency-free

Example

```ts
// useMyStore.ts
import { ref, readonly } from 'vue'

let _state: ReturnType<typeof createState> | null = null

function createState() {
  const state = ref<Record<string, boolean>>({})

  async function load() {
    state.value = await fetchData()
  }

  return {
    state: readonly(state),
    load,
  }
}

export function useMyStore() {
  if (!_state) _state = createState()
  return _state
}
```

### Option 2: VueUse [`createGlobalState`](https://vueuse.org/shared/createGlobalState/)

* Suitable for Vue SPA and **non-SSR** apps
* Ideal for small to medium apps
* Requires VueUse

### Option 3: [Pinia](https://pinia.vuejs.org/)

* **Strongly recommended** for Nuxt and SSR apps
* Ideal when you need DevTools support, persistence plugins, or action tracing
* Suitable for large-scale apps
* Requires Pinia
