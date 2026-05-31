---
id: docs.dashboard.testing
title: Dashboard — testing view
type: project
status: done
date: 2026-05-29
links:
  hub: README.md
  e2e: ../../../apps/dashboard-e2e
  adr: ../../adr/0010-dashboard-kpi-charts.md
---

# Dashboard — testing view

## E2E (Playwright)

[`apps/dashboard-e2e/src/dashboard.spec.ts`](../../../apps/dashboard-e2e/src/dashboard.spec.ts)
— runs on Desktop Chrome + Mobile Chrome (RWD breakpoints).

| AC   | Scenario                                | Asserts                                                                                        |
| ---- | --------------------------------------- | ---------------------------------------------------------------------------------------------- |
| AC-1 | Homepage renders the 4 KPI chart panels | `panel-revenue/-top-products/-daily-orders/-category-mix` visible; first `<canvas>` paints     |
| AC-2 | Refresh does not crash                  | `dashboard-refresh` click keeps `dashboard-page` mounted                                       |
| AC-3 | `/charts/showcase` lazy route renders   | all 5 wrappers (`showcase-line/-bar/-pie/-gauge/-heatmap`) visible; ≥ 1 `<canvas>` per wrapper |

> **AC-3 canvas count is a lower bound, not exact.** ECharts paints a second
> `<canvas>` for some chart types (heatmap visualMap, gauge/pie hover) and how
> many it adds is an internal that shifts between versions. The test asserts
> `count ≥ wrappers` instead of a brittle exact number (was hard-coded to 6,
> broke at 8 once the charts rendered fully — see the chart-theme fix below).

## Chart colours — known dependency

The ECharts wrappers read their palette from the Material 3 `--mat-sys-*` tokens
via [`libs/charts/src/theme.ts`](../../../libs/charts/src/theme.ts). That bridge
resolves `light-dark()` token values to concrete `rgb()` through a hidden probe
element — without it, ECharts (a canvas renderer) receives the literal
`light-dark(...)` string and paints **black** series. A regression test for this
belongs at the `libs/charts` unit level (`ChartThemeBridge.snapshot()` returns
concrete colours, never `light-dark(...)`).

## Unit (Vitest)

`libs/charts`, `libs/dashboard-data`, `libs/dashboard-feature` carry `*.spec.ts`
run by the native Angular 21 Vitest runner. Component a11y can be asserted with
`expectNoA11yViolations()` from `@ai-studio/shared-test-utils`.

## Run

```bash
pnpm nx e2e dashboard-e2e                 # http://localhost:4211
pnpm nx run-many -t test --projects=charts,dashboard-data,dashboard-feature
```

## Suggested next coverage

- Unit regression: `ChartThemeBridge` never emits `light-dark(...)` (locks the black-series fix).
- E2E: assert at least one bar/series pixel is non-background (catches "charts render but invisible").
