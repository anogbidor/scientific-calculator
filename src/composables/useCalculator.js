import { reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import { sqrt, cbrt, pow, sin, cos, tan, log, log10, PI } from 'mathjs'

export function useCalculator() {
  const LOCAL_HISTORY_KEY = 'vue-calculator-history'
  const LOCAL_MEMORY_KEY = 'vue-calculator-memory'

  const state = reactive({
    firstChoice: '',
    operation: '',
    secondChoice: '',
    errorMessage: '',
    hasEvaluated: false,
    memory: JSON.parse(localStorage.getItem(LOCAL_MEMORY_KEY)) || null,
    history: JSON.parse(localStorage.getItem(LOCAL_HISTORY_KEY)) || [],
  })

  const total = computed(() => {
    const first = Number(state.firstChoice)
    const second = Number(state.secondChoice)
    if (isNaN(first) || isNaN(second)) return ''
    switch (state.operation) {
      case '+':
        return first + second
      case '-':
        return first - second
      case '*':
        return first * second
      case '/':
        return first / second
      case '%':
        return first % second
      case '^':
        return pow(first, second)
      default:
        return ''
    }
  })

  const saveHistory = () => {
    localStorage.setItem(LOCAL_HISTORY_KEY, JSON.stringify(state.history))
  }

  const saveMemory = () => {
    localStorage.setItem(LOCAL_MEMORY_KEY, JSON.stringify(state.memory))
  }

  const inputNumber = (num) => {
    state.hasEvaluated = false
    if (
      num === '.' &&
      (state.operation ? state.secondChoice : state.firstChoice).includes('.')
    )
      return

    if (!state.operation) state.firstChoice += num
    else state.secondChoice += num
  }

  const setOperation = (op) => {
    state.hasEvaluated = false
    if (state.firstChoice !== '') state.operation = op
  }

  const equal = () => {
    const firstValid =
      state.firstChoice !== '' && !isNaN(Number(state.firstChoice))
    const secondValid =
      state.secondChoice !== '' && !isNaN(Number(state.secondChoice))

    if (!firstValid || !secondValid) {
      state.errorMessage = 'Please enter a valid second number.'
      state.hasEvaluated = false
      setTimeout(() => (state.errorMessage = ''), 2000)
      return
    }

    if (state.operation === '/' && Number(state.secondChoice) === 0) {
      state.errorMessage = 'Cannot divide by zero.'
      state.hasEvaluated = false
      setTimeout(() => (state.errorMessage = ''), 2000)
      return
    }

    const rawResult = total.value
    if (rawResult === Infinity || isNaN(rawResult)) {
      state.errorMessage = 'Invalid calculation.'
      state.hasEvaluated = false
      setTimeout(() => (state.errorMessage = ''), 2000)
      return
    }

    const result = rawResult.toString()
    const expression = `${state.firstChoice} ${state.operation} ${state.secondChoice} = ${result}`
    state.history.unshift(expression)
    saveHistory()
    state.firstChoice = result
    state.operation = ''
    state.secondChoice = ''
    state.hasEvaluated = true
  }

  const reset = () => {
    state.firstChoice = ''
    state.operation = ''
    state.secondChoice = ''
    state.history = []
    state.hasEvaluated = false
    saveHistory()
  }

  const scientificOperation = (fn) => {
    const num = Number(state.firstChoice || state.secondChoice)
    if (isNaN(num)) return
    let result
    switch (fn) {
      case 'sqrt':
        result = sqrt(num)
        break
      case 'cbrt':
        result = cbrt(num)
        break
      case 'square':
        result = pow(num, 2)
        break
      case 'cube':
        result = pow(num, 3)
        break
      case 'sin':
        result = sin(num)
        break
      case 'cos':
        result = cos(num)
        break
      case 'tan':
        result = tan(num)
        break
      case 'log':
        result = log(num)
        break
      case 'log10':
        result = log10(num)
        break
      case 'pi':
        result = PI
        break
      case '1/x':
        result = 1 / num
        break
      case 'abs':
        result = Math.abs(num)
        break
    }
    if (state.operation) state.secondChoice = result.toString()
    else state.firstChoice = result.toString()
    state.hasEvaluated = false
  }

  const backspace = () => {
    state.hasEvaluated = false
    if (state.operation) {
      state.secondChoice = state.secondChoice.slice(0, -1)
    } else {
      state.firstChoice = state.firstChoice.slice(0, -1)
    }
  }

  const memoryOperation = (op) => {
    const num = Number(state.firstChoice || state.secondChoice)
    if (isNaN(num)) return
    switch (op) {
      case 'M+':
        state.memory = (state.memory || 0) + num
        break
      case 'M-':
        state.memory = (state.memory || 0) - num
        break
      case 'MR':
        state.operation
          ? (state.secondChoice = state.memory?.toString())
          : (state.firstChoice = state.memory?.toString())
        break
      case 'MC':
        state.memory = null
        break
    }
    saveMemory()
  }

  const downloadHistory = () => {
    const blob = new Blob([state.history.join('\n')], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'calculator-history.txt'
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleKey = (e) => {
    const key = e.key
    if (!isNaN(key) || key === '.') inputNumber(key)
    else if (['+', '-', '*', '/', '%', '^'].includes(key)) setOperation(key)
    else if (key === 'Enter') equal()
    else if (key === 'Escape') reset()
  }

  onMounted(() => window.addEventListener('keydown', handleKey))
  onBeforeUnmount(() => window.removeEventListener('keydown', handleKey))

  return {
    state,
    total,
    inputNumber,
    setOperation,
    equal,
    reset,
    scientificOperation,
    memoryOperation,
    downloadHistory,
    backspace,
  }
}
