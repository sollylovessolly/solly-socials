# Solly Social — Real-Time Social Media Analytics

Solly Social is a Vue 3 + TypeScript real-time analytics dashboard for monitoring live social media performance across Instagram, TikTok, Twitter/X, and YouTube. The product direction is a luxury editorial command center: deep burgundy surfaces, gold highlights, subtle stars, and high-density live analytics.

## Setup Instructions

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
```

## Architecture Explanation

The app is organized around reusable dashboard sections:

- `src/types` defines the typed data contracts for metrics, feed events, and platforms.
- `src/stores` centralizes live dashboard state with Pinia.
- `src/composables` contains reusable streaming, filtering, and ECharts configuration logic.
- `src/components` holds focused UI components for layout, controls, metrics, charts, and feed items.
- `src/views/DashboardView.vue` composes the dashboard page.

## State Management Strategy

Pinia is used as the central state layer:

- `streamStore` tracks live/paused state, selected time range, selected platform, and uptime start time.
- `metricsStore` owns follower totals, engagement rate, reach, impressions, viral score, platform engagement, chart history, and heatmap values.
- `feedStore` owns the real-time activity feed and unread count.

This keeps live data mutations out of presentation components and makes the app easier to scale.

## Rendering Optimization Decisions

- Historical chart arrays are capped at 500 points to prevent unbounded memory growth.
- Activity feed events are capped at 100 items.
- Streaming intervals are created in `useDataStream` and cleared in `onUnmounted`.
- ECharts receives reactive option objects and uses canvas rendering for smooth updates.
- Components are split by responsibility to avoid large, expensive re-renders.
- Time range filtering happens in a composable before chart options are produced.

## Data Streaming Approach

The dashboard uses a mocked streaming generator because the challenge accepts simulated real-time streams. The generator runs on three intervals:

- Every 2 seconds: followers, engagement, reach, feed events, and occasional spike events.
- Every 3 seconds: platform engagement values and viral score recalculation.
- Every 10 seconds: heatmap drift and occasional milestone/viral events.

Pause/resume stops all visible data mutations while preserving the current dashboard state.

## Error Handling And Stability

Incoming simulated values are validated before mutation with numeric checks and clamping. Invalid events are ignored if required fields are missing. Intervals are cleaned up to avoid leaks, and arrays are trimmed continuously.

## Trade-offs Made

- The project uses mocked streaming data instead of WebSockets to keep the submission frontend-only and easy to run.
- The heatmap is generated locally instead of using a larger analytics dataset.
- Platform icons are lightweight text symbols to avoid extra asset complexity while preserving visual polish.
