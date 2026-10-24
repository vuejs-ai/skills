---
title: Component Fallthrough Attributes Best Practices
impact: MEDIUM
impactDescription: Wrong attr keys return undefined, state derived from attrs can go stale, and calling listeners from attrs can run parent handlers twice
type: best-practice
tags: [vue3, attrs, fallthrough-attributes, composition-api, reactivity]
---

# Component Fallthrough Attributes Best Practices

**Impact: MEDIUM** - `attrs` keeps hyphenated attribute names as-is and stores listeners under camelCase `onX` keys, and Vue doesn't support observing it from script. Wrong keys return `undefined`, and state derived from `attrs` can miss changes.

## Task List

- Access hyphenated attribute names with bracket notation (for example `attrs['data-testid']`)
- Access event listeners with camelCase `onX` keys (for example `attrs.onClick`)
- Watch or derive state from props, not `attrs`
- Use `onUpdated()` for side effects that need the latest attrs
- For component events, use `defineEmits()` and `emit()` instead of calling listeners from `attrs`

## Access Attribute and Listener Keys Correctly

Hyphenated attribute names preserve their original casing in JavaScript, so dot notation does not work for keys that include `-`.

**BAD:**
```vue
<script setup>
import { useAttrs } from 'vue'

const attrs = useAttrs()

console.log(attrs.data-testid)  // Parsed as attrs.data - testid
console.log(attrs.dataTestid)   // undefined for data-testid
console.log(attrs['on-click'])  // undefined
console.log(attrs['@click'])    // undefined
</script>
```

**GOOD:**
```vue
<script setup>
import { useAttrs } from 'vue'

const attrs = useAttrs()

console.log(attrs['data-testid'])
console.log(attrs['aria-label'])
console.log(attrs['foo-bar'])

console.log(attrs.onClick)
console.log(attrs.onCustomEvent)
console.log(attrs.onMouseEnter)
</script>
```

### Naming Reference

| Parent Usage | Access in `attrs` |
|--------------|-------------------|
| `class="foo"` | `attrs.class` |
| `data-id="123"` | `attrs['data-id']` |
| `aria-label="..."` | `attrs['aria-label']` |
| `foo-bar="baz"` | `attrs['foo-bar']` |
| `@click="fn"` | `attrs.onClick` |
| `@custom-event="fn"` | `attrs.onCustomEvent` |
| `@update:modelValue="fn"` | `attrs['onUpdate:modelValue']` |

Listeners for events declared in `defineEmits()` are not in `attrs`.

## Use Props, Not `attrs`, for Values the Component Reacts To

Vue's docs don't support observing `attrs` with watchers and recommend props instead. Code that watches or derives state from `attrs` relies on unsupported behavior and can miss changes, such as an attr added after mount.

**BAD:**
```vue
<script setup>
import { computed, watch, useAttrs } from 'vue'

const attrs = useAttrs()

watch(
  () => attrs.someAttr,
  (newValue) => {
    console.log('Changed:', newValue)
  }
)

const hasTestId = computed(() => 'data-testid' in attrs) // Misses attrs added later
</script>
```

**GOOD:**
```vue
<script setup>
import { watch } from 'vue'

const props = defineProps({
  someAttr: String
})

watch(
  () => props.someAttr,
  (newValue) => {
    console.log('Changed:', newValue)
  }
)
</script>
```

For side effects that need the latest attrs, use `onUpdated()`. It runs after every re-render of the component, not on initial mount.

**GOOD:**
```vue
<script setup>
import { onUpdated, useAttrs } from 'vue'

const attrs = useAttrs()

onUpdated(() => {
  console.log('Latest attrs:', attrs)
})
</script>
```

## Emit Events Instead of Calling Listeners From `attrs`

A listener for an undeclared event stays in `attrs` and also falls through to the root element. Calling it manually from a root handler runs the parent's handler twice. `inheritAttrs: false` avoids the second call but stops `class` and other attrs from falling through, and binding them back with `v-bind="attrs"` re-attaches the listener. Declaring the event with `defineEmits()` removes the listener from `attrs` and from fallthrough.

**BAD:**
```vue
<script setup>
import { useAttrs } from 'vue'

const attrs = useAttrs()

function handleClick(event) {
  console.log('Internal handling first')
  attrs.onClick?.(event)
}
</script>

<template>
  <button @click="handleClick">
    <slot />
  </button>
</template>
```

**GOOD:**
```vue
<script setup>
const emit = defineEmits(['click'])

function handleClick(event) {
  console.log('Internal handling first')
  emit('click', event)
}
</script>

<template>
  <button @click="handleClick">
    <slot />
  </button>
</template>
```

## TypeScript Notes

`useAttrs()` is typed as `Record<string, unknown>`, so cast individual keys when needed.

```vue
<script setup lang="ts">
import { useAttrs } from 'vue'

const attrs = useAttrs()

const testId = attrs['data-testid'] as string | undefined
const ariaLabel = attrs['aria-label'] as string | undefined
</script>
```
