<script setup lang="ts">
import VChart from 'vue-echarts'
import TimeRangeSelector from '../controls/TimeRangeSelector.vue'
import { useChartConfig } from '../../composables/useChartConfig'

const { followerLineOption } = useChartConfig()
</script>

<template>
  <section class="chart-card glass-panel">
    <div class="chart-heading">
      <div>
        <p class="eyebrow">Live trajectory</p>
        <h2>Follower Growth</h2>
      </div>
      <TimeRangeSelector />
    </div>
    <VChart class="chart" :option="followerLineOption" autoresize />
  </section>
</template>
