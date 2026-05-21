# 0010 — Dashboard chart library

- Status: accepted (2026-05-19, after /clarify)
- Date: 2026-05-18
- Decision-makers: orchestrator, architect
- Consulted: frontend-developer
- Informed: dashboard maintainers

## Context and problem statement

The new `apps/dashboard` (port 4211) renders 5 chart panels:
`sales-by-shop` (bar), `top-products` (horizontal bar),
`low-stock` (table + colour-coded chips), `daily-orders` (line over 30
days), `category-mix` (donut). Charts read seeds + cart signals from
each shop's data lib and recompute on every cart mutation.

Which chart library do we adopt? The choice locks an SVG dependency,
a theming approach, and an API style across the dashboard.

## Decision drivers

- **Angular-native** — works with signals, OnPush, standalone
  components without ngModule shims.
- **Bundle size** — dashboard is one route, so a heavy lib hurts the
  whole portal's lazy-load budget.
- **Theming** — must consume Material design tokens (`bg-primary`,
  `text-on-surface`) without `::ng-deep` overrides.
- **Accessibility** — keyboard-navigable focus, ARIA labels, table
  fallback for screen readers.
- **License** — MIT or Apache 2.0 only.

## Considered options

1. **ApexCharts** + `ng-apexcharts` — declarative API, large default
   chart catalogue, ~140 KB gzipped.
2. **ngx-charts** (Swimlane) — Angular-only, signals-friendly, SVG
   under the hood, ~95 KB gzipped, smaller default catalogue.
3. **Chart.js** + `ng2-charts` — Canvas-based, ~70 KB gzipped, no
   built-in accessibility.
4. **D3 directly** — maximum control, but every chart is from-scratch
   work.

## Decision outcome

Chosen option **2 — ngx-charts**.

The dashboard has 5 panels with conventional shapes (bar, line, donut,
table + chips, horizontal bar). ngx-charts ships every shape we need,
its SVG output themes cleanly via CSS variables (no `::ng-deep`
required to map to Material tokens), and at ~95 KB gzipped it costs
~30 % less than ApexCharts for the same use case.

ApexCharts has the larger catalogue and a more polished default look,
but the extra ~45 KB doesn't earn its place for 5 panels. We can
revisit if a future "Phase 6 — advanced analytics" plan adds heatmaps
or treemaps that ngx-charts lacks.

### Consequences

- ➕ Each chart is a standalone Angular component consuming a signal
  and rendering an `<ngx-charts-*>` element.
- ➕ Theme tokens flow through CSS variables — no custom override
  layer needed.
- ➕ Bundle stays under the 1.5 MB error budget for the dashboard
  route.
- ➖ Smaller catalogue than ApexCharts — we accept the constraint and
  document the trade-off here. Future analytics needs that don't fit
  ngx-charts get a sibling lib (`libs/dashboard-advanced-charts`).
- ➖ Animations are basic. Acceptable for KPI tiles; revisit if
  product asks for richer transitions.

## Pros and cons of the options

### Option 1 — ApexCharts

- ➕ Large catalogue (heatmap, treemap, sparkline, radar).
- ➕ Polished defaults.
- ➖ ~140 KB gzipped — heaviest of the options.
- ➖ `ng-apexcharts` is a thin wrapper around an imperative JS lib;
  signal interop requires extra glue.

### Option 2 — ngx-charts (chosen)

- ➕ Angular-native; signals + OnPush friendly.
- ➕ ~95 KB gzipped.
- ➕ SVG output themes via CSS variables.
- ➖ Smaller catalogue.
- ➖ Documentation is sparse for the newer signal-driven recipes.

### Option 3 — Chart.js + ng2-charts

- ➕ Smallest at ~70 KB gzipped.
- ➖ Canvas — no DOM-level a11y, no easy hover tooltips for screen
  readers.
- ➖ The Angular wrapper lags upstream releases.

### Option 4 — D3 directly

- ➕ Maximum control.
- ➖ Every chart is a from-scratch component. Bad cost/value for 5
  panels.

## Implementation plan

PR-sized bullets, in Phase 3 of the consolidated roadmap.

- [ ] Install `@swimlane/ngx-charts` and its `d3` peer deps.
- [ ] Scaffold `libs/dashboard-feature/src/charts/` with one
      component per chart (5 total) + a shared `kpi-tile`.
- [ ] Wire signal inputs from `libs/dashboard-data` aggregation fns.
- [ ] Verify accessibility — keyboard focus, ARIA labels, table
      fallback for screen readers.
- [ ] Document chart contract (input → SVG) in
      `docs/projects/dashboard/technical.md`.

## References

- rules: .ai/rules/styling.md
- upstream: <https://swimlane.gitbook.io/ngx-charts>
- compared: <https://apexcharts.com/angular-chart-demos/>
