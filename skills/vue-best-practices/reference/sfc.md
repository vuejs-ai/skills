---
title: Single-File Component Structure and Styling Patterns
impact: MEDIUM
impactDescription: Consistent SFC structure and styling choices improve maintainability, tooling support, and render performance
type: best-practice
tags: [vue3, sfc, scoped-css, styles, build-tools, performance]
---

# Single-File Component Structure and Styling Patterns

**Impact: MEDIUM** - Using SFCs with consistent structure and performant styling keeps components easier to maintain and avoids unnecessary render overhead.

## Task Checklist

- [ ] Use `.vue` SFCs when you have a build setup (Vite, Vue CLI)
- [ ] Colocate template, script, and styles in the same SFC by default
- [ ] Use PascalCase for component names in templates and filenames
- [ ] Prefer local component registration (import in each component) by default
- [ ] Use props/emit for component communication; reserve refs for imperative actions
- [ ] Prefer class selectors (not element selectors) in scoped CSS for performance
- [ ] Use camelCase keys in `:style` bindings for consistency and IDE support

## Use SFCs with build tools

**Incorrect:**
```javascript
// component.js - loses SFC tooling and scoped styles
export default {
  template: `
    <div class="container">
      <h1>{{ title }}</h1>
      <button @click="handleClick">Click</button>
    </div>
  `,
  data() {
    return { title: 'Hello' }
  },
  methods: {
    handleClick() {}
  }
}
```

**Correct:**
```vue
<script setup>
import { ref } from 'vue'

const title = ref('Hello')

function handleClick() {}
</script>

<template>
  <div class="container">
    <h1>{{ title }}</h1>
    <button @click="handleClick">Click</button>
  </div>
</template>

<style scoped>
.container {
  padding: 1rem;
}
</style>
```

## Colocate template, script, and styles

**Incorrect:**
```
components/
├── UserCard.vue
├── UserCard.js
└── UserCard.css
```

**Correct:**
```vue
<!-- components/UserCard.vue -->
<script setup>
import { computed } from 'vue'

const props = defineProps({
  user: { type: Object, required: true }
})

const displayName = computed(() =>
  `${props.user.firstName} ${props.user.lastName}`
)
</script>

<template>
  <div class="user-card">
    <h3 class="name">{{ displayName }}</h3>
  </div>
</template>

<style scoped>
.user-card {
  padding: 1rem;
}

.name {
  margin: 0;
}
</style>
```

## Use PascalCase for component names

**Less ideal:**
```vue
<script setup>
import userProfile from './user-profile.vue'
</script>

<template>
  <user-profile :user="currentUser" />
</template>
```

**Recommended:**
```vue
<script setup>
import UserProfile from './UserProfile.vue'
</script>

<template>
  <UserProfile :user="currentUser" />
</template>
```

## Prefer local component registration

**Incorrect:**
```javascript
// main.ts - global registration for many components
app.component('Card', Card)
app.component('Modal', Modal)
app.component('Table', Table)
```

**Correct:**
```vue
<script setup>
import Card from '@/components/Card.vue'
import UserAvatar from '@/components/UserAvatar.vue'
</script>

<template>
  <Card>
    <UserAvatar :user="currentUser" />
  </Card>
</template>
```

## Prefer props/emit over component refs

**Incorrect:**
```vue
<script setup>
import { ref } from 'vue'
import UserForm from './UserForm.vue'

const formRef = ref(null)

function submitForm() {
  if (formRef.value.isValid) {
    formRef.value.submit()
  }
}
</script>

<template>
  <UserForm ref="formRef" />
  <button @click="submitForm">Submit</button>
</template>
```

**Correct:**
```vue
<script setup>
import UserForm from './UserForm.vue'

function handleSubmit(formData) {
  api.submit(formData)
}
</script>

<template>
  <UserForm @submit="handleSubmit" />
</template>
```

## Use class selectors in scoped CSS

**Incorrect:**
```vue
<template>
  <article>
    <h1>{{ title }}</h1>
    <p>{{ subtitle }}</p>
  </article>
</template>

<style scoped>
article { max-width: 800px; }
h1 { font-size: 2rem; }
p { line-height: 1.6; }
</style>
```

**Correct:**
```vue
<template>
  <article class="article">
    <h1 class="article-title">{{ title }}</h1>
    <p class="article-subtitle">{{ subtitle }}</p>
  </article>
</template>

<style scoped>
.article { max-width: 800px; }
.article-title { font-size: 2rem; }
.article-subtitle { line-height: 1.6; }
</style>
```

## Use camelCase in `:style` bindings

**Incorrect:**
```vue
<template>
  <div :style="{ 'font-size': fontSize + 'px', 'background-color': bg }">
    Content
  </div>
</template>
```

**Correct:**
```vue
<template>
  <div :style="{ fontSize: fontSize + 'px', backgroundColor: bg }">
    Content
  </div>
</template>
```

## Reference
- [Vue.js Introduction - Single-File Components](https://vuejs.org/guide/introduction.html#single-file-components)
- [Vue.js SFC Syntax Specification](https://vuejs.org/api/sfc-spec.html)
- [Vue.js Scoped CSS](https://vuejs.org/api/sfc-css-features.html#scoped-css)
- [Vue.js Class and Style Bindings](https://vuejs.org/guide/essentials/class-and-style.html)
- [Vue.js Component Registration](https://vuejs.org/guide/components/registration.html)
- [Vue.js Component Name Casing](https://vuejs.org/guide/components/registration.html#component-name-casing)
- [Vue.js Component Events](https://vuejs.org/guide/components/events.html)
