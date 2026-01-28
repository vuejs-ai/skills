---
title: Never Use Arrow Functions in Methods Option
impact: HIGH
impactDescription: Arrow functions prevent Vue from binding `this` to the component instance
type: capability
tags: [vue3, vue2, options-api, methods, this-binding]
---

# Never Use Arrow Functions in Methods Option

**Impact: HIGH** - Using arrow functions in the `methods` option causes `this` to be `undefined` or the wrong context, leading to runtime errors when trying to access component data, computed properties, or other methods.

Arrow functions lexically bind `this` from their enclosing scope, not from the object they're defined on. Vue's `methods` option requires regular functions so Vue can bind `this` to the component instance.

## Task Checklist

- [ ] Always use regular function syntax for methods in Options API
- [ ] If using ES6 shorthand, use method shorthand (preferred)
- [ ] Arrow functions ARE allowed inside methods for callbacks

**Incorrect:**
```javascript
export default {
  data() {
    return { count: 0 }
  },
  methods: {
    // WRONG: Arrow function - `this` will be undefined
    increment: () => {
      this.count++ // Error: Cannot read property 'count' of undefined
    },
    // WRONG: Arrow function assigned to property
    decrement: () => {
      this.count--
    }
  }
}
```

**Correct:**
```javascript
export default {
  data() {
    return { count: 0 }
  },
  methods: {
    // CORRECT: ES6 method shorthand (preferred)
    increment() {
      this.count++ // Works! this refers to component instance
    },
    // CORRECT: Traditional function expression
    decrement: function() {
      this.count--
    },
    // Arrow functions ARE fine for callbacks INSIDE methods
    fetchData() {
      fetch('/api/data')
        .then(response => response.json())
        .then(data => {
          this.data = data // Arrow function inherits `this` from fetchData
        })
    }
  }
}
```

## Reference
- [Vue.js Methods - Avoid Arrow Functions](https://vuejs.org/guide/essentials/reactivity-fundamentals.html#methods)
