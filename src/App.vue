<script setup>
import { reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import { sqrt, cbrt, pow, sin, cos, tan, log, log10 } from 'mathjs'
// import { pi } from 'mathjs/constants'

const userChoice = reactive({
  firstChoice: '',
  operation: '',
  secondChoice: '',
  memory: null,
  history: []
})

const isSecondInput = computed(() => userChoice.operation !== '')

const total = computed(() => {
  const first = Number(userChoice.firstChoice)
  const second = Number(userChoice.secondChoice)

  if (isNaN(first) && userChoice.operation === '') return ''
  
  switch (userChoice.operation) {
    case '+': return first + second
    case '-': return first - second
    case '*': return first * second
    case '/': return second !== 0 ? first / second : 'Error'
    case '%': return first % second
    case '^': return pow(first, second)
    default: return ''
  }
})

const inputNumber = (num) => {
  if (num === '.' && (userChoice.operation ? userChoice.secondChoice : userChoice.firstChoice).includes('.')) return
  if (!userChoice.operation) {
    userChoice.firstChoice += num
  } else {
    userChoice.secondChoice += num
  }
}

const setOperation = (op) => {
  if (userChoice.firstChoice !== '') {
    userChoice.operation = op
  }
}

// const equal = () => {
//   if (userChoice.firstChoice && userChoice.operation && userChoice.secondChoice) {
//     userChoice.firstChoice = total.value.toString()
//     userChoice.operation = ''
//     userChoice.secondChoice = ''
//   }
// }

const reset = () => {
  userChoice.firstChoice = ''
  userChoice.operation = ''
  userChoice.secondChoice = ''
  userChoice.history = []
}

// Scientific functions
const scientificOperation = (fn) => {
  const num = Number(userChoice.firstChoice || userChoice.secondChoice)
  if (!isNaN(num)) {
    let result
    switch (fn) {
      case 'sqrt': result = sqrt(num); break
      case 'cbrt': result = cbrt(num); break
      case 'square': result = pow(num, 2); break
      case 'cube': result = pow(num, 3); break
      case 'sin': result = sin(num); break
      case 'cos': result = cos(num); break
      case 'tan': result = tan(num); break
      case 'log': result = log(num); break
      // case 'pi': result = Math.PI; break
      case 'log10': result = log10(num); break
      
      case '1/x': result = 1 / num; break
      case 'abs': result = Math.abs(num); break
    }
    
    if (userChoice.operation) {
      userChoice.secondChoice = result.toString()
    } else {
      userChoice.firstChoice = result.toString()
    }
  }
}

const memoryOperation = (op) => {
  const num = Number(userChoice.firstChoice || userChoice.secondChoice)
  if (isNaN(num)) return
  
  switch (op) {
    case 'M+': 
      userChoice.memory = (userChoice.memory || 0) + num
      break
    case 'M-':
      userChoice.memory = (userChoice.memory || 0) - num
      break
    case 'MR':
      if (userChoice.operation) {
        userChoice.secondChoice = userChoice.memory?.toString() || ''
      } else {
        userChoice.firstChoice = userChoice.memory?.toString() || ''
      }
      break
    case 'MC':
      userChoice.memory = null
      break
  }
}

// support for direct key input
onMounted(() => {
  window.addEventListener('keydown', handleKey)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKey)
})

const handleKey = (e) => {
  const key = e.key
  if (!isNaN(key) || key === '.') inputNumber(key)
  else if (['+', '-', '*', '/', '%', '^'].includes(key)) setOperation(key)
  else if (key === 'Enter') equal()
  else if (key === 'Escape') reset()
}


// History
const equal = () => {
  if (userChoice.firstChoice && userChoice.operation && userChoice.secondChoice) {
    const result = total.value.toString()
    const expression = `${userChoice.firstChoice} ${userChoice.operation} ${userChoice.secondChoice} = ${result}`

    // Add to history
    userChoice.history.unshift(expression) // `unshift` to show most recent first

    // Reset for next calculation
    userChoice.firstChoice = result
    userChoice.operation = ''
    userChoice.secondChoice = ''
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
    <div class="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
      <!-- Display -->
      <div class="p-4 bg-gray-800 text-right">
        <div v-if="userChoice.memory !== null" class="text-xs text-gray-400 text-left">M: {{ userChoice.memory }}</div>
        <h2 class="text-3xl font-mono text-white min-h-10">
          {{ userChoice.firstChoice }} {{ userChoice.operation }} {{ userChoice.secondChoice }}
          <span v-if="total !== ''" class="block text-sm text-gray-400">= {{ total }}</span>
        </h2>
        <!-- History log -->
            <div v-if="userChoice.history.length" class="max-h-40 overflow-y-auto px-4 pb-2 border-t border-gray-200">
          <h3 class="text-sm text-gray-500 font-semibold mb-1">History</h3>
  <ul class="text-xs text-gray-600 space-y-1">
    <li v-for="(entry, index) in userChoice.history" :key="index">
      {{ entry }}
    </li>
  </ul>
</div>
      </div>
      
      <!-- Scientific buttons row -->
      <div class="grid grid-cols-5 gap-2 p-4 pt-2">
        <button 
          v-for="fn in ['sqrt', 'cbrt', 'square', 'cube', '^']" 
          :key="fn"
          @click="fn === '^' ? setOperation(fn) : scientificOperation(fn)"
          class="bg-purple-100 hover:bg-purple-200 text-purple-800 text-sm font-bold py-3 rounded-lg transition-colors"
        >
          {{ fn === 'square' ? 'x²' : 
             fn === 'cube' ? 'x³' : 
             fn === 'sqrt' ? '√x' : 
             fn === 'cbrt' ? '∛x' : 
             fn }}
        </button>
      </div>
      
      <!-- Second scientific row -->
      <div class="grid grid-cols-5 gap-2 px-4 pb-2">
        <button 
          v-for="fn in ['sin', 'cos', 'tan', 'log', 'log10']" 
          :key="fn"
          @click="scientificOperation(fn)"
          class="bg-purple-100 hover:bg-purple-200 text-purple-800 text-sm font-bold py-3 rounded-lg transition-colors"
        >
          {{ fn }}
        </button>
      </div>
      
      <!-- Third scientific row -->
      <div class="grid grid-cols-5 gap-2 px-4 pb-2">
        <button 
          v-for="fn in ['pi', '1/x', 'abs', '(', ')']" 
          :key="fn"
          @click="fn === '(' || fn === ')' ? inputNumber(fn) : scientificOperation(fn)"
          class="bg-purple-100 hover:bg-purple-200 text-purple-800 text-sm font-bold py-3 rounded-lg transition-colors"
        >
          {{ fn === 'pi' ? 'π' : 
             fn === '1/x' ? '1/x' : 
             fn === 'abs' ? '|x|' : 
             fn }}
        </button>
      </div>
      
      <!-- Memory buttons row -->
      <div class="grid grid-cols-4 gap-2 px-4 pb-2">
        <button 
          v-for="op in ['M+', 'M-', 'MR', 'MC']" 
          :key="op"
          @click="memoryOperation(op)"
          class="bg-amber-100 hover:bg-amber-200 text-amber-800 text-sm font-bold py-3 rounded-lg transition-colors"
        >
          {{ op }}
        </button>
      </div>
      
      <!-- Number buttons -->
      <div class="grid grid-cols-4 gap-2 p-4 pt-0">
        <button 
          v-for="num in [7,8,9,'%',4,5,6,'*',1,2,3,'-','.',0,'=','+']" 
          :key="num"
          @click="num === '=' ? equal() : 
                 ['+','-','*','%'].includes(num) ? setOperation(num) : 
                 inputNumber(num.toString())"
          :class="{
            'bg-gray-200 hover:bg-gray-300 text-gray-800': typeof num === 'number' || num === '.',
            'bg-blue-500 hover:bg-blue-600 text-white': ['+','-','*','%'].includes(num),
            'bg-green-500 hover:bg-green-600 text-white': num === '=',
            'col-span-2': num === '=',
            'font-bold py-4 rounded-lg transition-colors': true
          }"
        >
          {{ num }}
        </button>
        <button 
          @click="reset"
          class="bg-red-500 hover:bg-red-600 text-white font-bold py-4 rounded-lg transition-colors col-span-4"
        >
          Reset
        </button>
      </div>
    </div>
  </div>
</template>