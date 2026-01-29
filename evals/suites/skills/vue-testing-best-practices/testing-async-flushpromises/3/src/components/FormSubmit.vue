<script setup lang="ts">
import { ref } from "vue";

const status = ref("Ready");
const isSubmitting = ref(false);

async function handleSubmit() {
  isSubmitting.value = true;
  status.value = "Submitting...";
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 100));
  status.value = "Success";
  isSubmitting.value = false;
}
</script>

<template>
  <form data-testid="form" @submit.prevent="handleSubmit">
    <p data-testid="status">{{ status }}</p>
    <button data-testid="submit-btn" :disabled="isSubmitting">Submit</button>
  </form>
</template>
