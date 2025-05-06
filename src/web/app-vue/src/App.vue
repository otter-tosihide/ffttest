<script setup lang="ts">
import { ref } from 'vue'
import FileInput from './components/FileInput.vue'
import ButterflyDiagram from './components/ButterflyDiagram.vue'
import type { ComplexNumber } from '../../shared/types'
import { fft } from '../../shared/fft'

const fftData = ref<ComplexNumber[]>()
const fftSteps = ref<ComplexNumber[][]>()

// FFTの各ステップを計算する関数
const calculateFFTSteps = (data: ComplexNumber[]): ComplexNumber[][] => {
  const steps: ComplexNumber[][] = [data]
  const N = data.length
  
  // 各レベルでのFFT計算
  for (let step = 2; step <= N; step *= 2) {
    const currentStep: ComplexNumber[] = new Array(N)
    
    // 各バタフライ演算のグループを処理
    for (let group = 0; group < N / step; group++) {
      const groupStart = group * step
      const halfStep = step / 2
      
      // グループ内の各要素を処理
      for (let i = 0; i < halfStep; i++) {
        const evenIndex = groupStart + i
        const oddIndex = groupStart + i + halfStep
        
        // バタフライ演算の重み係数
        const twiddle = {
          real: Math.cos(-2 * Math.PI * i / step),
          imag: Math.sin(-2 * Math.PI * i / step)
        }
        
        // 奇数項に重み係数を掛ける
        const odd = steps[steps.length - 1][oddIndex]
        const weightedOdd = {
          real: odd.real * twiddle.real - odd.imag * twiddle.imag,
          imag: odd.real * twiddle.imag + odd.imag * twiddle.real
        }
        
        const even = steps[steps.length - 1][evenIndex]
        
        // バタフライ演算の結果を保存
        currentStep[evenIndex] = {
          real: even.real + weightedOdd.real,
          imag: even.imag + weightedOdd.imag
        }
        
        currentStep[oddIndex] = {
          real: even.real - weightedOdd.real,
          imag: even.imag - weightedOdd.imag
        }
      }
    }
    
    steps.push(currentStep)
  }
  
  return steps
}

const handleDataLoaded = (data: ComplexNumber[]) => {
  fftData.value = data
  // FFTの各ステップを計算
  fftSteps.value = calculateFFTSteps(data)
}
</script>

<template>
  <div class="app">
    <header>
      <h1>FFT可視化ツール (Vue.js版)</h1>
    </header>
    <main>
      <FileInput @data-loaded="handleDataLoaded" />
      <ButterflyDiagram
        v-if="fftData"
        :data="fftData"
        :steps="fftSteps"
      />
    </main>
  </div>
</template>

<style>
.app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

header {
  text-align: center;
  margin-bottom: 2rem;
}

h1 {
  color: #42b883;
  font-size: 2rem;
}

main {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
</style>
