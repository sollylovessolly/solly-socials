<script setup lang="ts">
import { computed } from 'vue'
import { formatDistanceToNow } from 'date-fns'
import { useNow } from '@vueuse/core'
import type { FeedEvent } from '../../types/feed'

const props = defineProps<{ event: FeedEvent }>()
const now = useNow({ interval: 1000 })

const timeAgo = computed(() => (now.value, formatDistanceToNow(props.event.timestamp, { addSuffix: true })))
</script>

<template>
  <li :class="['feed-item', `feed-item--${event.type}`]">
    <span class="feed-icon">{{ event.emoji }}</span>
    <div class="feed-content">
      <div class="feed-row">
        <span class="feed-badge">{{ event.badge }}</span>
        <span v-if="event.platform" class="feed-platform">{{ event.platform }}</span>
      </div>
      <p>{{ event.message }}</p>
    </div>
    <time>{{ timeAgo }}</time>
  </li>
</template>
