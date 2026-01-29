<script setup lang="ts">
import { ref } from "vue";

const isOn = ref(false);

function toggle() {
  isOn.value = !isOn.value;
}
</script>

<template>
  <div>
    <span data-testid="status">{{ isOn ? 'ON' : 'OFF' }}</span>
    <button data-testid="toggle-btn" @click="toggle">Toggle</button>
  </div>
</template>
