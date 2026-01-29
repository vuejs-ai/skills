<script setup lang="ts">
import { ref } from "vue";

const value = ref("");

function clear() {
  value.value = "";
}
</script>

<template>
  <div>
    <input v-model="value" data-testid="input" />
    <button data-testid="clear-btn" @click="clear">Clear</button>
    <span data-testid="value">{{ value }}</span>
  </div>
</template>
