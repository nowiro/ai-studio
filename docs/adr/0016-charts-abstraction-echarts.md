---
id: adr.0016
title: Charts abstraction layer backed by Apache ECharts
type: adr
date: 2026-05-20
status: accepted
deciders: orchestrator, architect
links:
  spec: null
  plan: docs/ai-workflow/plans/2026-05-20-echarts-wrappers-dashboards-games.md
  supersedes: null
---

# ADR-0016 — Charts abstraction layer backed by Apache ECharts

## Status

**Accepted** — 2026-05-20

## Context

The dashboard app currently renders 4 "chart" panels as plain HTML tables behind a TODO comment ("Bar chart — ngx-charts po Phase 3.5"). We need a real charting solution that:

- ships professional-grade interactive charts (line, bar, pie/donut, gauge, heatmap minimum) with consistent visual quality across browsers
- respects our Material 3 + Tailwind v4 token contract (colors, typography, density) — no hard-coded chart palettes
- works under our Angular 21 standalone + OnPush + signal-based render model
- tree-shakes well so the dashboard chunk does not balloon for the rest of the apps
- **can be swapped for another library later** without changing every consumer

The third point is the architectural one. The team's stated direction (see plan
2026-05-20) is: "z czasem biblioteka pewnie się zmieni i będę chciał zmienić
ECharts na inną bibliotekę npm". That means consumers must NOT depend on the
backend library directly — they consume our abstraction.

## Decision

1. Introduce a new Nx library **`libs/charts`** (scope: `shared`, type: `ui`)
   that exposes a stable, library-agnostic public API to consumers.
2. Pick **Apache ECharts 6** (Apache 2.0 license) as the initial backend.
3. Wrappers map our plain TypeScript shapes (`ChartSeries`, `ChartAxis`,
   `ChartLegend`, `ChartTooltip`) onto ECharts' option object **inside the
   wrapper**. Consumers never see `EChartsOption`.
4. Material 3 integration happens in **one place**: `libs/charts/src/theme.ts`
   reads the `--mat-sys-*` CSS variables at render time and produces an ECharts
   theme object. The same file is the only place that would change for a future
   backend.

### Public API contract (what consumers may import)

```ts
// libs/charts/src/types.ts — stable contract, not tied to ECharts
export interface ChartSeries<T = number> {
  readonly id: string;
  readonly label: string;
  readonly data: readonly T[];
  readonly kind?: 'line' | 'bar' | 'area';
  readonly color?: string; // optional override; defaults read from M3 tokens
}

export interface ChartAxis {
  readonly type: 'category' | 'value' | 'time';
  readonly labels?: readonly string[];
  readonly format?: 'integer' | 'decimal' | 'currency' | 'percent' | 'date';
}

// libs/charts/src/index.ts — only wrappers exported, never ECharts internals
export { ChartHostComponent } from './chart-host.component.js';
export { LineChartComponent } from './line-chart.component.js';
export { BarChartComponent } from './bar-chart.component.js';
export { PieChartComponent } from './pie-chart.component.js';
export { GaugeChartComponent } from './gauge-chart.component.js';
export { HeatmapChartComponent } from './heatmap-chart.component.js';
export type { ChartSeries, ChartAxis, ChartLegend, ChartTooltip } from './types.js';
```

### What consumers do NOT import

```ts
// ❌ Banned — consumers must not see backend types
import type { EChartsOption } from 'echarts';
import * as echarts from 'echarts';
```

A `no-restricted-imports` ESLint rule (added in T012 of the plan) enforces this
in `libs/!(charts)/**`.

### Tree-shaking

ECharts is imported piecemeal from `echarts/core`, `echarts/charts`, and
`echarts/components`. Only the chart types and components we ship are bundled.
Initial measurements (T006) target ≤ 250 kB gzipped added to the consuming app's
initial chunk for all 5 chart types combined.

## Alternatives considered

| Option                                        | Why rejected                                                                                                                  |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **Chart.js + ng2-charts**                     | Lighter (~80 kB) but lacks gauge/heatmap; canvas-only (no SVG export); ng2-charts adds an Angular indirection we'd still wrap |
| **D3 directly**                               | Lowest level — we'd build 5 chart components from scratch, multiplying our maintenance surface                                |
| **ngx-charts (Swimlane)**                     | Last release stale; Angular 21 compat unverified; opinionated theming that fights Material 3 tokens                           |
| **Highcharts**                                | Excellent quality but commercial license required for our scope                                                               |
| **ApexCharts (apx-charts)**                   | Good Angular wrapper but theme integration weaker; bundle ~300 kB initial                                                     |
| **No abstraction (consume ECharts directly)** | Locks every consumer to ECharts; future swap touches every dashboard panel — exactly the future we want to avoid              |

ECharts won on: chart-type coverage, performance with 10 k+ data points,
explicit theming hooks, Apache 2.0 license, active maintenance.

## Consequences

**Positive:**

- Dashboard chart panels can be implemented next sprint with a single wrapper import
- Library swap (e.g. ECharts → D3 if we hit a use case ECharts can't cover) requires changes only in `libs/charts`, not in consumers
- Material 3 dark / light switching cascades automatically because `theme.ts` reads CSS variables

**Negative:**

- One more layer of indirection — debugging a chart sometimes means stepping into the wrapper before reaching ECharts
- Wrappers must keep up with ECharts API changes (mitigated by pinning ECharts to a minor version + bump as a chore commit)
- The plain-shape contract may not expose every advanced ECharts feature; rare features can use a `passThroughOption?: unknown` escape hatch but with a lint warning

**Neutral:**

- Bundle adds ~250 kB gzipped to the dashboard (acceptable for a chart-heavy app; lazy-loaded showcase route caps this)
- Tests mock `echarts/core` to avoid booting the real renderer under jsdom

## Validation

Plan 2026-05-20's validation gate covers this ADR. Specifically: `pnpm nx test charts` (≥ 60 % coverage), `pnpm nx build dashboard` (bundle within budget), `pnpm ai:validate` (no consumer importing `echarts/*` directly via the new lint rule).

## References

- Apache ECharts: https://echarts.apache.org/en/index.html
- ECharts option spec: https://echarts.apache.org/en/option.html
- Plan: [`docs/ai-workflow/plans/2026-05-20-echarts-wrappers-dashboards-games.md`](../ai-workflow/plans/2026-05-20-echarts-wrappers-dashboards-games.md)
- Styling rule (M3 tokens contract): [`.ai/rules/styling.md`](../../.ai/rules/styling.md)
- ADR-0004 (Phaser as default game library) — games keep their renderer; charts library does not affect them
