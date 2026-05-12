<script setup lang="ts">
import VChart from 'vue-echarts'
import { useChartConfig } from '../../composables/useChartConfig'

const { reachAreaOption } = useChartConfig()
</script>

<template>
  <section class="chart-card chart-card--wide glass-panel">
    <div class="chart-heading">
      <div>
        <p class="eyebrow">Audience exposure</p>
        <h2>Reach vs Impressions</h2>
      </div>
      <span class="chart-chip">unique accounts vs total views</span>
    </div>
    <VChart class="chart chart--wide" :option="reachAreaOption" autoresize />
  </section>
</template>
