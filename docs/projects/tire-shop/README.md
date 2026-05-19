---
id: docs.tire-shop
title: Tire-shop — documentation hub
type: project
status: done
date: 2026-05-18
links:
  spec: ../../analytical/specs/tire-shop/spec.md
  plan: ../../ai-workflow/plans/2026-05-18-tire-shop.md
  adr: ../../adr/0006-tire-shop-state.md
  app: ../../../apps/tire-shop
  port: 4205
  bpmn: ../../bpmn/tire-shop-checkout.bpmn
---

# Tire-shop

> Tire-retail e-commerce demo. Catalogue with faceted search, cart
> with localStorage persistence, 4-step Reactive Forms checkout. Frontend-
> only — no backend, no payments, no auth.

|               |                                                                |
| ------------- | -------------------------------------------------------------- |
| **Status**    | ✅ done                                                        |
| **Port**      | `4205`                                                         |
| **Start**     | `pnpm start:tire-shop` → <http://localhost:4205>               |
| **Scope tag** | `scope:tire-shop`                                              |
| **Stack**     | Angular 21 · Material 3 · Tailwind v4 · signals · localStorage |

## Audience routing

| You are…                      | Start here                                                                                                                                                             |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Product / analyst**         | [`business.md`](business.md)                                                                                                                                           |
| **Frontend / DevOps**         | [`technical.md`](technical.md)                                                                                                                                         |
| **Test engineer / QA**        | [`testing.md`](testing.md)                                                                                                                                             |
| **Reviewer (SDD compliance)** | [`spec.md`](../../analytical/specs/tire-shop/spec.md) → [`plan.md`](../../ai-workflow/plans/2026-05-18-tire-shop.md) → [`ADR-0006`](../../adr/0006-tire-shop-state.md) |

## Quickstart

```bash
# Install deps + dev server
pnpm install
pnpm start:tire-shop
# → http://localhost:4205

# Validation gate (lint + test + build)
pnpm nx run-many -t lint test build --projects=tire-shop,tire-data,tire-ui,tire-feature-catalogue,tire-feature-cart

# Playwright happy-path E2E
pnpm nx e2e tire-shop-e2e
```

## Demo in 90 seconds

1. Open `/` — see ≥ 50 tire SKUs in a responsive grid.
2. In the left filter panel, type `205/55` in the size fields; results
   narrow to that fitment.
3. Click **Continental** under "Marka"; results narrow further.
4. Sort dropdown → **Cena: rosnąco**.
5. Click **Do koszyka** on any card; cart icon badge increments.
6. Click the cart icon → drawer slides in from the right → click **Do kasy**.
7. Fill out 4-step stepper: contact → delivery (kurier) → invoice (skip)
   → summary → **Zamawiam i płacę** → confirmation with mock order number.

The full happy path is automated in
[`apps/tire-shop-e2e/src/catalogue.spec.ts`](../../../apps/tire-shop-e2e/src/catalogue.spec.ts).

## Project map

```
apps/
  tire-shop/                  port 4205, AppShell + cart drawer + router
  tire-shop-e2e/              Playwright happy path

libs/
  tire-data/                  models + filter/sort + signal services + seed
  tire-ui/                    presentational chips + tire-size input
  tire-feature-catalogue/     catalogue page + product detail + filter panel
  tire-feature-cart/          cart drawer + cart page + 4-step checkout
```

See [`technical.md#library-architecture`](technical.md#library-architecture)
for dependency edges and module-boundary rules.

## Health metrics

| Metric                          | Target                | Current |
| ------------------------------- | --------------------- | ------- |
| Unit-test pass rate             | 100 %                 | 35/35   |
| `tire-data` coverage (stmts)    | ≥ 80 %                | 100 %   |
| `tire-data` coverage (branches) | ≥ 75 %                | 91 %    |
| Initial bundle size (gzip)      | < 350 KB delta        | ~140 KB |
| Catalogue dataset               | ≥ 50 SKUs, ≥ 8 brands | 60 / 18 |

## SDD artefacts (do not edit these from this hub)

- [`spec.md`](../../analytical/specs/tire-shop/spec.md) — problem
  statement, personas, AC-1 … AC-12, success metrics, non-goals.
- [`plan.md`](../../ai-workflow/plans/2026-05-18-tire-shop.md) — task
  DAG (T001 … T013), validation gate, Definition of Done.
- [`ADR-0006`](../../adr/0006-tire-shop-state.md) — state strategy
  (signals + services + localStorage; no NgRx).

## Related repo-wide docs

- [`docs/programming/testing-strategy.md`](../../programming/testing-strategy.md)
- [`docs/architecture/system.md`](../../architecture/system.md)
- [`.ai/rules/angular.md`](../../../.ai/rules/angular.md)
- [`.ai/rules/styling.md`](../../../.ai/rules/styling.md)
