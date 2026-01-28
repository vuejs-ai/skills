---
title: Create Stateful Methods in Lifecycle Hooks
impact: MEDIUM
impactDescription: Stateful functions like debounce/throttle in methods are shared across all component instances
type: capability
tags: [vue3, options-api, debounce, throttle, lifecycle, cleanup]
---

# Create Stateful Methods in Lifecycle Hooks

**Impact: MEDIUM** - If you define debounced, throttled, or other stateful functions directly in the `methods` option, all instances of the component share the same function state. This causes race conditions and bugs in lists of components.

When a component is reused (e.g., in v-for), each instance needs its own debounced/throttled function. Define these in the `created()` hook and clean them up in `unmounted()` to prevent memory leaks.

## Task Checklist

- [ ] Never define debounced/throttled functions directly in `methods`
- [ ] Create stateful functions in `created()` lifecycle hook
- [ ] Always clean up (cancel timers) in `unmounted()`

**Incorrect:**
```javascript
import { debounce } from 'lodash-es'

export default {
  methods: {
    // WRONG: All component instances share this debounced function!
    // If used in a v-for, clicking one button affects all instances
    handleClick: debounce(function() {
      this.performSearch()
    }, 500)
  }
}
```

**Correct:**
```javascript
import { debounce } from 'lodash-es'

export default {
  created() {
    // CORRECT: Each instance gets its own debounced function
    this.debouncedSearch = debounce(this.performSearch, 500)
  },
  unmounted() {
    // CORRECT: Clean up to prevent memory leaks and stale calls
    this.debouncedSearch.cancel()
  },
  methods: {
    handleClick() {
      this.debouncedSearch()
    },
    performSearch() {
      // Actual search logic
    }
  }
}
```

## Reference
- [Vue.js Reactivity Fundamentals - Stateful Methods](https://vuejs.org/guide/essentials/reactivity-fundamentals.html#stateful-methods)
