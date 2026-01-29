<script setup lang="ts">
import { ref } from "vue";

const query = ref("");
const results = ref<string[]>([]);
const loading = ref(false);

async function search() {
  loading.value = true;
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 100));
  results.value = query.value ? ["Result 1", "Result 2", "Result 3"] : [];
  loading.value = false;
}
</script>

<template>
  <div>
    <input v-model="query" data-testid="search-input" />
    <button data-testid="search-btn" @click="search">Search</button>
    <p v-if="loading">Searching...</p>
    <div v-else-if="results.length === 0">No results</div>
    <ul v-else data-testid="results">
      <li v-for="result in results" :key="result">{{ result }}</li>
    </ul>
  </div>
</template>
