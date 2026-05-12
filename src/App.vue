<script setup lang="ts">
import DashboardView from './views/DashboardView.vue'
import { useDataStream } from './composables/useDataStream'

useDataStream()
</script>

<template>
  <DashboardView />
</template>
