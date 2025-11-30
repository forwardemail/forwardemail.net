<template>
  <div class="fe-toast-stack">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      :class="['fe-toast', toast.type]"
    >
      {{ toast.message }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const toasts = ref([]);
let nextId = 1;

const show = (message, type = 'info') => {
  const id = nextId++;
  toasts.value.push({ id, message, type });
  setTimeout(() => {
    toasts.value = toasts.value.filter(t => t.id !== id);
  }, 3000);
};

defineExpose({ show });
</script>
