<script setup lang="ts">
import { ref } from "vue";

const count = ref(0);

function increment() {
  count.value++;
}

function decrement() {
  count.value--;
}
</script>

<template>
  <div>
    <span data-testid="count">{{ count }}</span>
    <button data-testid="increment" @click="increment">+</button>
    <button data-testid="decrement" @click="decrement">-</button>
  </div>
</template>
