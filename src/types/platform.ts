export type PlatformId = 'all' | 'instagram' | 'tiktok' | 'twitter' | 'youtube'

export interface Platform {
  id: PlatformId
  name: string
  color: string
  icon: string
}

export const PLATFORMS: Platform[] = [
  { id: 'all', name: 'All', color: '#C9A84C', icon: '★' },
  { id: 'instagram', name: 'Instagram', color: '#E1306C', icon: '◐' },
  { id: 'tiktok', name: 'TikTok', color: '#69C9D0', icon: '♪' },
  { id: 'twitter', name: 'Twitter/X', color: '#1DA1F2', icon: 'X' },
  { id: 'youtube', name: 'YouTube', color: '#FF0000', icon: '▶' },
]
