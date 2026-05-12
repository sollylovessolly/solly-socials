<script setup lang="ts">
import AppHeader from '../components/layout/AppHeader.vue'
import MetricCardGrid from '../components/metrics/MetricCardGrid.vue'
import FollowerLineChart from '../components/charts/FollowerLineChart.vue'
import EngagementBarChart from '../components/charts/EngagementBarChart.vue'
import ReachAreaChart from '../components/charts/ReachAreaChart.vue'
import PostHeatmap from '../components/charts/PostHeatmap.vue'
import ActivityFeed from '../components/feed/ActivityFeed.vue'
</script>

<template>
  <main class="dashboard-shell">
    <AppHeader />
    <MetricCardGrid />

    <section class="dashboard-grid">
      <FollowerLineChart />
      <EngagementBarChart />
      <ReachAreaChart />
      <PostHeatmap />
      <ActivityFeed />
    </section>
  </main>
</template>
