---
title: Use Arrow Functions for Prop Validators in TypeScript < 4.7
impact: HIGH
impactDescription: Regular functions in prop validators can break type inference for the entire component in TypeScript versions before 4.7
type: gotcha
tags: [vue3, typescript, options-api, props, type-inference, defineComponent, legacy]
---

# Use Arrow Functions for Prop Validators in TypeScript < 4.7

> **LEGACY CONCERN:** This issue was fixed in TypeScript 4.7 (released May 2022). Most modern projects using TypeScript 4.7+ do not need this workaround. If you're starting a new project or have upgraded TypeScript recently, you can safely use regular functions in prop validators. This rule is primarily relevant for legacy codebases still running TypeScript < 4.7.

**Impact: HIGH** - If your TypeScript version is less than 4.7, using regular functions for `validator` and `default` prop options can cause TypeScript to fail when inferring the type of `this`, which breaks type inference for the ENTIRE component, not just the prop.

## Task Checklist

- [ ] Check your TypeScript version (`tsc --version`)
- [ ] If TypeScript < 4.7, use arrow functions for all `validator` and `default` prop options
- [ ] Consider upgrading to TypeScript 4.7+ to avoid this limitation entirely

## The Problem

TypeScript needs to infer the type of `this` inside regular functions. In Vue's Options API context, this inference can fail in versions before 4.7, causing cascading type inference failures.

**BAD - Can break type inference in TS < 4.7:**
```typescript
import { defineComponent, PropType } from 'vue'

interface Book {
  title: string
  author: string
  year: number
}

export default defineComponent({
  props: {
    book: {
      type: Object as PropType<Book>,
      required: true,
      // Regular function - causes inference issues in TS < 4.7
      validator: function(book: Book) {
        return book.title.length > 0
      }
    },
    count: {
      type: Number,
      // Regular function - causes inference issues in TS < 4.7
      default: function() {
        return 0
      }
    }
  },
  // Type inference for computed, methods, etc. may break!
  computed: {
    bookTitle() {
      // 'this' might be typed as 'any' due to broken inference
      return this.book.title
    }
  }
})
```

**GOOD - Use arrow functions:**
```typescript
import { defineComponent, PropType } from 'vue'

interface Book {
  title: string
  author: string
  year: number
}

export default defineComponent({
  props: {
    book: {
      type: Object as PropType<Book>,
      required: true,
      // Arrow function - safe for all TS versions
      validator: (book: Book) => book.title.length > 0
    },
    count: {
      type: Number,
      // Arrow function - safe for all TS versions
      default: () => 0
    }
  },
  computed: {
    bookTitle() {
      // 'this' is properly typed
      return this.book.title  // Type: string
    }
  }
})
```

## Why Arrow Functions Work

Arrow functions don't have their own `this` binding, so TypeScript doesn't need to infer a `this` type for them. This avoids the type inference bug that affects regular functions in older TypeScript versions.

## For Object/Array Default Values

Arrow functions are especially important for object and array defaults (which Vue requires to be functions anyway):

```typescript
props: {
  config: {
    type: Object as PropType<Config>,
    // Must be a function, use arrow syntax
    default: () => ({
      enabled: true,
      maxItems: 10
    })
  },
  tags: {
    type: Array as PropType<string[]>,
    // Must be a function, use arrow syntax
    default: () => []
  }
}
```

## When You Can Ignore This

- **TypeScript 4.7+**: This issue was fixed in TypeScript 4.7 (May 2022). If your project uses 4.7 or later, regular functions work fine. Since TypeScript 4.7 has been available for over 3 years, most actively maintained projects have already upgraded and do not need this workaround.
- **New projects**: If you're starting a new Vue project in 2024 or later, you'll almost certainly be using TypeScript 4.7+ by default and can ignore this rule entirely.
- **Arrow functions are still fine**: While not required in modern TypeScript, using arrow functions for validators and defaults remains a valid stylistic choice and causes no issues.

## Checking Your TypeScript Version

```bash
# Check installed TypeScript version
npx tsc --version

# Or check package.json
grep typescript package.json
```

## Reference

- [Vue.js TypeScript with Options API](https://vuejs.org/guide/typescript/options-api.html#caveats)
- [TypeScript 4.7 Release Notes](https://devblogs.microsoft.com/typescript/announcing-typescript-4-7/)
