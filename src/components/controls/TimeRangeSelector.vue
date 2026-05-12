<script setup lang="ts">
import { useStreamStore } from '../../stores/streamStore'

const stream = useStreamStore()
const ranges = [
  { label: '1 MIN', value: '1m' },
  { label: '5 MINS', value: '5m' },
  { label: '15 MINS', value: '15m' },
  { label: '1 HOUR', value: '1h' },
] as const
</script>

<template>
  <div class="range-group compact" aria-label="Time range selector">
    <button
      v-for="range in ranges"
      :key="range.value"
      type="button"
      :class="['range-pill', { active: stream.timeRange === range.value }]"
      @click="stream.setTimeRange(range.value)"
    >
      {{ range.label }}
    </button>
  </div>
</template>
