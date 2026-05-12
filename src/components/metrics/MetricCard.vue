<script setup lang="ts">
import { computed } from 'vue'
import type { MetricCard as MetricCardType } from '../../types/metrics'

const props = defineProps<{ metric: MetricCardType }>()

const formattedValue = computed(() => {
  if (props.metric.id === 'engagement') return props.metric.value.toFixed(2)
  if (props.metric.id === 'viral') return Math.round(props.metric.value).toString()
  return Math.round(props.metric.value).toLocaleString()
})

const points = computed(() => {
  const values = props.metric.sparkline
  if (values.length < 2) return ''
  const min = Math.min(...values)
  const max = Math.max(...values)
  const spread = max - min || 1
  return values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * 100
      const y = 34 - ((value - min) / spread) * 28
      return `${x},${y}`
    })
    .join(' ')
})
</script>

<template>
  <article class="metric-card glass-panel">
    <div class="metric-card__topline">
      <span>{{ metric.label }}</span>
      <span class="metric-star">★</span>
    </div>

    <div class="metric-value">
      <span>{{ formattedValue }}</span>
      <small>{{ metric.unit }}</small>
    </div>

    <p :class="['metric-trend', metric.trendDirection]">
      <span>{{ metric.trendDirection === 'down' ? '↓' : metric.trendDirection === 'up' ? '↑' : '→' }}</span>
      {{ metric.helper }} <strong>({{ metric.trend.toFixed(1) }}%)</strong>
    </p>

    <svg class="sparkline" viewBox="0 0 100 38" role="presentation">
      <polyline :points="points" fill="none" stroke="url(#sparkGold)" stroke-width="3" stroke-linecap="round" />
      <defs>
        <linearGradient id="sparkGold" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stop-color="#800020" />
          <stop offset="100%" stop-color="#E8C96A" />
        </linearGradient>
      </defs>
    </svg>
  </article>
</template>
