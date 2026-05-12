<script setup lang="ts">
import { Toaster } from 'vue-sonner'
import DashboardView from './views/DashboardView.vue'
import { useDataStream } from './composables/useDataStream'

useDataStream()
</script>

<template>
  <div class="starfield" aria-hidden="true"></div>
  <DashboardView />
  <Toaster theme="dark" position="top-right" rich-colors />
</template>
