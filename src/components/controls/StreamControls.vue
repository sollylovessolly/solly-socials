<script setup lang="ts">
import { computed } from 'vue'
import { useStreamStore } from '../../stores/streamStore'

const stream = useStreamStore()
const ranges = [
  { label: '1 MIN', value: '1m' },
  { label: '5 MINS', value: '5m' },
  { label: '15 MINS', value: '15m' },
  { label: '1 HOUR', value: '1h' },
] as const

const frozenAt = computed(() =>
  stream.lastPausedAt
    ? new Intl.DateTimeFormat('en', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(stream.lastPausedAt)
    : '',
)
</script>

<template>
  <div class="stream-controls">
    <button class="stream-button" type="button" @click="stream.toggleStream">
      <span class="status-dot" :class="{ live: stream.isLive }"></span>
      <span>{{ stream.isLive ? 'Pause Stream' : 'Resume Stream' }}</span>
    </button>
    <span v-if="!stream.isLive" class="frozen-copy">Data frozen at {{ frozenAt }}</span>
    <div class="range-group" aria-label="Time range selector">
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
  </div>
</template>
