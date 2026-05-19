---
id: docs.projects.dashboard
title: Dashboard — KPI panel aggregating every shop
type: project-hub
status: living
date: 2026-05-19
links:
  bpmn: ../../bpmn/mfe-portal-load.bpmn
  bpmn_note: cross-cutting — dashboard consumes KPIs from the federated shops, see also `bookstore-purchase.bpmn` (per-shop flow)
---

# Dashboard

> KPI dashboard (port **4211**) — 4-tile summary strip + 5 chart panels
> aggregating sales / top products / low stock / daily orders / category
> mix across every shop demo (`bookstore`, `tools-shop`, `toy-shop`,
> `tire-shop`). Pure aggregation lives in `libs/dashboard-data`; chart
> rendering is currently table-based and migrates to `ngx-charts` in
> Phase 3.5 of the consolidated roadmap.

## Quickstart

```bash
# Standalone SPA
pnpm start:dashboard             # http://localhost:4211

# As a Web Component (loaded by the portal at /portal/dashboard)
pnpm nx run dashboard:build-element
# → dist/apps/dashboard-element/main.js
```

## Status

| Validator | Status                                         |
| --------- | ---------------------------------------------- |
| lint      | ✅                                             |
| typecheck | ✅                                             |
| build     | ✅                                             |
| test      | ✅ (5 unit tests covering aggregation helpers) |
| e2e       | ⏸ planowany                                    |

## Layout

```
apps/dashboard/                (scope:dashboard · type:app · port 4211)
  ├─ src/main.ts               (standalone bootstrap)
  ├─ src/element.ts            (Web Component bootstrap — <ais-dashboard>)
  └─ src/{app/app.component,index.html,styles.scss}

libs/dashboard-data/           (scope:dashboard · type:data-access)
  ├─ src/models.ts             (Sale, KpiSnapshot, ShopRevenueRow, TopProductRow,
  │                             LowStockRow, DailyOrderRow, CategoryMixRow)
  ├─ src/aggregation.ts        (revenueByShop, topProducts, lowStockOf,
  │                             dailyOrders, categoryMix — pure functions)
  ├─ src/aggregation.spec.ts   (5 unit tests, ≥80% coverage)
  ├─ src/seed.ts               (14-row sales seed + 4-row low-stock seed)
  └─ src/dashboard.service.ts  (signal-backed read-side service)

libs/dashboard-feature/        (scope:dashboard · type:feature)
  ├─ src/kpi-tile.component.ts        (<ais-kpi-tile> single-figure card)
  └─ src/dashboard-page.component.ts  (4 KPI tiles + 5 panel grid)
```

## Public API

### `DashboardService`

```ts
@Injectable({ providedIn: 'root' })
class DashboardService {
  readonly revenue: Signal<readonly ShopRevenueRow[]>;
  readonly topProducts: Signal<readonly TopProductRow[]>;
  readonly lowStock: Signal<readonly LowStockRow[]>;
  readonly dailyOrders: Signal<readonly DailyOrderRow[]>;
  readonly categoryMix: Signal<readonly CategoryMixRow[]>;
  refresh(): void;
}
```

Pełny refresh jest signal-driven (clarification z `/clarify`): wywołanie `refresh()` re-emituje seedy i wszystkie pochodne signale przeliczają się automatycznie. Wpięcie do mutacji `ShopCartService` (debounce 150 ms) to follow-up po Phase 3.5.

## Roadmap follow-ups

- Phase 3.5 — Podmień placeholder tabele na `<ngx-charts-*>` (5 paneli)
- Phase 3.8 — Wpięcie do `ShopCartService` mutations (debounced signal updates)
- Phase 3.7 — Dashboard testy E2E (Playwright po naciśnięciu portalu)

## ADRs

- [ADR-0010](../../adr/0010-dashboard-chart-library.md) — chart library choice (`ngx-charts`, `accepted`)
