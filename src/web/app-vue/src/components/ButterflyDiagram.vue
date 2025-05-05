<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { ComplexNumber } from '@shared/types'

defineProps<{
  data: ComplexNumber[]
  steps: ComplexNumber[][]
}>()
</script>

<template>
  <div class="butterfly-diagram">
    <!-- バタフライ図の実装は後ほど -->
    <p>バタフライ図（実装予定）</p>
  </div>
</template>

<style scoped>
.butterfly-diagram {
  margin: 1rem;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>