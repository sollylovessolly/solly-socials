<script setup lang="ts">
import VChart from 'vue-echarts'
import { useChartConfig } from '../../composables/useChartConfig'

const { engagementBarOption } = useChartConfig()
</script>

<template>
  <section class="chart-card glass-panel">
    <div class="chart-heading">
      <div>
        <p class="eyebrow">Platform pulse</p>
        <h2>Platform Engagement</h2>
      </div>
      <span class="chart-chip">likes + comments + shares</span>
    </div>
    <VChart class="chart" :option="engagementBarOption" autoresize />
  </section>
</template>
