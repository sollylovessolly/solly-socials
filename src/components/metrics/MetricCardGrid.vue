<script setup lang="ts">
import MetricCard from './MetricCard.vue'
import { useMetricsStore } from '../../stores/metricsStore'

const metrics = useMetricsStore()
</script>

<template>
  <section class="metric-grid" aria-label="Live social metrics">
    <MetricCard v-for="metric in metrics.metricCards" :key="metric.id" :metric="metric" />
  </section>
</template>
