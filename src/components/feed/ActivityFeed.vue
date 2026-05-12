<script setup lang="ts">
import FeedItem from './FeedItem.vue'
import { useFeedStore } from '../../stores/feedStore'

const feed = useFeedStore()
</script>

<template>
  <section class="activity-card glass-panel">
    <div class="chart-heading">
      <div>
        <p class="eyebrow">Newest first</p>
        <h2>Activity Feed</h2>
      </div>
      <button class="clear-button" type="button" @click="feed.clearUnread">
        {{ feed.unreadCount }} new
      </button>
    </div>

    <TransitionGroup tag="ul" name="feed" class="feed-list">
      <FeedItem v-for="event in feed.events" :key="event.id" :event="event" />
    </TransitionGroup>
  </section>
</template>
