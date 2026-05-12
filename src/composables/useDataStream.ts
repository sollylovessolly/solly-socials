import { onMounted, onUnmounted } from 'vue'
import { useFeedStore } from '../stores/feedStore'
import { useMetricsStore } from '../stores/metricsStore'
import { useStreamStore } from '../stores/streamStore'
import type { EventType, FeedEvent } from '../types/feed'

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min
const chance = (probability: number) => Math.random() < probability

type EventTemplate = {
  type: EventType
  emoji: string
  badge: string
  message: string
  platform?: string
}

const fallbackEvent: EventTemplate = { type: 'milestone', emoji: '★', badge: 'MILESTONE', message: 'Solly Social live monitoring is active.', platform: 'All' }

const events: EventTemplate[] = [
  { type: 'viral', emoji: '◆', badge: 'VIRAL', message: 'Your TikTok "GRWM" just hit 500K views.', platform: 'TikTok' },
  { type: 'growth', emoji: '✦', badge: 'GROWTH', message: '+847 new followers from an Instagram Reel.', platform: 'Instagram' },
  { type: 'engage', emoji: '●', badge: 'ENGAGE', message: '340 comments landed in 2 minutes on your last post.', platform: 'Instagram' },
  { type: 'trending', emoji: '↗', badge: 'TRENDING', message: '#SollyStyle is trending and your post is inside the wave.', platform: 'Twitter/X' },
  { type: 'alert', emoji: '!', badge: 'ALERT', message: 'Engagement dipped below the target on Twitter/X.', platform: 'Twitter/X' },
  { type: 'milestone', emoji: '★', badge: 'MILESTONE', message: 'You just crossed another audience milestone.', platform: 'All' },
]

function createEvent(template?: EventTemplate): FeedEvent {
  const picked: EventTemplate = template ?? events[randomInt(0, events.length - 1)] ?? fallbackEvent
  return {
    id: crypto.randomUUID(),
    type: picked.type,
    emoji: picked.emoji,
    badge: picked.badge,
    message: picked.message,
    timestamp: Date.now(),
    platform: picked.platform,
  }
}

export function useDataStream() {
  const metrics = useMetricsStore()
  const feed = useFeedStore()
  const stream = useStreamStore()
  let liveTimer: ReturnType<typeof setInterval> | undefined
  let platformTimer: ReturnType<typeof setInterval> | undefined
  let heatmapTimer: ReturnType<typeof setInterval> | undefined
  let spikeMultiplier = 1
  let spikeCycles = 0

  function pushEvent(template?: EventTemplate) {
    const event = createEvent(template)
    feed.addEvent(event)
  }

  function triggerSpike() {
    const spike = randomInt(1, 4)

    if (spike === 1) {
      spikeMultiplier = 5
      spikeCycles = 3
      metrics.updateViralScore(randomInt(4, 9))
      pushEvent({ type: 'viral', emoji: '◆', badge: 'VIRAL', message: 'Reel went viral: reach surge detected for the next cycle.', platform: 'TikTok' })
      return
    }

    if (spike === 2) {
      const followerSpike = randomInt(500, 5000)
      metrics.updateFollowers(followerSpike)
      metrics.updateViralScore(randomInt(5, 12))
      pushEvent({ type: 'growth', emoji: '✦', badge: 'GROWTH', message: `Celebrity mention triggered +${followerSpike.toLocaleString()} followers.`, platform: 'Instagram' })
      return
    }

    if (spike === 3) {
      metrics.updateEngagement(metrics.engagementRate + 1.5)
      metrics.updateViralScore(randomInt(3, 8))
      pushEvent({ type: 'engage', emoji: '●', badge: 'ENGAGE', message: 'Post saved 10K times: engagement rate jumped.', platform: 'Instagram' })
      return
    }

    metrics.platforms.forEach((platform) => metrics.updatePlatform(platform.id, randomInt(250, 900)))
    metrics.updateViralScore(randomInt(7, 13))
    pushEvent({ type: 'trending', emoji: '↗', badge: 'TRENDING', message: 'Trending hashtag boosted all tracked platforms.', platform: 'All' })
  }

  function tickMetrics() {
    if (!stream.isLive) return

    metrics.updateFollowers(randomInt(1, 4))
    metrics.updateEngagement(metrics.engagementRate + (Math.random() * 0.12 - 0.06))
    metrics.updateReach(randomInt(350, 1200), spikeMultiplier)
    metrics.trimHistory()

    if (spikeCycles > 0) spikeCycles -= 1
    if (spikeCycles === 0) spikeMultiplier = 1

    if (chance(0.16)) pushEvent()
    if (chance(0.025)) triggerSpike()
  }

  function tickPlatforms() {
    if (!stream.isLive) return

    metrics.updatePlatform('instagram', randomInt(6, 36))
    metrics.updatePlatform('tiktok', randomInt(10, 64))
    metrics.updatePlatform('twitter', randomInt(3, 18))
    metrics.updatePlatform('youtube', randomInt(7, 32))
    metrics.updateViralScore(randomInt(-1, 1))
  }

  function tickHeatmap() {
    if (!stream.isLive) return

    metrics.updateHeatmap()
    if (chance(0.1)) {
      pushEvent(chance(0.5) ? events[0] : events[5])
    }
  }

  onMounted(() => {
    liveTimer = setInterval(tickMetrics, 5000)
    platformTimer = setInterval(tickPlatforms, 7000)
    heatmapTimer = setInterval(tickHeatmap, 15_000)
  })

  onUnmounted(() => {
    if (liveTimer) clearInterval(liveTimer)
    if (platformTimer) clearInterval(platformTimer)
    if (heatmapTimer) clearInterval(heatmapTimer)
  })
}

