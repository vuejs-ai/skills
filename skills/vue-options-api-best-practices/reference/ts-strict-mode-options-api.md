---
title: Enable strict Mode for Proper Options API TypeScript Support
impact: HIGH
impactDescription: Without strict mode, 'this' in Options API components is typed as 'any', losing all type safety
type: gotcha
tags: [typescript, options-api, tsconfig, this-typing, configuration]
---

# Enable strict Mode for Proper Options API TypeScript Support

**Impact: HIGH** - Without `strict: true` (or at minimum `noImplicitThis: true`) in your tsconfig.json, the `this` context in Options API components is typed as `any`. This silently disables type checking for all property access on component instances.

## Task Checklist

- [ ] Enable `strict: true` in tsconfig.json (recommended)
- [ ] Or enable `noImplicitThis: true` at minimum
- [ ] Wrap components with `defineComponent()` for proper inference
- [ ] Verify type errors appear when accessing non-existent properties

## The Problem

TypeScript's default behavior without strict mode allows implicit `any` typing, which defeats the purpose of using TypeScript with Vue's Options API.

**tsconfig.json without strict mode:**
```json
{
  "compilerOptions": {
    "target": "ES2020"
    // No strict mode - this is DANGEROUS
  }
}
```

**Component with hidden type errors:**
```typescript
import { defineComponent } from 'vue'

export default defineComponent({
  data() {
    return {
      count: 0,
      message: 'Hello'
    }
  },
  methods: {
    increment() {
      // Without strict mode, these errors are SILENT:
      this.cont++          // Typo: should be 'count'
      this.nonExistent     // Property doesn't exist
      this.message.toFixed() // Wrong method for string
    }
  }
})
```

All of the above errors compile successfully without strict mode because `this` is implicitly `any`.

## Correct Configuration

**Recommended tsconfig.json:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "jsx": "preserve",
    "isolatedModules": true
  }
}
```

**Minimum for Options API type safety:**
```json
{
  "compilerOptions": {
    "noImplicitThis": true
  }
}
```

## What strict Mode Enables

The `strict` flag is a shorthand for enabling multiple type-checking options:

| Option | Effect |
|--------|--------|
| `noImplicitThis` | Errors on `this` with implicit `any` type |
| `noImplicitAny` | Errors on expressions with implicit `any` type |
| `strictNullChecks` | null and undefined are distinct types |
| `strictFunctionTypes` | Stricter function parameter checking |
| `strictPropertyInitialization` | Class properties must be initialized |
| `strictBindCallApply` | Stricter bind, call, apply typing |
| `alwaysStrict` | Emits "use strict" in output |

## Correct Component with Proper Typing

```typescript
import { defineComponent } from 'vue'

export default defineComponent({
  data() {
    return {
      count: 0,
      message: 'Hello'
    }
  },
  computed: {
    doubleCount(): number {
      return this.count * 2  // 'this.count' is typed as number
    }
  },
  methods: {
    increment() {
      this.count++           // Type-safe: count is number
      // this.cont++         // ERROR: Property 'cont' does not exist
    },
    greet(name: string) {
      return `${this.message}, ${name}!`  // Type-safe
    }
  }
})
```

## Common Errors After Enabling Strict Mode

### Error: Property 'xxx' does not exist

```typescript
// Before: worked silently
this.unknownProp

// After: TypeScript error
// Property 'unknownProp' does not exist on type 'ComponentPublicInstance<...>'
```

Fix by adding the property to `data()` or declaring it properly.

### Error: Object is possibly 'undefined'

```typescript
methods: {
  getFirst() {
    const items = this.items
    // Error: Object is possibly 'undefined'
    return items[0].name
  }
}
```

Fix with proper null checks:
```typescript
methods: {
  getFirst() {
    return this.items?.[0]?.name
  }
}
```

## Important: defineComponent is Required

Even with strict mode, you must use `defineComponent()` to enable proper type inference:

```typescript
// BAD - No type inference for 'this'
export default {
  data() {
    return { count: 0 }
  },
  methods: {
    increment() {
      this.count++  // 'this' is any even with strict mode!
    }
  }
}

// GOOD - Full type inference
import { defineComponent } from 'vue'

export default defineComponent({
  data() {
    return { count: 0 }
  },
  methods: {
    increment() {
      this.count++  // 'this.count' is properly typed as number
    }
  }
})
```

## Reference

- [Vue.js TypeScript Overview - tsconfig.json](https://vuejs.org/guide/typescript/overview.html#configuring-tsconfig-json)
- [Vue.js TypeScript with Options API](https://vuejs.org/guide/typescript/options-api.html)
- [TypeScript strict Mode](https://www.typescriptlang.org/tsconfig#strict)
