<script setup lang="ts">
import type { Todo } from '@/types/todo'

const props = defineProps<{
  todos: ReadonlyArray<Todo>
}>()

const emit = defineEmits<{
  toggle: [id: string]
  remove: [id: string]
}>()
</script>

<template>
  <section class="todo-list-wrap">
    <ul v-if="props.todos.length > 0" class="todo-list">
      <li
        v-for="todo in props.todos"
        :key="todo.id"
        class="todo-item"
        :class="{ 'todo-item--done': todo.completed }"
      >
        <label class="todo-item-content">
          <input
            class="todo-checkbox"
            type="checkbox"
            :checked="todo.completed"
            @change="emit('toggle', todo.id)"
          >
          <span class="todo-text">{{ todo.text }}</span>
        </label>
        <button
          class="todo-remove"
          type="button"
          aria-label="Remove todo"
          @click="emit('remove', todo.id)"
        >
          Remove
        </button>
      </li>
    </ul>
    <p v-else class="empty-state">
      No todos yet. Add your first task above.
    </p>
  </section>
</template>

<style scoped>
.todo-list-wrap {
  min-height: 7rem;
}

.todo-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 0.7rem;
}

.todo-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.8rem 0.9rem;
  border-radius: 0.7rem;
  background: #f5f7fb;
}

.todo-item-content {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  min-width: 0;
}

.todo-checkbox {
  width: 1rem;
  height: 1rem;
  margin: 0;
}

.todo-text {
  font-size: 0.98rem;
  line-height: 1.35;
  word-break: break-word;
}

.todo-item--done .todo-text {
  text-decoration: line-through;
  color: #6a7484;
}

.todo-remove {
  border: 0;
  padding: 0.35rem 0.65rem;
  border-radius: 0.5rem;
  background: #ffd8d8;
  color: #961313;
  font-weight: 600;
  cursor: pointer;
}

.todo-remove:hover {
  background: #ffc2c2;
}

.empty-state {
  margin: 0;
  padding: 2rem 0;
  text-align: center;
  color: #657085;
}
</style>
