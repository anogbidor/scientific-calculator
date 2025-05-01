<!-- src/components/MemoryButtons.vue -->
<template>
  <div class="grid grid-cols-4 gap-2 px-4 pb-2">
    <button 
      v-for="op in ['M+', 'M-', 'MR', 'MC']" 
      :key="op"
      @click="emit('memoryOp', op)"
      class="bg-amber-100 hover:bg-amber-200 text-amber-800 text-sm font-bold py-3 rounded-lg transition-colors"
    >
      {{ op }}
    </button>
  </div>
</template>

<script setup>
const emit = defineEmits(['memoryOp'])
</script>