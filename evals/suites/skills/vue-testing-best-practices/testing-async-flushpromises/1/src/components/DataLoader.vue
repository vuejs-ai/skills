<script setup lang="ts">
import { ref, onMounted } from "vue";

const loading = ref(true);
const userName = ref("");

async function fetchData() {
  loading.value = true;
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 100));
  userName.value = "John Doe";
  loading.value = false;
}

onMounted(() => {
  fetchData();
});
</script>

<template>
  <div>
    <p v-if="loading">Loading...</p>
    <p v-else data-testid="user-name">{{ userName }}</p>
    <button data-testid="refresh" @click="fetchData">Refresh</button>
  </div>
</template>
