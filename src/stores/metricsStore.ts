import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { DataPoint, MetricCard, PlatformData, ReachPoint } from '../types/metrics'

const MAX_HISTORY = 500
const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

function buildInitialHistory(base: number, points = 90, stepMs = 2000): DataPoint[] {
  const now = Date.now()
  return Array.from({ length: points }, (_, index) => ({
    timestamp: now - (points - index) * stepMs,
    value: Math.round(base + index * 3 + Math.sin(index / 4) * 18),
  }))
}

function buildInitialReach(points = 90, stepMs = 2000): ReachPoint[] {
  const now = Date.now()
  return Array.from({ length: points }, (_, index) => {
    const reach = 1_840_000 + index * 3200 + Math.sin(index / 5) * 18_000
    return {
      timestamp: now - (points - index) * stepMs,
      reach: Math.round(reach),
      impressions: Math.round(reach * 1.42 + 120_000),
    }
  })
}

function buildHeatmap(): number[][] {
  return Array.from({ length: 7 }, (_, day) =>
    Array.from({ length: 24 }, (_, hour) => {
      const eveningBoost = hour >= 18 && hour <= 22 ? 36 : 0
      const lunchBoost = hour >= 12 && hour <= 14 ? 18 : 0
      const weekendBoost = day >= 5 ? 12 : 0
      return clamp(Math.round(18 + eveningBoost + lunchBoost + weekendBoost + Math.random() * 28), 5, 100)
    }),
  )
}

function pushCapped<T>(collection: T[], item: T, max = MAX_HISTORY) {
  collection.push(item)
  if (collection.length > max) collection.splice(0, collection.length - max)
}

export const useMetricsStore = defineStore('metrics', () => {
  const totalFollowers = ref(847_293)
  const followersToday = ref(1247)
  const engagementRate = ref(4.73)
  const reachToday = ref(2_140_000)
  const impressionsToday = ref(3_120_000)
  const viralScore = ref(87)

  const followerHistory = ref<DataPoint[]>(buildInitialHistory(totalFollowers.value))
  const reachHistory = ref<ReachPoint[]>(buildInitialReach())
  const heatmapData = ref<number[][]>(buildHeatmap())
  const platforms = ref<PlatformData[]>([
    { id: 'instagram', name: 'Instagram', color: '#E1306C', engagement: 12_400, followers: 316_200 },
    { id: 'tiktok', name: 'TikTok', color: '#69C9D0', engagement: 28_900, followers: 281_700 },
    { id: 'twitter', name: 'Twitter/X', color: '#1DA1F2', engagement: 4_200, followers: 91_800 },
    { id: 'youtube', name: 'YouTube', color: '#FF0000', engagement: 8_100, followers: 157_593 },
  ])

  const followerSparkline = computed(() => followerHistory.value.slice(-10).map((point) => point.value))
  const reachSparkline = computed(() => reachHistory.value.slice(-10).map((point) => point.reach))
  const impressionSparkline = computed(() => reachHistory.value.slice(-10).map((point) => point.impressions))

  const metricCards = computed<MetricCard[]>(() => [
    {
      id: 'followers',
      label: 'Total Followers',
      value: totalFollowers.value,
      trend: 2.3,
      trendDirection: 'up',
      sparkline: followerSparkline.value,
      unit: '',
      helper: `+${followersToday.value.toLocaleString()} today`,
    },
    {
      id: 'engagement',
      label: 'Engagement Rate',
      value: engagementRate.value,
      trend: 1.1,
      trendDirection: engagementRate.value >= 4 ? 'up' : 'neutral',
      sparkline: [4.1, 4.3, 4.2, 4.5, 4.6, 4.4, 4.8, 4.7, 4.9, engagementRate.value],
      unit: '%',
      helper: 'Above avg: 2.1%',
    },
    {
      id: 'reach',
      label: 'Reach Today',
      value: reachToday.value,
      trend: 3.8,
      trendDirection: 'up',
      sparkline: reachSparkline.value,
      unit: '',
      helper: `${impressionsToday.value.toLocaleString()} impressions`,
    },
    {
      id: 'viral',
      label: 'Viral Score',
      value: viralScore.value,
      trend: viralScore.value > 80 ? 12.4 : 0.8,
      trendDirection: viralScore.value > 70 ? 'up' : 'neutral',
      sparkline: impressionSparkline.value,
      unit: '/100',
      helper: '2 posts trending now',
    },
  ])

  function updateFollowers(delta: number) {
    if (!Number.isFinite(delta)) return
    totalFollowers.value += Math.round(delta)
    followersToday.value += Math.max(0, Math.round(delta))
    pushCapped(followerHistory.value, { timestamp: Date.now(), value: totalFollowers.value })
  }

  function updateEngagement(value: number) {
    if (!Number.isFinite(value)) return
    engagementRate.value = Number(clamp(value, 0, 12).toFixed(2))
  }

  function updateReach(delta: number, multiplier = 1) {
    if (!Number.isFinite(delta) || !Number.isFinite(multiplier)) return
    const reachDelta = Math.max(0, Math.round(delta * multiplier))
    reachToday.value += reachDelta
    impressionsToday.value += Math.round(reachDelta * (1.25 + Math.random() * 0.55))
    pushCapped(reachHistory.value, {
      timestamp: Date.now(),
      reach: reachToday.value,
      impressions: impressionsToday.value,
    })
  }

  function updatePlatform(id: PlatformData['id'], delta: number) {
    const platform = platforms.value.find((item) => item.id === id)
    if (!platform || !Number.isFinite(delta)) return
    platform.engagement += Math.max(0, Math.round(delta))
  }

  function updateViralScore(delta: number) {
    viralScore.value = Math.round(clamp(viralScore.value + delta, 0, 100))
  }

  function updateHeatmap() {
    heatmapData.value = heatmapData.value.map((row) =>
      row.map((value) => clamp(Math.round(value + (Math.random() * 6 - 3)), 5, 100)),
    )
  }

  function trimHistory(maxPoints = MAX_HISTORY) {
    if (followerHistory.value.length > maxPoints) followerHistory.value.splice(0, followerHistory.value.length - maxPoints)
    if (reachHistory.value.length > maxPoints) reachHistory.value.splice(0, reachHistory.value.length - maxPoints)
  }

  return {
    totalFollowers,
    followersToday,
    engagementRate,
    reachToday,
    impressionsToday,
    viralScore,
    followerHistory,
    reachHistory,
    heatmapData,
    platforms,
    metricCards,
    updateFollowers,
    updateEngagement,
    updateReach,
    updatePlatform,
    updateViralScore,
    updateHeatmap,
    trimHistory,
  }
})
