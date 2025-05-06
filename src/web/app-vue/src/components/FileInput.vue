<template>
  <div class="file-input">
    <input
      type="file"
      accept=".wav"
      style="display: none"
      ref="fileInput"
      @change="handleFileChange"
    />
    <button
      @click="fileInput?.click()"
      :disabled="loading"
      class="select-button"
    >
      {{ loading ? 'ロード中...' : 'WAVファイルを選択' }}
    </button>
    <p v-if="fileName" class="file-name">
      選択されたファイル: {{ fileName }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { loadWavFile, downsampleAudio } from '../../../shared/audioUtils'
import { prepareAudioData } from '../../../shared/fft'
import type { ComplexNumber } from '../../../shared/types'

const emit = defineEmits<{
  (e: 'dataLoaded', data: ComplexNumber[]): void
}>()

const fileName = ref('')
const loading = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  try {
    loading.value = true
    fileName.value = file.name
    
    // WAVファイルを読み込み
    const audioData = await loadWavFile(file)
    
    // 2048サンプルにダウンサンプリング（2^11）
    const downsampledData = downsampleAudio(audioData, 2048)
    
    // FFT用の複素数データに変換
    const complexData = prepareAudioData(downsampledData)
    
    emit('dataLoaded', complexData)
  } catch (error) {
    console.error('ファイル処理エラー:', error)
    if (error instanceof Error) {
      alert(error.message)
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.file-input {
  margin: 1rem;
}

.select-button {
  padding: 0.5rem 1rem;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.select-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.file-name {
  margin-top: 0.5rem;
  color: #666;
}
</style>