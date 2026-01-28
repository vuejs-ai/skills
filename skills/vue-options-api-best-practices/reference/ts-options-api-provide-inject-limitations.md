---
title: Provide/Inject Has Limited Type Inference in Options API
impact: MEDIUM
impactDescription: Injected properties in Options API are not automatically typed, requiring manual type assertions or type augmentation
type: gotcha
tags: [vue3, typescript, options-api, provide-inject, type-safety]
---

# Provide/Inject Has Limited Type Inference in Options API

**Impact: MEDIUM** - When using `provide/inject` with the Options API and TypeScript, injected properties won't be automatically typed. TypeScript will show errors that the property doesn't exist on the component, even though it works at runtime.

## Task Checklist

- [ ] Be aware that Options API inject has limited type support
- [ ] Use type augmentation to add types to injected values
- [ ] Consider using typed computed wrappers for injected values

## The Problem

```typescript
// Provider component (parent)
import { defineComponent } from 'vue'

export default defineComponent({
  provide() {
    return {
      theme: 'dark',
      user: { id: 1, name: 'John' }
    }
  }
})
```

```typescript
// Consumer component (child) - Options API
import { defineComponent } from 'vue'

export default defineComponent({
  inject: ['theme', 'user'],

  mounted() {
    // TypeScript Error: Property 'theme' does not exist on type...
    console.log(this.theme)

    // TypeScript Error: Property 'user' does not exist on type...
    console.log(this.user.name)
  }
})
```

## Solution 1: Type Augmentation

Augment the component type to include injected properties:

```typescript
// types/injections.d.ts
import 'vue'

declare module 'vue' {
  interface ComponentCustomProperties {
    theme: 'light' | 'dark'
    user: { id: number; name: string }
  }
}

export {}
```

```typescript
// Consumer component - now typed
import { defineComponent } from 'vue'

export default defineComponent({
  inject: ['theme', 'user'],

  mounted() {
    // Now works - typed from ComponentCustomProperties
    console.log(this.theme)  // 'light' | 'dark'
    console.log(this.user.name)  // string
  }
})
```

**Note**: This adds types globally to ALL components, not just those that inject these values.

## Solution 2: Typed Computed Wrappers

Use the object syntax with computed property wrappers for type safety:

```typescript
import { defineComponent } from 'vue'

interface User {
  id: number
  name: string
}

export default defineComponent({
  inject: {
    theme: {
      from: 'theme',
      default: 'light'
    },
    user: {
      from: 'user',
      default: () => ({ id: 0, name: 'Guest' })
    }
  },

  computed: {
    // Type via computed wrapper
    typedTheme(): 'light' | 'dark' {
      return this.theme as 'light' | 'dark'
    },
    typedUser(): User {
      return this.user as User
    }
  },

  mounted() {
    console.log(this.typedTheme)
    console.log(this.typedUser.name)
  }
})
```

## Why This Happens

The Options API `inject` array syntax `inject: ['theme']` doesn't provide type information to TypeScript. Vue knows about the injection at runtime, but TypeScript's static analysis can't trace the provide/inject relationship across components.

## Reference

- [Vue.js Provide/Inject](https://vuejs.org/guide/components/provide-inject.html)
- [GitHub Issue: Add type inference to Options API provide/inject](https://github.com/vuejs/core/issues/3031)
