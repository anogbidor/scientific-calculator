<!-- src/components/NumberPad.vue -->
<template>
  <div class="grid grid-cols-4 gap-2 p-4 pt-0">
    <button 
      v-for="num in [7,8,9,'/',4,5,6,'*',1,2,3,'-','.',0,'=']" 
      :key="num"
      @click="
        num === '=' ? emit('equal') : 
        ['+','-','*','/','%'].includes(num) ? emit('setOp', num) : 
        emit('input', num.toString())
      "
      :class="{
        'bg-gray-200 hover:bg-gray-300 text-gray-800': typeof num === 'number' || num === '.',
        'bg-blue-500 hover:bg-blue-600 text-white': ['+','-','*','/','%'].includes(num),
        'bg-green-500 hover:bg-green-600 text-white': num === '=',
        'col-span-2': num === '=',
        'font-bold py-4 rounded-lg transition-colors': true
      }"
    >
      {{ num === '/' ? '÷' : num }}
    </button>

    <div class="grid grid-cols-4 gap-2 col-span-4">
      <button
        @click="emit('setOp', '+')"
        class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-lg transition-colors col-span-2"
      >
        +
      </button>
      <button
        @click="emit('backspace')"
        class="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-4 rounded-lg transition-colors col-span-2"
      >
        ⌫ Backspace
      </button>
    </div>

    <button 
      @click="emit('reset')"
      class="bg-red-500 hover:bg-red-600 text-white font-bold py-4 rounded-lg transition-colors col-span-4"
    >
      Reset
    </button>
  </div>
</template>

<script setup>
const emit = defineEmits(['input', 'equal', 'reset', 'setOp', 'backspace'])
</script>
