---
title: Transition Component Best Practices
impact: MEDIUM
impactDescription: Transition animates a single element or component; incorrect structure or keys prevent animations
type: best-practice
tags: [vue3, transition, animation, performance, keys]
---

# Transition Component Best Practices

**Impact: MEDIUM** - `<Transition>` animates entering/leaving of a single element or component. It is ideal for toggling UI states, swapping views, or animating one component at a time.

## Table of Contents

- Use Transition for a single root element
- Force transitions between same element types with `key`
- Use `mode` to avoid overlap during swaps
- Animate `transform` and `opacity` for performance

## Task Checklist

- [ ] Wrap a single element or component inside `<Transition>`
- [ ] Provide a `key` when switching between same element types
- [ ] Use `mode="out-in"` when you need sequential swaps
- [ ] Prefer `transform` and `opacity` for smooth animations

## Use Transition for a Single Root Element

`<Transition>` only supports one direct child. Wrap multiple nodes in a single element or component.

**Incorrect:**
```vue
<template>
  <Transition name="fade">
    <h3>Title</h3>
    <p>Description</p>
  </Transition>
</template>
```

**Correct:**
```vue
<template>
  <Transition name="fade">
    <div>
      <h3>Title</h3>
      <p>Description</p>
    </div>
  </Transition>
</template>
```

## Force Transitions Between Same Element Types

Vue reuses the same DOM element when the tag type does not change. Add `key` so Vue treats it as a new element and triggers enter/leave.

**Incorrect:**
```vue
<template>
  <Transition name="fade">
    <p v-if="isActive">Active</p>
    <p v-else>Inactive</p>
  </Transition>
</template>
```

**Correct:**
```vue
<template>
  <Transition name="fade" mode="out-in">
    <p v-if="isActive" key="active">Active</p>
    <p v-else key="inactive">Inactive</p>
  </Transition>
</template>
```

## Use `mode` to Avoid Overlap During Swaps

When swapping components or views, use `mode="out-in"` to prevent both from being visible at the same time.

**Incorrect:**
```vue
<template>
  <Transition name="fade">
    <component :is="currentView" />
  </Transition>
</template>
```

**Correct:**
```vue
<template>
  <Transition name="fade" mode="out-in">
    <component :is="currentView" :key="currentView" />
  </Transition>
</template>
```

## Animate `transform` and `opacity` for Performance

Avoid layout-triggering properties such as `height`, `margin`, or `top`. Use `transform` and `opacity` for smooth, GPU-friendly transitions.

**Incorrect:**
```css
.slide-enter-active,
.slide-leave-active {
  transition: height 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  height: 0;
}
```

**Correct:**
```css
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-enter-from {
  transform: translateX(-12px);
  opacity: 0;
}

.slide-leave-to {
  transform: translateX(12px);
  opacity: 0;
}
```

## References

- [Vue.js Transition](https://vuejs.org/guide/built-ins/transition.html)
- [Vue.js Transition Modes](https://vuejs.org/guide/built-ins/transition.html#transition-modes)
