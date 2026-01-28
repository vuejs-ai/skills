---
title: Vue JSX Uses HTML Attributes Not React Conventions
impact: MEDIUM
impactDescription: Using className or htmlFor in Vue JSX causes TypeScript errors and inconsistent code style
type: gotcha
tags: [vue3, jsx, tsx, render-function]
---

# Vue JSX Uses HTML Attributes Not React Conventions

**Impact: MEDIUM** - Vue's JSX transform uses standard HTML attribute names (`class`, `for`) instead of React's JavaScript-friendly names (`className`, `htmlFor`). With proper TypeScript configuration, using React conventions like `className` or `htmlFor` will produce TypeScript errors, which is good for catching these inconsistencies early. Note that Vue's runtime is lenient and will actually convert these attributes correctly, but using HTML attributes is the recommended practice for consistency with Vue templates and proper type safety.

When writing JSX in Vue, use the same attribute names you would use in regular HTML templates. This is a fundamental difference from React's JSX where `class` and `for` are reserved JavaScript keywords.

## Task Checklist

- [ ] Use `class` instead of `className` in Vue JSX
- [ ] Use `for` instead of `htmlFor` in Vue JSX
- [ ] Use standard HTML event names with `on` prefix (onClick, onInput)
- [ ] When migrating React components to Vue, update all attribute names
- [ ] Configure TypeScript properly for Vue JSX type inference

**Incorrect (React-style):**
```jsx
// AVOID: React conventions cause TypeScript errors in Vue JSX
// (Vue runtime is lenient and converts these, but types don't allow them)
export default {
  setup() {
    return () => (
      <div className="container">
        <label htmlFor="email">Email:</label>
        <input id="email" className="input-field" />
      </div>
    )
  }
}
```

```tsx
// AVOID: TypeScript will reject className/htmlFor with Vue's JSX types
const Button = () => (
  <button
    className="btn btn-primary"  // TS error: Property 'className' does not exist
    htmlFor="form"               // TS error: Property 'htmlFor' does not exist
  >
    Submit
  </button>
)
```

**Correct (Vue-style):**
```jsx
// CORRECT: Use standard HTML attributes
export default {
  setup() {
    return () => (
      <div class="container">
        <label for="email">Email:</label>
        <input id="email" class="input-field" />
      </div>
    )
  }
}
```

```tsx
// CORRECT: Vue TSX with HTML attributes
const Button = () => (
  <button
    class="btn btn-primary"
  >
    Submit
  </button>
)
```

## TypeScript Configuration for Vue JSX

To enable proper type inference and IntelliSense for Vue JSX/TSX, configure your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "jsx": "preserve",
    "jsxImportSource": "vue"
  }
}
```

Starting from Vue 3.4, Vue no longer implicitly registers the global JSX namespace, so `jsxImportSource` is required for TypeScript to use Vue's JSX type definitions.

## Vite Configuration

For Vite projects, ensure you have the JSX plugin configured in `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

export default defineConfig({
  plugins: [vue(), vueJsx()]
})
```

## Other Attribute Differences

| React JSX | Vue JSX | HTML |
|-----------|---------|------|
| className | class | class |
| htmlFor | for | for |
| onChange | onInput (for live updates) | oninput |
| tabIndex | tabindex | tabindex |
| readOnly | readonly | readonly |

## Event Handling in Vue JSX

```jsx
// Vue JSX event handling
export default {
  setup() {
    const handleClick = () => console.log('clicked')
    const handleInput = (e) => console.log(e.target.value)

    return () => (
      <div>
        <button onClick={handleClick}>Click</button>
        <input onInput={handleInput} />

        {/* Event modifiers via helper */}
        <div onClick={withModifiers(handleClick, ['self'])}>
          Only triggers on self
        </div>
      </div>
    )
  }
}
```

## Reference
- [Vue.js JSX and TSX](https://vuejs.org/guide/extras/render-function.html#jsx-tsx)
