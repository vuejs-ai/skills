<script setup lang="ts">
import TodoCreateForm from '@/components/todos/TodoCreateForm.vue'
import TodoFooter from '@/components/todos/TodoFooter.vue'
import TodoList from '@/components/todos/TodoList.vue'
import { useTodos } from '@/composables/useTodos'

const {
  visibleTodos,
  filter,
  totalCount,
  activeCount,
  completedCount,
  addTodo,
  toggleTodo,
  removeTodo,
  setFilter,
  clearCompleted,
} = useTodos()
</script>

<template>
  <section class="todo-app">
    <header class="todo-header">
      <h1 class="todo-title">
        Todo List
      </h1>
      <p class="todo-subtitle">
        Track tasks with filters and saved progress.
      </p>
    </header>

    <TodoCreateForm @add="addTodo" />

    <TodoList
      :todos="visibleTodos"
      @toggle="toggleTodo"
      @remove="removeTodo"
    />

    <TodoFooter
      :filter="filter"
      :total-count="totalCount"
      :active-count="activeCount"
      :completed-count="completedCount"
      @set-filter="setFilter"
      @clear-completed="clearCompleted"
    />
  </section>
</template>

<style scoped>
.todo-app {
  display: grid;
  gap: 1rem;
  background: #ffffff;
  border: 1px solid #d8dce7;
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: 0 10px 35px rgb(18 33 62 / 0.08);
}

.todo-header {
  display: grid;
  gap: 0.45rem;
}

.todo-title {
  margin: 0;
  font-size: clamp(1.5rem, 4vw, 2rem);
  color: #1e2b3f;
}

.todo-subtitle {
  margin: 0;
  color: #5c6679;
  font-size: 0.96rem;
}

@media (min-width: 768px) {
  .todo-app {
    padding: 1.5rem;
    gap: 1.2rem;
  }
}
</style>
