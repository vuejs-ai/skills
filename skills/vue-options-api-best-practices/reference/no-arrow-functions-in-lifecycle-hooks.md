---
title: Never Use Arrow Functions for Options API Lifecycle Hooks
impact: HIGH
impactDescription: Arrow functions in lifecycle hooks break `this` binding to component instance
type: capability
tags: [vue3, vue2, options-api, lifecycle, arrow-functions, this-binding, mounted, created]
---

# Never Use Arrow Functions for Options API Lifecycle Hooks

**Impact: HIGH** - Using arrow functions for lifecycle hooks in the Options API prevents Vue from binding `this` to the component instance. This causes `this` to be `undefined` or reference the wrong context, leading to runtime errors when accessing component data, methods, or other properties.

Arrow functions lexically bind `this` from their enclosing scope. Vue's Options API lifecycle hooks (created, mounted, updated, unmounted, etc.) require regular functions so Vue can set `this` to the component instance at runtime.

## Task Checklist

- [ ] Always use regular function syntax for Options API lifecycle hooks
- [ ] Use ES6 method shorthand (preferred) for cleaner code
- [ ] Arrow functions ARE allowed inside lifecycle hooks for callbacks

**Incorrect:**
```javascript
export default {
  data() {
    return { message: 'Hello' }
  },
  // WRONG: Arrow function - `this` will be undefined
  created: () => {
    console.log(this.message) // Error: Cannot read property 'message' of undefined
  },
  // WRONG: Arrow function for mounted
  mounted: () => {
    this.initializePlugin() // Error: this.initializePlugin is not a function
  },
  // WRONG: Arrow function for beforeUnmount
  beforeUnmount: () => {
    this.cleanup() // Will fail!
  },
  methods: {
    initializePlugin() { /* ... */ },
    cleanup() { /* ... */ }
  }
}
```

**Correct:**
```javascript
export default {
  data() {
    return { message: 'Hello' }
  },
  // CORRECT: ES6 method shorthand (preferred)
  created() {
    console.log(this.message) // Works! this refers to component instance
  },
  // CORRECT: Regular function expression
  mounted: function() {
    this.initializePlugin() // Works!
  },
  // CORRECT: Method shorthand
  beforeUnmount() {
    this.cleanup() // Works!
  },
  methods: {
    initializePlugin() {
      // Arrow functions ARE fine for callbacks inside lifecycle hooks
      this.$nextTick(() => {
        this.isReady = true // Arrow inherits `this` from mounted
      })
    },
    cleanup() { /* ... */ }
  }
}
```

## All Affected Lifecycle Hooks

The following Options API hooks must NOT use arrow functions:
- `beforeCreate`
- `created`
- `beforeMount`
- `mounted`
- `beforeUpdate`
- `updated`
- `beforeUnmount` (Vue 3) / `beforeDestroy` (Vue 2)
- `unmounted` (Vue 3) / `destroyed` (Vue 2)
- `activated`
- `deactivated`
- `errorCaptured`
- `renderTracked`
- `renderTriggered`

## Reference
- [Vue.js Lifecycle Hooks](https://vuejs.org/guide/essentials/lifecycle.html)
- [Vue.js Options Lifecycle](https://vuejs.org/api/options-lifecycle.html)
