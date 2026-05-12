<script setup lang="ts">
import DashboardView from './views/DashboardView.vue'
import { useDataStream } from './composables/useDataStream'

useDataStream()
</script>

<template>
  <div class="starfield" aria-hidden="true"></div>
  <DashboardView />
</template>
