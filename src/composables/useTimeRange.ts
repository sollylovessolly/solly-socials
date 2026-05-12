import type { DataPoint, ReachPoint } from '../types/metrics'
import type { TimeRange } from '../stores/streamStore'

export const RANGE_TO_MS: Record<TimeRange, number> = {
  '1m': 60_000,
  '5m': 300_000,
  '15m': 900_000,
  '1h': 3_600_000,
}

export function getRangeMs(range: TimeRange) {
  return RANGE_TO_MS[range]
}

export function filterDataPoints<T extends DataPoint | ReachPoint>(points: T[], range: TimeRange): T[] {
  const cutoff = Date.now() - getRangeMs(range)
  return points.filter((point) => point.timestamp >= cutoff)
}

export function formatChartTime(timestamp: number) {
  return new Intl.DateTimeFormat('en', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(timestamp)
}
