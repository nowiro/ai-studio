---
id: plan.dashboard-next
title: dashboard — cross-MFE BroadcastChannel + drill-down navigation
type: plan
date: 2026-05-19
trigger: per-app next-iteration plan after 2026-05-19 audit
status: done
closedAt: 2026-05-19
closeReason: '2026-05-19 audit — finalized as part of the post-implementation cleanup. Tasks delivered as scaffolds + spec; remaining implementation tracked in per-app/connector/tool docs. Plan retired to archive/.'
owner: orchestrator
agents:
  - frontend-developer
  - test-engineer
  - doc-writer
links:
  spec: null
  adr: docs/adr/0009-microfrontend-architecture.md
  hub: ../../projects/dashboard/README.md
---

# Plan: dashboard — cross-MFE BroadcastChannel + drill-down navigation

## Goal

Let the dashboard react to cart / login events fired by any embedded app via `BroadcastChannel` and link KPI tiles to drill-down views in the originating MFE.

## Context

After audit `dashboard` exists with `libs/dashboard-feature` and `dashboard-data`. KPIs render statically from in-memory aggregates. ADR-0010 picked ngx-charts.

## Scope

| In                                                     | Out                                               |
| ------------------------------------------------------ | ------------------------------------------------- |
| `MfeBus` service over `BroadcastChannel('ais-mfe')`    | Server push (out of scope, no backend)            |
| Listen for `cart:updated`, `auth:login`, `auth:logout` | Generic event bus design — keep typed events only |
| Tile click → navigate to deep link in the source MFE   | Editing data from dashboard                       |

## Tasks (DAG)

| id   | title                                                            | agent              | outputs                                               | done_when                            |
| ---- | ---------------------------------------------------------------- | ------------------ | ----------------------------------------------------- | ------------------------------------ |
| T001 | `MfeBus` service + typed event union                             | frontend-developer | libs/shared-app-shell/src/lib/mfe-bus.ts              | publish/subscribe round-trip in test |
| T002 | Wire shop apps (tire/bookstore/tools/toy) to publish `cart:*`    | frontend-developer | libs/shop-core/src/lib/cart.service.ts                | events emitted on add/remove         |
| T003 | Dashboard subscribes; KPIs become signals                        | frontend-developer | libs/dashboard-feature/src/lib/dashboard.component.ts | KPI updates within 250 ms of event   |
| T004 | Drill-down: tile click navigates to `apps/portal#/<mfe>/<route>` | frontend-developer | libs/dashboard-feature/src/lib/tile.component.ts      | navigation works via portal shell    |
| T005 | E2E: open portal + dashboard + bookstore; add to cart; KPI ticks | test-engineer      | apps/dashboard-e2e/src/realtime.spec.ts               | green                                |
| T006 | Update docs                                                      | doc-writer         | docs/projects/dashboard/\*.md                         | doc-audit clean                      |

## Validation gate

```bash
pnpm affected:lint && pnpm typecheck && pnpm affected:test && pnpm affected:e2e && pnpm affected:build
```

## Risks & mitigations

- **Risk:** `BroadcastChannel` unsupported on Safari < 15 — Mitigation: feature-detect; fall back to `window.postMessage` (same-origin only, which is the demo case).
- **Risk:** Event spam during multi-add — Mitigation: debounce dashboard's recompute (150 ms) — pattern already documented in ADR-0010.

## Rollback

`MfeBus` adoption gated by `provideMfeBus()` in `main.ts`. Apps that don't add it silently skip publication.
