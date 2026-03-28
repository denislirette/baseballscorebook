<template>
  <div class="live-cell-wrapper">
    <div ref="cellContainer" class="live-cell-container"></div>
    <div class="live-cell-label" v-if="label">{{ label }}</div>
    <div class="live-cell-desc" v-if="description">{{ description }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  notation: { type: String, default: '' },
  out: { type: Number, default: 0 },
  rbi: { type: Number, default: 0 },
  runners: { type: Array, default: () => [] },
  pitches: { type: Array, default: () => [] },
  label: { type: String, default: '' },
  description: { type: String, default: '' },
  size: { type: Number, default: 200 },
})

const cellContainer = ref(null)

async function render() {
  if (!cellContainer.value) return

  // Dynamic import of the REAL rendering code
  const { drawAtBatCell, getColors, refreshLayout } = await import('../../../../js/svg-renderer.js')

  // Refresh layout to get current constants
  const L = refreshLayout()
  const CLR = getColors()

  // Build the at-bat data object
  const ab = {
    batterId: 1,
    notation: props.notation,
    outNumber: props.out || null,
    pitchSequence: props.pitches.map(p => ({
      callCode: p.call || 'X',
      speed: p.speed,
      typeCode: p.type,
    })),
    cumulativeRunners: props.runners,
    result: { rbi: props.rbi },
  }

  // Create SVG
  const ns = 'http://www.w3.org/2000/svg'
  const svg = document.createElementNS(ns, 'svg')
  svg.setAttribute('width', props.size)
  svg.setAttribute('height', props.size)
  svg.setAttribute('viewBox', `0 0 ${L.COL_WIDTH} ${L.ROW_HEIGHT}`)

  // Cell background
  const rect = document.createElementNS(ns, 'rect')
  rect.setAttribute('width', L.COL_WIDTH)
  rect.setAttribute('height', L.ROW_HEIGHT)
  rect.setAttribute('fill', CLR.cellBg)
  rect.setAttribute('stroke', CLR.grid)
  rect.setAttribute('stroke-width', '1')
  svg.appendChild(rect)

  // Draw with the REAL function
  drawAtBatCell(svg, CLR, ab, 0, 0, false)

  // Replace contents
  cellContainer.value.innerHTML = ''
  cellContainer.value.appendChild(svg)
}

onMounted(render)
</script>

<style scoped>
.live-cell-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}
.live-cell-container {
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  overflow: hidden;
  line-height: 0;
}
.live-cell-label { font-weight: 600; font-size: 0.85em; }
.live-cell-desc { font-size: 0.75em; color: var(--vp-c-text-3); max-width: 180px; text-align: center; }
</style>
