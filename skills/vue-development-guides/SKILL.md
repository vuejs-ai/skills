---
name: vue-development-guides
description: A collection of best practices and tips for developing applications using Vue.js. This skill MUST be apply when developing, refactoring or reviewing Vue.js or Nuxt projects.
license: MIT
metadata:
  author: github.com/vuejs-ai
  version: "17.0.0"
compatibility: Requires Vue 3 (or above) or Nuxt 3 (or above) project
---

# Vue.js Development Guides

## Tasks Checklist

- [ ] Followed the core principles
- [ ] Followed the defaults unless there is a good reason not to
- [ ] Followed the reactivity best practices
- [ ] Followed the component best practices
  - [ ] Followed the Vue SFC best practices
  - [ ] Kept components focused
    - [ ] Split large components into smaller ones when needed
    - [ ] Moved state/side effects into composables if applicable
  - [ ] Followed data flow best practices

---

## Core Principles
- **Keep state predictable:** one source of truth, derive everything else.
- **Make data flow explicit:** Props down, Events up for most cases.
- **Favor small, focused components:** easier to test, reuse, and maintain.
- **Avoid unnecessary re-renders:** use computed properties and watchers wisely.
- **Readability counts:** write clear, self-documenting code.

## Defaults (unless the user says otherwise)

- Prefer the **Composition API** over the Options API.

## Reactivity

IMPORTANT: You MUST follow the `references/reactivity-guide.md` for reactive state management when creating, updating a component or a composable.

## Components

IMPORTANT: You MUST follow the `references/sfc-guide.md` for best practices when working with Vue SFCs.

- Prefer Vue Single-File Components (SFC) using **`<script setup lang="ts">`** (TypeScript) by default.
- In Vue SFCs, keep sections in this order: `<script>` → `<template>` → `<style>`.

### Keep components focused

Split a component when it has **more than one clear responsibility** (e.g. data orchestration + UI, or multiple independent UI sections).

- Prefer **smaller components + composables** over one “mega component”
- Move **UI sections** into child components (props in, events out).
- Move **state/side effects** into composables (`useXxx()`).

NOTE: This rule also applies to the entry component (e.g. App.vue) in a Vue / Nuxt project by default.

### Data Flow

IMPORTANT: You MUST follow the `references/data-flow-guide.md` for passing and receiving data between components using:
- Props
- Emits
- `v-model`
- provide/inject

For sharing data across the app, please follow the `references/state-management-guide.md` and consider using a Store for state management solution.
