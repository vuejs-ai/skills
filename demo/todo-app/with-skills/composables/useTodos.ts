import { computed, readonly, ref, shallowRef, watch } from 'vue'

import type { Todo, TodoFilter } from '@/types/todo'

const STORAGE_KEY = 'vue-agent-playground.todos'

function isTodo(value: unknown): value is Todo {
  if (!value || typeof value !== 'object') {
    return false
  }

  const candidate = value as Record<string, unknown>
  return (
    typeof candidate.id === 'string'
    && typeof candidate.text === 'string'
    && typeof candidate.completed === 'boolean'
  )
}

function loadTodos(): Todo[] {
  if (typeof window === 'undefined') {
    return []
  }

  const storedValue = window.localStorage.getItem(STORAGE_KEY)
  if (!storedValue) {
    return []
  }

  try {
    const parsedValue: unknown = JSON.parse(storedValue)

    if (!Array.isArray(parsedValue)) {
      return []
    }

    return parsedValue.filter(isTodo)
  } catch {
    return []
  }
}

function createTodoId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

export function useTodos() {
  const todos = ref<Todo[]>(loadTodos())
  const filter = shallowRef<TodoFilter>('all')

  const visibleTodos = computed(() => {
    if (filter.value === 'active') {
      return todos.value.filter((todo) => !todo.completed)
    }

    if (filter.value === 'completed') {
      return todos.value.filter((todo) => todo.completed)
    }

    return todos.value
  })

  const totalCount = computed(() => todos.value.length)
  const activeCount = computed(
    () => todos.value.filter((todo) => !todo.completed).length,
  )
  const completedCount = computed(() => totalCount.value - activeCount.value)

  watch(
    todos,
    (nextTodos) => {
      if (typeof window === 'undefined') {
        return
      }

      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextTodos))
    },
    { deep: true },
  )

  function addTodo(text: string) {
    const normalizedText = text.trim()
    if (!normalizedText) {
      return
    }

    todos.value = [
      {
        id: createTodoId(),
        text: normalizedText,
        completed: false,
      },
      ...todos.value,
    ]
  }

  function toggleTodo(id: string) {
    const todo = todos.value.find((item) => item.id === id)

    if (!todo) {
      return
    }

    todo.completed = !todo.completed
  }

  function removeTodo(id: string) {
    todos.value = todos.value.filter((todo) => todo.id !== id)
  }

  function setFilter(nextFilter: TodoFilter) {
    filter.value = nextFilter
  }

  function clearCompleted() {
    todos.value = todos.value.filter((todo) => !todo.completed)
  }

  return {
    todos: readonly(todos),
    filter: readonly(filter),
    visibleTodos,
    totalCount,
    activeCount,
    completedCount,
    addTodo,
    toggleTodo,
    removeTodo,
    setFilter,
    clearCompleted,
  }
}
