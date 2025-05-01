<!-- src/components/HistoryLog.vue -->
<template>
  <div v-if="history.length" class="max-h-40 overflow-y-auto px-4 pb-2 border-t border-gray-200">
    <h3 class="text-sm text-gray-500 font-semibold mb-1">History</h3>
    <ul class="text-xs text-gray-600 space-y-1">
      <li v-for="(entry, index) in history" :key="index">
        {{ entry }}
      </li>
    </ul>
  </div>
</template>

<script setup>
defineProps({
  history: Array
})
</script>