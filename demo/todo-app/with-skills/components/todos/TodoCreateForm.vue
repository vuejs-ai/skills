<script setup lang="ts">
import { shallowRef } from 'vue'

const emit = defineEmits<{
  add: [text: string]
}>()

const draft = shallowRef('')

function submitTodo() {
  const normalizedText = draft.value.trim()
  if (!normalizedText) {
    return
  }

  emit('add', normalizedText)
  draft.value = ''
}
</script>

<template>
  <form class="todo-form" @submit.prevent="submitTodo">
    <input
      v-model="draft"
      class="todo-input"
      type="text"
      placeholder="What needs to be done?"
      autocomplete="off"
      aria-label="Add a todo"
    >
    <button class="todo-submit" type="submit">
      Add
    </button>
  </form>
</template>

<style scoped>
.todo-form {
  display: flex;
  gap: 0.75rem;
}

.todo-input {
  flex: 1;
  padding: 0.8rem 1rem;
  border: 1px solid #c8cdd4;
  border-radius: 0.65rem;
  font-size: 1rem;
}

.todo-input:focus {
  outline: 2px solid #2f6fed;
  outline-offset: 1px;
  border-color: #2f6fed;
}

.todo-submit {
  border: 0;
  border-radius: 0.65rem;
  padding: 0.8rem 1.2rem;
  font-weight: 600;
  font-size: 0.95rem;
  color: #ffffff;
  background: #2f6fed;
  cursor: pointer;
}

.todo-submit:hover {
  background: #2457bc;
}
</style>
