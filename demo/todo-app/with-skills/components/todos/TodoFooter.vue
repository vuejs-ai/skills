<script setup lang="ts">
import type { TodoFilter } from '@/types/todo'

const props = defineProps<{
  filter: TodoFilter
  totalCount: number
  activeCount: number
  completedCount: number
}>()

const emit = defineEmits<{
  setFilter: [filter: TodoFilter]
  clearCompleted: []
}>()

const filters: ReadonlyArray<{ label: string; value: TodoFilter }> = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Completed', value: 'completed' },
]
</script>

<template>
  <footer v-if="props.totalCount > 0" class="todo-footer">
    <p class="todo-count">
      {{ props.activeCount }} item{{ props.activeCount === 1 ? '' : 's' }} left
    </p>

    <div class="todo-filters">
      <button
        v-for="filterOption in filters"
        :key="filterOption.value"
        class="filter-button"
        :class="{ 'filter-button--active': filterOption.value === props.filter }"
        type="button"
        @click="emit('setFilter', filterOption.value)"
      >
        {{ filterOption.label }}
      </button>
    </div>

    <button
      class="clear-button"
      type="button"
      :disabled="props.completedCount === 0"
      @click="emit('clearCompleted')"
    >
      Clear completed
    </button>
  </footer>
</template>

<style scoped>
.todo-footer {
  display: grid;
  gap: 0.8rem;
  align-items: center;
  grid-template-columns: 1fr;
}

.todo-count {
  margin: 0;
  color: #3a4658;
  font-size: 0.94rem;
}

.todo-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.filter-button {
  border: 1px solid #ccd2de;
  background: #ffffff;
  border-radius: 999px;
  padding: 0.35rem 0.75rem;
  cursor: pointer;
}

.filter-button--active {
  border-color: #2f6fed;
  color: #2f6fed;
  font-weight: 600;
}

.clear-button {
  justify-self: start;
  border: 0;
  border-radius: 0.5rem;
  background: #eef1f6;
  color: #2e3645;
  padding: 0.45rem 0.8rem;
  cursor: pointer;
}

.clear-button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

@media (min-width: 640px) {
  .todo-footer {
    grid-template-columns: auto 1fr auto;
  }

  .todo-filters {
    justify-content: center;
  }

  .clear-button {
    justify-self: end;
  }
}
</style>
