---
title: Explicitly Annotate Computed Property Return Types
impact: LOW
impactDescription: While Vue usually infers computed types correctly, explicit annotations prevent circular inference issues and improve code documentation
type: best-practice
tags: [vue3, typescript, options-api, computed, type-inference]
---

# Explicitly Annotate Computed Property Return Types

**Impact: LOW** - Vue can usually infer computed property return types automatically. However, explicit return type annotations prevent edge cases involving circular inference loops and serve as documentation for complex computed properties.

## Task Checklist

- [ ] Consider adding return types to computed properties, especially complex ones
- [ ] Always add return types when TypeScript inference fails or shows incorrect types
- [ ] Add return types for writable computed properties (getter and setter)

## When Explicit Types Are Helpful

### 1. Complex Computed Properties

```typescript
import { defineComponent } from 'vue'

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
}

export default defineComponent({
  data() {
    return {
      items: [] as CartItem[],
      discountPercent: 10
    }
  },
  computed: {
    // Without annotation - works but intent unclear
    cartSummary() {
      return {
        subtotal: this.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
        itemCount: this.items.reduce((sum, item) => sum + item.quantity, 0)
      }
    },

    // With annotation - clear intent, documented type
    cartSummaryTyped(): { subtotal: number; itemCount: number; discount: number; total: number } {
      const subtotal = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const discount = subtotal * (this.discountPercent / 100)
      return {
        subtotal,
        itemCount: this.items.reduce((sum, item) => sum + item.quantity, 0),
        discount,
        total: subtotal - discount
      }
    }
  }
})
```

### 2. Circular Inference Issues

Sometimes computed properties that reference each other can cause TypeScript inference to fail:

```typescript
export default defineComponent({
  data() {
    return {
      firstName: 'John',
      lastName: 'Doe'
    }
  },
  computed: {
    // Explicit return type breaks potential circular inference
    fullName(): string {
      return `${this.firstName} ${this.lastName}`
    },

    // References fullName - explicit type prevents inference issues
    greeting(): string {
      return `Hello, ${this.fullName}!`
    }
  }
})
```

### 3. Writable Computed Properties

Always annotate writable computed properties for clarity:

```typescript
export default defineComponent({
  data() {
    return {
      firstName: 'John',
      lastName: 'Doe'
    }
  },
  computed: {
    // Writable computed - explicit types for getter and setter
    fullName: {
      get(): string {
        return `${this.firstName} ${this.lastName}`
      },
      set(newValue: string) {
        const parts = newValue.split(' ')
        this.firstName = parts[0] || ''
        this.lastName = parts.slice(1).join(' ') || ''
      }
    }
  }
})
```

## When You Can Skip Explicit Types

Simple computed properties that TypeScript infers correctly:

```typescript
computed: {
  // Simple string - TypeScript infers correctly
  upperName() {
    return this.name.toUpperCase()
  },

  // Simple boolean - TypeScript infers correctly
  isEmpty() {
    return this.items.length === 0
  },

  // Simple number - TypeScript infers correctly
  totalCount() {
    return this.items.length
  }
}
```

## Interface for Complex Return Types

For complex computed return types, define interfaces:

```typescript
interface PaginationInfo {
  currentPage: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
  pageItems: Item[]
}

export default defineComponent({
  computed: {
    pagination(): PaginationInfo {
      const totalPages = Math.ceil(this.items.length / this.pageSize)
      const start = (this.currentPage - 1) * this.pageSize

      return {
        currentPage: this.currentPage,
        totalPages,
        hasNext: this.currentPage < totalPages,
        hasPrev: this.currentPage > 1,
        pageItems: this.items.slice(start, start + this.pageSize)
      }
    }
  }
})
```

## Debugging Type Inference

If you're unsure what TypeScript infers, hover over the computed property in your IDE, or add a temporary annotation to see errors:

```typescript
computed: {
  // Hover over 'mystery' in IDE to see inferred type
  mystery() {
    return this.someComplexCalculation()
  },

  // Or add annotation to verify
  mystery(): ExpectedType {  // Error if inference differs
    return this.someComplexCalculation()
  }
}
```

## Reference

- [Vue.js TypeScript with Options API - Typing Computed Properties](https://vuejs.org/guide/typescript/options-api.html#typing-computed-properties)
