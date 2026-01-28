---
title: Use PropType for Complex Prop Types in Options API
impact: MEDIUM
impactDescription: Vue's runtime prop types cannot express complex TypeScript types without PropType, leading to 'any' type inference
type: best-practice
tags: [vue3, typescript, options-api, props, PropType, type-safety]
---

# Use PropType for Complex Prop Types in Options API

**Impact: MEDIUM** - Vue's runtime `props` option only supports basic constructor functions (String, Number, etc.). To type complex props like interfaces, function signatures, or union types, you must use Vue's `PropType` utility type.

## Task Checklist

- [ ] Import `PropType` from 'vue' for complex prop types
- [ ] Use `as PropType<YourType>` after `Object`, `Array`, or `Function`
- [ ] Define interfaces for your complex types
- [ ] Remember: PropType is purely for TypeScript - runtime validation only checks the constructor

## The Problem

Vue's runtime prop system uses JavaScript constructor functions, which can't express complex TypeScript types:

```typescript
// What runtime props support:
props: {
  name: String,       // OK: string
  count: Number,      // OK: number
  enabled: Boolean,   // OK: boolean
  items: Array,       // Problem: any[]
  config: Object,     // Problem: Record<string, any>
  handler: Function   // Problem: (...args: any[]) => any
}
```

## Using PropType for Complex Types

**Import and use PropType:**
```typescript
import { defineComponent, PropType } from 'vue'
// or
import type { PropType } from 'vue'

interface User {
  id: number
  name: string
  email: string
}

interface Config {
  theme: 'light' | 'dark'
  maxItems: number
}

export default defineComponent({
  props: {
    // Object with interface
    user: {
      type: Object as PropType<User>,
      required: true
    },

    // Array of typed items
    users: {
      type: Array as PropType<User[]>,
      default: () => []
    },

    // Object with union type
    config: {
      type: Object as PropType<Config>,
      default: () => ({ theme: 'light', maxItems: 10 })
    },

    // Typed function
    onSubmit: {
      type: Function as PropType<(data: User) => Promise<void>>,
      required: true
    },

    // Union of primitives
    id: {
      type: [String, Number] as PropType<string | number>,
      required: true
    },

    // Literal union type
    status: {
      type: String as PropType<'pending' | 'active' | 'completed'>,
      default: 'pending'
    }
  },

  methods: {
    async handleSubmit() {
      // Full type inference!
      await this.onSubmit(this.user)  // onSubmit is properly typed
      console.log(this.user.email)    // user.email is string
      console.log(this.config.theme)  // theme is 'light' | 'dark'
    }
  }
})
```

## Important: Runtime vs Compile-Time

PropType only affects TypeScript compilation. At runtime, Vue still only validates using the constructor:

```typescript
props: {
  user: {
    type: Object as PropType<User>,
    required: true
  }
}

// Runtime: Vue only checks typeof value === 'object'
// It does NOT validate { id, name, email } structure

// To add runtime validation, use validator:
props: {
  user: {
    type: Object as PropType<User>,
    required: true,
    validator: (user: User) => {
      return typeof user.id === 'number' &&
             typeof user.name === 'string' &&
             typeof user.email === 'string'
    }
  }
}
```

## Common PropType Patterns

### Nullable Props

```typescript
props: {
  // Optional object that can be null
  selectedItem: {
    type: Object as PropType<Item | null>,
    default: null
  }
}
```

### Enum-like Props

```typescript
type ButtonVariant = 'primary' | 'secondary' | 'danger'

props: {
  variant: {
    type: String as PropType<ButtonVariant>,
    default: 'primary',
    validator: (v: ButtonVariant) =>
      ['primary', 'secondary', 'danger'].includes(v)
  }
}
```

### Generic-like Props with Multiple Types

```typescript
props: {
  // Accept string, number, or object with id
  value: {
    type: [String, Number, Object] as PropType<string | number | { id: string }>,
    required: true
  }
}
```

### Event Handler Props

```typescript
interface ClickEventData {
  item: Item
  index: number
}

props: {
  onClick: {
    type: Function as PropType<(data: ClickEventData) => void>,
    required: false
  }
}
```

## Why Not Just Use `as`?

You might think to skip `PropType`:

```typescript
// WRONG - doesn't work as expected
props: {
  user: Object as User  // TypeScript error or incorrect inference
}

// CORRECT - use PropType
props: {
  user: Object as PropType<User>
}
```

`PropType<T>` is specifically designed to work with Vue's prop type system.

## Reference

- [Vue.js TypeScript with Options API - Typing Component Props](https://vuejs.org/guide/typescript/options-api.html#typing-component-props)
- [Vue.js Props Documentation](https://vuejs.org/guide/components/props.html)
