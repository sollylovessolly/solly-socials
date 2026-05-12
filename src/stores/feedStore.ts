import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { FeedEvent } from '../types/feed'

const MAX_EVENTS = 100

export const useFeedStore = defineStore('feed', () => {
  const events = ref<FeedEvent[]>([
    {
      id: crypto.randomUUID(),
      type: 'milestone',
      emoji: '★',
      badge: 'MILESTONE',
      message: 'Solly Social crossed 847K total followers.',
      timestamp: Date.now() - 15_000,
      platform: 'All',
    },
    {
      id: crypto.randomUUID(),
      type: 'viral',
      emoji: '◆',
      badge: 'VIRAL',
      message: 'TikTok GRWM edit is accelerating past 500K views.',
      timestamp: Date.now() - 42_000,
      platform: 'TikTok',
    },
  ])
  const unreadCount = ref(2)

  function addEvent(event: FeedEvent) {
    if (!event.message || !event.badge || !Number.isFinite(event.timestamp)) return
    events.value.unshift(event)
    unreadCount.value += 1
    if (events.value.length > MAX_EVENTS) events.value.splice(MAX_EVENTS)
  }

  function clearUnread() {
    unreadCount.value = 0
  }

  return { events, unreadCount, addEvent, clearUnread }
})
