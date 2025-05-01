
<!-- src/components/ScientificButtons.vue -->
<template>
  <div class="grid grid-cols-5 gap-2 p-4 pt-2">
    <button 
      v-for="fn in ['sqrt', 'cbrt', 'square', 'cube', '^']" 
      :key="fn"
      @click="fn === '^' ? emit('setOp', fn) : emit('useFn', fn)"
      class="bg-purple-100 hover:bg-purple-200 text-purple-800 text-sm font-bold py-3 rounded-lg transition-colors"
    >
      {{ fn === 'square' ? 'x²' : fn === 'cube' ? 'x³' : fn === 'sqrt' ? '√x' : fn === 'cbrt' ? '∛x' : fn }}
    </button>
  </div>

  <div class="grid grid-cols-5 gap-2 px-4 pb-2">
    <button 
      v-for="fn in ['sin', 'cos', 'tan', 'log', 'log10']" 
      :key="fn"
      @click="emit('useFn', fn)"
      class="bg-purple-100 hover:bg-purple-200 text-purple-800 text-sm font-bold py-3 rounded-lg transition-colors"
    >
      {{ fn }}
    </button>
  </div>

  <div class="grid grid-cols-5 gap-2 px-4 pb-2">
    <button 
      v-for="fn in ['pi', '1/x', 'abs', '(', ')']" 
      :key="fn"
      @click="['(', ')'].includes(fn) ? emit('input', fn) : emit('useFn', fn)"
      class="bg-purple-100 hover:bg-purple-200 text-purple-800 text-sm font-bold py-3 rounded-lg transition-colors"
    >
      {{ fn === 'pi' ? 'π' : fn === '1/x' ? '1/x' : fn === 'abs' ? '|x|' : fn }}
    </button>
  </div>
</template>

<script setup>
const emit = defineEmits(['useFn', 'setOp', 'input'])
</script>