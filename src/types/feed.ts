export type EventType = 'viral' | 'growth' | 'engage' | 'trending' | 'alert' | 'milestone'

export interface FeedEvent {
  id: string
  type: EventType
  emoji: string
  badge: string
  message: string
  timestamp: number
  platform?: string
}
