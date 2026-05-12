<script setup lang="ts">
import { PLATFORMS } from '../../types/platform'
import { useStreamStore } from '../../stores/streamStore'

const stream = useStreamStore()
</script>

<template>
  <nav class="platform-filter" aria-label="Platform filter">
    <button
      v-for="platform in PLATFORMS"
      :key="platform.id"
      type="button"
      :class="['platform-pill', { active: stream.activePlatform === platform.id }]"
      @click="stream.setPlatform(platform.id)"
    >
      <span :style="{ color: platform.color }">{{ platform.icon }}</span>
      {{ platform.name }}
    </button>
  </nav>
</template>
