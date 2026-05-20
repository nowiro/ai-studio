---
id: architecture.charts
title: Charts architecture — wrappers, theme bridge, backend swap
type: architecture
date: 2026-05-20
links:
  adr: docs/adr/0016-charts-abstraction-echarts.md
  rule: .ai/rules/styling.md
  plan: docs/ai-workflow/plans/2026-05-20-echarts-wrappers-dashboards-games.md
---

# Charts architecture

> The `libs/charts` library wraps Apache ECharts 6 behind a stable, library-agnostic public API. Consumers in `apps/**` and `libs/!(charts)/**` never import `echarts/*` directly — a future backend swap stays a one-library change. See [ADR-0016](../adr/0016-charts-abstraction-echarts.md) for the decision.

## Layer cake

```
┌──────────────────────────────────────────────────────────────────┐
│ apps/dashboard  apps/portal  …  (consumers)                      │
│  imports: @ai-studio/charts only                                 │
└─────────────────────┬────────────────────────────────────────────┘
                      │ plain TS shapes (ChartSeries, ChartAxis, …)
┌─────────────────────▼────────────────────────────────────────────┐
│ libs/charts/src/{line,bar,pie,gauge,heatmap}-chart.component.ts  │
│  thin shims — read signal inputs, delegate to option-builders.ts │
└─────────────────────┬────────────────────────────────────────────┘
                      │ args: {…inputs, theme: ChartTheme}
┌─────────────────────▼────────────────────────────────────────────┐
│ libs/charts/src/option-builders.ts                               │
│  PURE functions — toLineOption, toBarOption, toPieOption,        │
│  toGaugeOption, toHeatmapOption. The ONLY place that knows the   │
│  ECharts option vocabulary. Unit-tested in isolation.            │
└─────────────────────┬────────────────────────────────────────────┘
                      │ EChartsOption (internal type, never leaked)
┌─────────────────────▼────────────────────────────────────────────┐
│ libs/charts/src/chart-host.component.ts                          │
│  owns the ECharts instance, ResizeObserver, theme listener       │
└─────────────────────┬────────────────────────────────────────────┘
                      │ initChart / disposeChart / resizeChart
┌─────────────────────▼────────────────────────────────────────────┐
│ libs/charts/src/echarts-import.ts                                │
│  ONE place that touches `echarts/*`                              │
│  registers BarChart, LineChart, PieChart, GaugeChart,            │
│  HeatmapChart + GridComponent, LegendComponent, TooltipComponent,│
│  DataZoomComponent, VisualMapComponent + CanvasRenderer          │
└──────────────────────────────────────────────────────────────────┘
```

## Public contract

Consumers import **only** from `@ai-studio/charts`:

```ts
import {
  BarChartComponent,
  type ChartAxis,
  type ChartSeries,
  type ChartSlice,
  GaugeChartComponent,
  HeatmapChartComponent,
  LineChartComponent,
  PieChartComponent,
} from '@ai-studio/charts';
```

Every shape lives in `libs/charts/src/types.ts` and stays free of ECharts vocabulary. The wrappers map your `ChartSeries[]` to an ECharts `option` internally.

### Theme bridge

`ChartThemeBridge` reads the `--mat-sys-*` CSS variables off the host page and returns a stable `ChartTheme` snapshot. Wrappers call it on every render, so a Material 3 dark / light toggle cascades into charts automatically.

| `ChartTheme` field | Bound to                                                                            | Fallback (light)     |
| ------------------ | ----------------------------------------------------------------------------------- | -------------------- |
| `palette[0..5]`    | `--mat-sys-{primary,tertiary,secondary,error,primary-container,tertiary-container}` | hand-picked sequence |
| `background`       | `--mat-sys-surface`                                                                 | `#ffffff`            |
| `foreground`       | `--mat-sys-on-surface`                                                              | `#1f2937`            |
| `muted`            | `--mat-sys-on-surface-variant`                                                      | `#6b7280`            |
| `grid`             | `--mat-sys-outline-variant`                                                         | `#e5e7eb`            |
| `fontFamily`       | `--mat-sys-body-medium-font`                                                        | `Roboto, …`          |

The bridge is the **only** file that talks to host design tokens — see ADR-0016 §Decision.

## Bundle behaviour

`echarts-import.ts` does piecemeal imports:

```ts
import { BarChart, GaugeChart, HeatmapChart, LineChart, PieChart } from 'echarts/charts';
import {
  DataZoomComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
  VisualMapComponent,
} from 'echarts/components';
import * as core from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
```

Tree-shaking keeps only the registered chart types + components in the bundle. Measured on the dashboard showcase route (lazy-loaded):

| Asset             | Raw    | Transferred |
| ----------------- | ------ | ----------- |
| showcase chunk    | 739 kB | 199 kB      |
| dashboard initial | 882 kB | 180 kB      |

Both are within ADR-0016's budget. Adding a new chart type means adding it to the `core.use([...])` array — the unused chart packages stay tree-shaken.

## How to add a new chart type

1. Pick the new ECharts chart name (e.g. `RadarChart`) and add it to `echarts-import.ts` (`core.use([..., RadarChart])`).
2. Add a `toRadarOption(args)` builder in `option-builders.ts` next to the other five. Take `{...inputs, theme: ChartTheme}` and return `EChartsOption`.
3. Create `libs/charts/src/radar-chart.component.ts` mirroring `pie-chart.component.ts`: signal inputs in plain shapes → `computed(() => toRadarOption({...}))` → `<ais-chart-host>`.
4. Export the component from `libs/charts/src/index.ts`.
5. Add a smoke spec block in `option-builders.spec.ts` for `toRadarOption` — assert the option shape with a fixed `TEST_THEME`. No TestBed needed.
6. Add a card to `/charts/showcase` so designers can see it.

## How to swap the backend later

ADR-0016's whole point. The ordered checklist:

1. Replace **`libs/charts/src/echarts-import.ts`** with the new backend's init / dispose / resize / option-set primitives. Keep `EChartsInstance` and `EChartsOption` exported under the same names (or rename + update the option-builders imports — single file).
2. Rewrite each builder body in **`libs/charts/src/option-builders.ts`** (`toLineOption`, `toBarOption`, `toPieOption`, `toGaugeOption`, `toHeatmapOption`) to emit the new backend's option object. Public arg shapes (`ChartSeries`, `ChartAxis`, `ChartSlice`, `ChartHeatCell`) stay unchanged. `option-builders.spec.ts` guides the rewrite — green specs = behaviour preserved.
3. The wrapper components (`*-chart.component.ts`) stay untouched — they only forward signal inputs into the builders.
4. Update `ChartThemeBridge` mapping if the new backend wants a different theme object shape. Consumers don't change.
5. Bump the ECharts dependency to the new package in `package.json`.
6. Update the ESLint `no-restricted-imports` pattern in `eslint.config.mjs` to fence off the new backend instead of `echarts/*`.

That's it — **zero consumer changes, zero wrapper changes**. Verified by the fact that the dashboard and the showcase route both import only from `@ai-studio/charts`.

## Showcase route

`/charts/showcase` in the dashboard app renders every wrapper with deterministic sample data so designers, ops, and incoming engineers can see the visual + a11y contract at a glance. Implementation: `libs/dashboard-feature/src/charts-showcase.component.ts`.

## Specs

The wrapper components are deliberately thin — every meaningful mapping lives in `option-builders.ts`, which is a set of pure functions. Specs target the builders directly (`option-builders.spec.ts`, 20 tests covering line / bar / pie / gauge / heatmap shape, axis swap, stacking, legend positioning, formatters). No TestBed, no ECharts boot, no jsdom signal-input quirks.

The theme bridge has its own spec (`theme.spec.ts`) that locks in the fallback contract when no `--mat-sys-*` variables are present (SSR, tests).

If a future wrapper needs full integration testing (template + change detection), reach for Playwright via the showcase route at `/charts/showcase` rather than fighting `TestBed.componentRef.setInput` under jsdom — that path is known unreliable for required signal inputs.
