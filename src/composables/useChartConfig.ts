import { computed } from 'vue'
import { useMetricsStore } from '../stores/metricsStore'
import { useStreamStore } from '../stores/streamStore'
import { filterDataPoints, formatChartTime } from './useTimeRange'

const axis = {
  axisLine: { lineStyle: { color: '#2D1A24' } },
  axisLabel: { color: '#9D8A90', fontFamily: 'Fira Code' },
  splitLine: { lineStyle: { color: 'rgba(201, 168, 76, 0.08)' } },
}

const tooltip = {
  trigger: 'axis',
  backgroundColor: '#120810',
  borderColor: '#C9A84C',
  textStyle: { color: '#F5F0F0', fontFamily: 'Jost' },
}

export function useChartConfig() {
  const metrics = useMetricsStore()
  const stream = useStreamStore()

  const followerLineOption = computed(() => {
    const points = filterDataPoints(metrics.followerHistory, stream.timeRange)

    return {
      color: ['#C41E3A'],
      tooltip,
      grid: { left: 42, right: 18, top: 28, bottom: 34 },
      xAxis: {
        type: 'category',
        data: points.map((point) => formatChartTime(point.timestamp)),
        ...axis,
      },
      yAxis: { type: 'value', scale: true, ...axis },
      series: [
        {
          name: 'Followers',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          showSymbol: false,
          lineStyle: { width: 3, color: '#C41E3A' },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(201, 168, 76, 0.36)' },
                { offset: 0.45, color: 'rgba(196, 30, 58, 0.24)' },
                { offset: 1, color: 'rgba(10, 4, 8, 0)' },
              ],
            },
          },
          data: points.map((point) => point.value),
        },
      ],
    }
  })

  const engagementBarOption = computed(() => {
    const active = stream.activePlatform
    const platforms = metrics.platforms

    return {
      tooltip: { ...tooltip, trigger: 'item' },
      grid: { left: 44, right: 18, top: 30, bottom: 42 },
      xAxis: { type: 'category', data: platforms.map((platform) => platform.name), ...axis },
      yAxis: { type: 'value', ...axis },
      series: [
        {
          name: 'Interactions',
          type: 'bar',
          barWidth: '48%',
          itemStyle: {
            borderRadius: [12, 12, 4, 4],
            borderColor: '#C9A84C',
            borderWidth: 0,
            color: (params: { dataIndex: number }) => {
              const platform = platforms[params.dataIndex] ?? platforms[0]
              return platform && (active === 'all' || active === platform.id) ? platform.color : 'rgba(157, 138, 144, 0.28)'
            },
          },
          emphasis: { itemStyle: { shadowBlur: 20, shadowColor: 'rgba(201, 168, 76, 0.55)' } },
          data: platforms.map((platform) => ({
            value: platform.engagement,
            itemStyle: { borderWidth: active === platform.id ? 2 : 0 },
          })),
        },
      ],
    }
  })

  const reachAreaOption = computed(() => {
    const points = filterDataPoints(metrics.reachHistory, stream.timeRange)

    return {
      color: ['#C41E3A', '#C9A84C'],
      tooltip,
      legend: {
        top: 0,
        right: 8,
        textStyle: { color: '#9D8A90', fontFamily: 'Jost' },
      },
      grid: { left: 54, right: 20, top: 42, bottom: 34 },
      xAxis: { type: 'category', data: points.map((point) => formatChartTime(point.timestamp)), ...axis },
      yAxis: { type: 'value', scale: true, ...axis },
      series: [
        {
          name: 'Reach',
          type: 'line',
          smooth: true,
          showSymbol: false,
          lineStyle: { width: 3 },
          areaStyle: { color: 'rgba(128, 0, 32, 0.4)' },
          data: points.map((point) => point.reach),
        },
        {
          name: 'Impressions',
          type: 'line',
          smooth: true,
          showSymbol: false,
          lineStyle: { width: 3 },
          areaStyle: { color: 'rgba(201, 168, 76, 0.2)' },
          data: points.map((point) => point.impressions),
        },
      ],
    }
  })

  const heatmapOption = computed(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const hours = Array.from({ length: 24 }, (_, index) => `${index}:00`)
    const data = metrics.heatmapData.flatMap((row, day) => row.map((value, hour) => [hour, day, value]))

    return {
      tooltip: {
        position: 'top',
        backgroundColor: '#120810',
        borderColor: '#C9A84C',
        textStyle: { color: '#F5F0F0', fontFamily: 'Jost' },
        formatter: (params: { value: [number, number, number] }) => {
          const [hour, day, value] = params.value
          return `${days[day]} ${hours[hour]}<br/>Engagement Score: ${value}`
        },
      },
      grid: { left: 48, right: 16, top: 20, bottom: 38 },
      xAxis: { type: 'category', data: hours, splitArea: { show: true }, ...axis },
      yAxis: { type: 'category', data: days, splitArea: { show: true }, ...axis },
      visualMap: {
        min: 0,
        max: 100,
        show: false,
        inRange: { color: ['#0d1117', '#0e4429', '#006d32', '#26a641', '#39d353'] },
      },
      series: [{ name: 'Best Posting Times', type: 'heatmap', data, emphasis: { itemStyle: { borderColor: '#39d353', borderWidth: 1 } } }],
    }
  })

  return { followerLineOption, engagementBarOption, reachAreaOption, heatmapOption }
}
