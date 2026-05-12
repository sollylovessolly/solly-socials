import { computed } from 'vue'
import { useDark } from '@vueuse/core'
import { useMetricsStore } from '../stores/metricsStore'
import { useStreamStore } from '../stores/streamStore'
import { filterDataPoints, formatChartTime } from './useTimeRange'

export function useChartConfig() {
  const metrics = useMetricsStore()
  const stream = useStreamStore()
  const isDark = useDark({
    selector: 'body',
    valueDark: 'theme-dark',
    valueLight: 'theme-light',
  })

  const palette = computed(() => ({
    axisLine: isDark.value ? '#450011' : '#dcc6cd',
    axisLabel: isDark.value ? '#b99aa4' : '#654d57',
    splitLine: isDark.value ? 'rgba(201, 168, 76, 0.12)' : 'rgba(69, 0, 17, 0.1)',
    tooltipBg: isDark.value ? '#1E0007' : '#fff8fa',
    tooltipText: isDark.value ? '#F5F0F0' : '#16090e',
    burgundy: isDark.value ? '#CE0034' : '#800020',
    burgundyArea: isDark.value ? 'rgba(128, 0, 32, 0.32)' : 'rgba(128, 0, 32, 0.16)',
    gold: '#C9A84C',
    goldArea: isDark.value ? 'rgba(201, 168, 76, 0.18)' : 'rgba(201, 168, 76, 0.16)',
  }))

  const axis = computed(() => ({
    axisLine: { lineStyle: { color: palette.value.axisLine } },
    axisLabel: { color: palette.value.axisLabel, fontFamily: 'Fira Code' },
    splitLine: { lineStyle: { color: palette.value.splitLine } },
  }))

  const tooltip = computed(() => ({
    trigger: 'axis',
    backgroundColor: palette.value.tooltipBg,
    borderColor: palette.value.gold,
    textStyle: { color: palette.value.tooltipText, fontFamily: 'Jost' },
  }))

  const followerLineOption = computed(() => {
    const points = filterDataPoints(metrics.followerHistory, stream.timeRange)

    return {
      color: [palette.value.burgundy],
      tooltip: tooltip.value,
      grid: { left: 42, right: 18, top: 28, bottom: 34 },
      xAxis: {
        type: 'category',
        data: points.map((point) => formatChartTime(point.timestamp)),
        ...axis.value,
      },
      yAxis: { type: 'value', scale: true, ...axis.value },
      series: [
        {
          name: 'Followers',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          showSymbol: false,
          lineStyle: { width: 3, color: palette.value.burgundy },
          areaStyle: { color: palette.value.burgundyArea },
          data: points.map((point) => point.value),
        },
      ],
    }
  })

  const engagementBarOption = computed(() => {
    const active = stream.activePlatform
    const platforms = metrics.platforms

    return {
      tooltip: { ...tooltip.value, trigger: 'item' },
      grid: { left: 44, right: 18, top: 30, bottom: 42 },
      xAxis: { type: 'category', data: platforms.map((platform) => platform.name), ...axis.value },
      yAxis: { type: 'value', ...axis.value },
      series: [
        {
          name: 'Interactions',
          type: 'bar',
          barWidth: '48%',
          itemStyle: {
            borderRadius: [12, 12, 4, 4],
            borderColor: palette.value.gold,
            borderWidth: 0,
            color: (params: { dataIndex: number }) => {
              const platform = platforms[params.dataIndex] ?? platforms[0]
              return platform && (active === 'all' || active === platform.id) ? platform.color : 'rgba(157, 138, 144, 0.28)'
            },
          },
          emphasis: { itemStyle: { borderColor: palette.value.gold, borderWidth: 2 } },
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
      color: [palette.value.burgundy, palette.value.gold],
      tooltip: tooltip.value,
      legend: {
        top: 0,
        right: 8,
        textStyle: { color: palette.value.axisLabel, fontFamily: 'Jost' },
      },
      grid: { left: 54, right: 20, top: 42, bottom: 34 },
      xAxis: { type: 'category', data: points.map((point) => formatChartTime(point.timestamp)), ...axis.value },
      yAxis: { type: 'value', scale: true, ...axis.value },
      series: [
        {
          name: 'Reach',
          type: 'line',
          smooth: true,
          showSymbol: false,
          lineStyle: { width: 3 },
          areaStyle: { color: palette.value.burgundyArea },
          data: points.map((point) => point.reach),
        },
        {
          name: 'Impressions',
          type: 'line',
          smooth: true,
          showSymbol: false,
          lineStyle: { width: 3 },
          areaStyle: { color: palette.value.goldArea },
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
        backgroundColor: palette.value.tooltipBg,
        borderColor: palette.value.gold,
        textStyle: { color: palette.value.tooltipText, fontFamily: 'Jost' },
        formatter: (params: { value: [number, number, number] }) => {
          const [hour, day, value] = params.value
          return `${days[day]} ${hours[hour]}<br/>Engagement Score: ${value}`
        },
      },
      grid: { left: 48, right: 16, top: 20, bottom: 38 },
      xAxis: { type: 'category', data: hours, splitArea: { show: true }, ...axis.value },
      yAxis: { type: 'category', data: days, splitArea: { show: true }, ...axis.value },
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
