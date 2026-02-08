---
title: Single-File Component Structure, Styling, and Template Patterns
impact: MEDIUM
impactDescription: Consistent SFC structure and styling choices improve maintainability, tooling support, and render performance
type: best-practice
tags: [vue3, sfc, scoped-css, styles, build-tools, performance, template, v-html, v-for, computed, v-if, v-show]
---

# Single-File Component Structure, Styling, and Template Patterns

**Impact: MEDIUM** - Using SFCs with consistent structure and performant styling keeps components easier to maintain and avoids unnecessary render overhead.

## Task Checklist

- [ ] Use `.vue` SFCs when you have a build setup (Vite, Vue CLI)
- [ ] Colocate template, script, and styles in the same SFC by default
- [ ] Use PascalCase for component names in templates and filenames
- [ ] Prefer local component registration (import in each component) by default
- [ ] Use props/emit for component communication; reserve refs for imperative actions
- [ ] When refs are required for imperative APIs, type them with `InstanceType<typeof Component> | null`
- [ ] Prefer class selectors (not element selectors) in scoped CSS for performance
- [ ] Use camelCase keys in `:style` bindings for consistency and IDE support
- [ ] Never use `v-html` with untrusted/user-provided content
- [ ] Use computed properties (not inline expressions/method calls) for filtered or sorted lists
- [ ] Choose `v-if` vs `v-show` based on toggle frequency and initial render cost

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

## Type component refs when imperative access is required

Prefer props/emits by default. When a parent must call an exposed child method, type the ref explicitly and expose only the intended API from the child.

**Incorrect:**
```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DialogPanel from './DialogPanel.vue'

const panelRef = ref(null)

onMounted(() => {
  panelRef.value.open()
})
</script>

<template>
  <DialogPanel ref="panelRef" />
</template>
```

**Correct:**
```vue
<!-- DialogPanel.vue -->
<script setup lang="ts">
function open() {}

defineExpose({ open })
</script>
```

```vue
<!-- Parent.vue -->
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import DialogPanel from './DialogPanel.vue'

const panelRef = ref<InstanceType<typeof DialogPanel> | null>(null)

onMounted(() => {
  panelRef.value?.open()
})
</script>

<template>
  <DialogPanel ref="panelRef" />
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

## Never render untrusted HTML with `v-html`

**Incorrect:**
```vue
<template>
  <!-- DANGEROUS: untrusted input can inject scripts -->
  <article v-html="userProvidedContent"></article>
</template>
```

**Correct:**
```vue
<script setup>
import { computed } from 'vue'
import DOMPurify from 'dompurify'

const props = defineProps<{
  trustedHtml?: string
  plainText: string
}>()

const safeHtml = computed(() => DOMPurify.sanitize(props.trustedHtml ?? ''))
</script>

<template>
  <!-- Preferred: escaped interpolation -->
  <p>{{ props.plainText }}</p>

  <!-- Only for trusted/sanitized HTML -->
  <article v-html="safeHtml"></article>
</template>
```

## Use computed for filtered/sorted lists

**Incorrect:**
```vue
<template>
  <!-- Recalculates every render -->
  <li v-for="item in items.filter(i => i.isActive)" :key="item.id">
    {{ item.name }}
  </li>

  <!-- Also recalculates every render -->
  <li v-for="item in getSortedItems()" :key="item.id">
    {{ item.name }}
  </li>
</template>
```

**Correct:**
```vue
<script setup>
import { computed, ref } from 'vue'

const items = ref([
  { id: 1, name: 'A', isActive: true },
  { id: 2, name: 'B', isActive: false }
])

const visibleItems = computed(() => {
  return items.value
    .filter(item => item.isActive)
    .sort((a, b) => a.name.localeCompare(b.name))
})
</script>

<template>
  <li v-for="item in visibleItems" :key="item.id">
    {{ item.name }}
  </li>
</template>
```

## Choose `v-if` vs `v-show` by toggle behavior

**Incorrect:**
```vue
<template>
  <!-- Frequent toggles with v-if cause repeated mount/unmount -->
  <ComplexPanel v-if="isPanelOpen" />

  <!-- Rarely shown content with v-show pays initial render cost -->
  <AdminPanel v-show="isAdmin" />
</template>
```

**Correct:**
```vue
<template>
  <!-- Frequent toggles: keep in DOM, toggle display -->
  <ComplexPanel v-show="isPanelOpen" />

  <!-- Rare condition: lazy render only when true -->
  <AdminPanel v-if="isAdmin" />
</template>
```

## Reference
- [Vue.js Introduction - Single-File Components](https://vuejs.org/guide/introduction.html#single-file-components)
- [Vue.js SFC Syntax Specification](https://vuejs.org/api/sfc-spec.html)
- [Vue.js Scoped CSS](https://vuejs.org/api/sfc-css-features.html#scoped-css)
- [Vue.js Template Syntax - Raw HTML](https://vuejs.org/guide/essentials/template-syntax.html#raw-html)
- [OWASP XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [Vue.js List Rendering - Displaying Filtered and Sorted Results](https://vuejs.org/guide/essentials/list.html#displaying-filtered-sorted-results)
- [Vue.js Conditional Rendering - v-if vs v-show](https://vuejs.org/guide/essentials/conditional.html#v-if-vs-v-show)
- [Vue.js Class and Style Bindings](https://vuejs.org/guide/essentials/class-and-style.html)
- [Vue.js Component Registration](https://vuejs.org/guide/components/registration.html)
- [Vue.js Component Name Casing](https://vuejs.org/guide/components/registration.html#component-name-casing)
- [Vue.js Component Events](https://vuejs.org/guide/components/events.html)
