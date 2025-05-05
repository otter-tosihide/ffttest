<script setup lang="ts">
import { ref } from 'vue'
import FileInput from './components/FileInput.vue'
import ButterflyDiagram from './components/ButterflyDiagram.vue'
import type { ComplexNumber } from '@shared/types'  // @sharedエイリアスを使用

const fftData = ref<ComplexNumber[]>()
const fftSteps = ref<ComplexNumber[][]>()

const handleDataLoaded = (data: ComplexNumber[]) => {
  fftData.value = data
  // FFTステップの計算は後ほど実装
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
