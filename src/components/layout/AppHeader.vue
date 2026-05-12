<script setup lang="ts">
import { computed } from 'vue'
import { useNow } from '@vueuse/core'
import PlatformFilter from '../controls/PlatformFilter.vue'
import StreamControls from '../controls/StreamControls.vue'
import { useStreamStore } from '../../stores/streamStore'

const stream = useStreamStore()
const now = useNow({ interval: 1000 })
const uptime = computed(() => {
  const total = Math.floor((now.value.getTime() - stream.startTime) / 1000)
  const hours = String(Math.floor(total / 3600)).padStart(2, '0')
  const minutes = String(Math.floor((total % 3600) / 60)).padStart(2, '0')
  const seconds = String(total % 60).padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`
})
</script>

<template>
  <header class="app-header glass-panel">
    <div class="brand-block">
      <div class="brand-mark">★</div>
      <div>
        <p class="eyebrow">Real-time command suite</p>
        <h1>Solly Social</h1>
        <p class="tagline">Your audience, live.</p>
      </div>
    </div>

    <PlatformFilter />

    <div class="header-actions">
      <div class="uptime">
        <span>Monitoring</span>
        <strong>{{ uptime }}</strong>
      </div>
      <div class="live-state" :class="{ paused: !stream.isLive }">
        <span class="status-dot" :class="{ live: stream.isLive }"></span>
        {{ stream.statusLabel }}
      </div>
    </div>

    <StreamControls />
  </header>
</template>
