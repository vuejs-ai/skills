<script setup lang="ts">
import TodoApp from '@/components/todos/TodoApp.vue'
</script>

<template>
  <main class="app-shell">
    <div class="app-container">
      <TodoApp />
    </div>
  </main>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 1.2rem;
  background:
    radial-gradient(circle at top right, #e9f1ff 0%, transparent 42%),
    radial-gradient(circle at bottom left, #ffe9dc 0%, transparent 45%),
    #f4f6fb;
}

.app-container {
  width: min(100%, 680px);
}
</style>
