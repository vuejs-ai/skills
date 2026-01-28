---
title: Always Use defineComponent for TypeScript Type Inference
impact: HIGH
impactDescription: Without defineComponent, TypeScript cannot infer types for props, computed properties, methods, or the 'this' context in Options API components
type: best-practice
tags: [vue3, typescript, options-api, defineComponent, type-inference]
---

# Always Use defineComponent for TypeScript Type Inference

**Impact: HIGH** - When using TypeScript with Vue's Options API, you MUST wrap your component definition with `defineComponent()` to enable proper type inference. Without it, `this` is typed as `any`, losing all TypeScript benefits.

## Task Checklist

- [ ] Always import and use `defineComponent` from 'vue' for Options API components
- [ ] Enable `strict: true` (or at minimum `noImplicitThis: true`) in tsconfig.json
- [ ] Consider migrating to Composition API with `<script setup>` for better type inference

## The Problem

Vue's Options API relies heavily on the `this` context, which TypeScript cannot automatically type without `defineComponent`:

**BAD - No type inference:**
```typescript
// No defineComponent - 'this' is typed as 'any'
export default {
  props: {
    message: String
  },
  computed: {
    // 'this' is 'any' - no type checking!
    greeting() {
      return this.message + '!'  // No type inference
    }
  },
  methods: {
    // 'this' is 'any' - mistakes won't be caught
    handleClick() {
      console.log(this.mesage)  // Typo not caught!
    }
  }
}
```

**GOOD - Full type inference:**
```typescript
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    message: {
      type: String,
      required: true
    },
    count: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      localState: ''
    }
  },
  computed: {
    // 'this.message' is typed as string
    // 'this.count' is typed as number
    greeting(): string {
      return this.message + '!'
    }
  },
  methods: {
    handleClick() {
      console.log(this.mesage)  // Error: Property 'mesage' does not exist
      console.log(this.message)  // OK: string
    }
  }
})
```

## What defineComponent Enables

1. **Props type inference**: Vue infers types from `type`, `required`, and `default`
2. **`this` context typing**: All options (data, computed, methods) are properly typed
3. **Cross-option references**: Access data in methods, computed properties, etc. with full types
4. **IDE autocompletion**: Get suggestions for all component properties and methods

## TypeScript Configuration Required

For proper `this` type checking, enable strict mode or at minimum `noImplicitThis`:

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    // Or at minimum:
    "noImplicitThis": true
  }
}
```

Without this, TypeScript allows implicit `any` for `this`, defeating the purpose of using `defineComponent`.

## defineComponent is a No-Op at Runtime

`defineComponent` does nothing at runtime - it simply returns the object you pass to it. Its only purpose is to help TypeScript infer types:

```typescript
// At runtime, this is equivalent to:
// export default { props: { ... }, ... }
export default defineComponent({
  props: { /* ... */ }
})
```

This means there's zero runtime cost to using `defineComponent`.

## When to Use defineComponent vs script setup

| Approach | Use Case |
|----------|----------|
| `defineComponent` | Options API, Class-based migration, JSX/TSX components |
| `<script setup>` | New components, better type inference, less boilerplate |

**Official recommendation**: "While Vue does support TypeScript usage with Options API, it is recommended to use Vue with TypeScript via Composition API as it offers simpler, more efficient and more robust type inference."

## With Vue Single-File Components

```vue
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'MyComponent',
  props: {
    title: {
      type: String,
      required: true
    }
  },
  computed: {
    upperTitle(): string {
      return this.title.toUpperCase()
    }
  }
})
</script>

<template>
  <h1>{{ upperTitle }}</h1>
</template>
```

## Common Mistake: Missing defineComponent

This often happens when copying JavaScript components to TypeScript:

```typescript
// Copied from JS - MISSING defineComponent!
export default {
  name: 'MyComponent',
  // ... entire component without type inference
}
```

Always add `defineComponent` when converting to TypeScript.

## Reference

- [Vue.js TypeScript with Options API](https://vuejs.org/guide/typescript/options-api.html)
- [Vue.js Using Vue with TypeScript](https://vuejs.org/guide/typescript/overview.html)
