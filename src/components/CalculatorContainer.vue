<template>
  <div class="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
    <div class="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
      <CalculatorDisplay :state="state" :total="total" />
      <HistoryLog :history="state.history" />
      <ScientificButtons @useFn="scientificOperation" @setOp="setOperation" @input="inputNumber" />
      <MemoryButtons @memoryOp="memoryOperation" />
      <NumberPad 
        @input="inputNumber" 
        @equal="equal" 
        @reset="reset" 
        @setOp="setOperation" 
        @backspace="backspace"
      />
      <!-- <button
  @click="downloadHistory"
  class="mt-2 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
>
  Download History
</button> -->
    </div>
  </div>
</template>

<script setup>
import CalculatorDisplay from './CalculatorDisplay.vue'
import HistoryLog from './HistoryLog.vue'
import ScientificButtons from './ScientificButtons.vue'
import MemoryButtons from './MemoryButtons.vue'
import NumberPad from './NumberPad.vue'
import { useCalculator } from '../composables/useCalculator'

const {
  state,
  total,
  inputNumber,
  setOperation,
  equal,
  reset,
  scientificOperation,
  memoryOperation,
  backspace
} = useCalculator()
</script>
