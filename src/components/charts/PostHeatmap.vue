<script setup lang="ts">
import VChart from 'vue-echarts'
import { useChartConfig } from '../../composables/useChartConfig'

const { heatmapOption } = useChartConfig()
</script>

<template>
  <section class="chart-card glass-panel">
    <div class="chart-heading">
      <div>
        <p class="eyebrow">Posting intelligence</p>
        <h2>Best Posting Times</h2>
      </div>
      <span class="chart-chip">7 × 24 heatmap</span>
    </div>
    <VChart class="chart" :option="heatmapOption" autoresize />
  </section>
</template>
