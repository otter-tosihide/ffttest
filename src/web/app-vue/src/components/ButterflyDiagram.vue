<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import * as d3 from 'd3'
import type { ComplexNumber } from '../../../shared/types'

const props = defineProps<{
  data: ComplexNumber[]
  steps?: ComplexNumber[][]
}>()

const svgRef = ref<SVGElement | null>(null)
const width = 1000
const height = 600
const margin = { top: 20, right: 30, bottom: 30, left: 40 }

const drawButterfly = () => {
  if (!svgRef.value || !props.data) return

  // SVGをクリア
  d3.select(svgRef.value).selectAll('*').remove()

  const svg = d3.select(svgRef.value)
    .attr('width', width)
    .attr('height', height)

  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)

  const n = props.data.length
  const levels = Math.log2(n)
  const dx = (width - margin.left - margin.right) / levels
  const dy = (height - margin.top - margin.bottom) / n

  // 各レベルのノードを描画
  for (let level = 0; level <= levels; level++) {
    const step = Math.pow(2, level)
    const y = (i: number) => margin.top + i * dy

    // ノードを描画
    for (let i = 0; i < n; i++) {
      g.append('circle')
        .attr('cx', level * dx)
        .attr('cy', y(i))
        .attr('r', 3)
        .attr('fill', '#42b883')

      // バタフライ接続を描画
      if (level < levels) {
        const group = Math.floor(i / step)
        const position = i % step
        const target1 = group * step * 2 + position
        const target2 = target1 + step

        g.append('path')
          .attr('d', `M ${level * dx} ${y(i)} C ${(level + 0.5) * dx} ${y(i)}, ${(level + 0.5) * dx} ${y(target1)}, ${(level + 1) * dx} ${y(target1)}`)
          .attr('stroke', '#42b88380')
          .attr('fill', 'none')

        g.append('path')
          .attr('d', `M ${level * dx} ${y(i)} C ${(level + 0.5) * dx} ${y(i)}, ${(level + 0.5) * dx} ${y(target2)}, ${(level + 1) * dx} ${y(target2)}`)
          .attr('stroke', '#42b88380')
          .attr('fill', 'none')
      }
    }

    // 値を表示
    if (props.steps && props.steps[level]) {
      const stepData = props.steps[level]
      for (let i = 0; i < n; i++) {
        const value = stepData[i]
        g.append('text')
          .attr('x', level * dx + 5)
          .attr('y', y(i))
          .attr('dy', '0.3em')
          .style('font-size', '10px')
          .text(`${value.real.toFixed(1)}+${value.imag.toFixed(1)}i`)
      }
    }
  }
}

onMounted(() => {
  drawButterfly()
})

watch(() => props.data, () => {
  drawButterfly()
}, { deep: true })

watch(() => props.steps, () => {
  drawButterfly()
}, { deep: true })
</script>

<template>
  <div class="butterfly-diagram">
    <svg ref="svgRef"></svg>
  </div>
</template>

<style scoped>
.butterfly-diagram {
  margin: 1rem;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  overflow: auto;
}

svg {
  display: block;
  margin: 0 auto;
}
</style>