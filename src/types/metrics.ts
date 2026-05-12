export interface DataPoint {
  timestamp: number
  value: number
}

export interface MetricCard {
  id: string
  label: string
  value: number
  trend: number
  trendDirection: 'up' | 'down' | 'neutral'
  sparkline: number[]
  unit: string
  helper: string
}

export interface PlatformData {
  id: 'instagram' | 'tiktok' | 'twitter' | 'youtube'
  name: string
  color: string
  engagement: number
  followers: number
}

export interface ReachPoint {
  timestamp: number
  reach: number
  impressions: number
}
