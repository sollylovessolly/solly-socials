import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { PlatformId } from '../types/platform'

export type TimeRange = '1m' | '5m' | '15m' | '1h'

export const useStreamStore = defineStore('stream', () => {
  const isLive = ref(true)
  const timeRange = ref<TimeRange>('5m')
  const activePlatform = ref<PlatformId>('all')
  const startTime = ref(Date.now())
  const lastPausedAt = ref<number | null>(null)

  const statusLabel = computed(() => (isLive.value ? 'LIVE' : 'PAUSED'))

  function startStream() {
    if (!isLive.value) {
      isLive.value = true
      lastPausedAt.value = null
    }
  }

  function pauseStream() {
    if (isLive.value) {
      isLive.value = false
      lastPausedAt.value = Date.now()
    }
  }

  function toggleStream() {
    if (isLive.value) pauseStream()
    else startStream()
  }

  function setTimeRange(range: TimeRange) {
    timeRange.value = range
  }

  function setPlatform(platform: PlatformId) {
    activePlatform.value = platform
  }

  return {
    isLive,
    timeRange,
    activePlatform,
    startTime,
    lastPausedAt,
    statusLabel,
    startStream,
    pauseStream,
    toggleStream,
    setTimeRange,
    setPlatform,
  }
})
