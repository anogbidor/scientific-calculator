<!-- src/components/CalculatorDisplay.vue -->
<template>
  <div class="p-4 bg-gray-800 text-right">
    <div v-if="state.memory !== null" class="text-xs text-gray-400 text-left">M: {{ state.memory }}</div>

    <h2 class="text-3xl font-mono text-white min-h-10">
      {{ state.firstChoice }} {{ state.operation }} {{ state.secondChoice }}
      <span v-if="state.hasEvaluated" class="block text-sm text-gray-400">= {{ total }}</span>
    </h2>

    <!-- Error message with fade animation -->
    <transition name="fade">
      <div v-if="state.errorMessage" class="mt-2 text-red-400 text-xs text-left flex items-center gap-1">
        ⚠️ <span>{{ state.errorMessage }}</span>
      </div>
    </transition>

    <!-- History log -->
    <div v-if="state.history.length" class="max-h-40 overflow-y-auto px-1 pt-4 text-left border-t border-gray-600 mt-2">
      <h3 class="text-xs text-gray-300 font-semibold mb-1">History</h3>
      <ul class="text-xs text-gray-300 space-y-1">
        <li v-for="(entry, index) in state.history" :key="index">{{ entry }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
defineProps({
  state: Object,
  total: [String, Number]
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>