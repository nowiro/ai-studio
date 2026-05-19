---
id: plan.tools-shop-next
title: tools-shop — B2B bulk pricing tier
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
  adr: null
  hub: ../../projects/tools-shop/README.md
  bpmn: ../../bpmn/bookstore-purchase.bpmn
---

# Plan: tools-shop — B2B bulk pricing tier

## Goal

Introduce quantity-tier pricing typical for B2B (5+ → -5%, 20+ → -10%, 100+ → custom quote) on top of the shared `shop-core` and surface the tier on every product card / cart line.

## Context

Per audit `tools-shop` runs at :4209 on `shop-core` / `shop-ui`. Numeric attributes (weight, length, voltage). No bulk pricing yet.

## Scope

| In                                                    | Out                                           |
| ----------------------------------------------------- | --------------------------------------------- |
| `BulkPricingTier[]` field on `BaseProduct` (optional) | Tax rules per country                         |
| `priceForQty(qty, product)` pure helper in shop-core  | Custom quote workflow (out — emit event only) |
| UI: tier indicator on card + cart line                | Negotiated prices per customer                |

## Tasks (DAG)

| id   | title                                                             | agent              | outputs                                      | done_when                       |
| ---- | ----------------------------------------------------------------- | ------------------ | -------------------------------------------- | ------------------------------- |
| T001 | `BulkPricingTier` type + `priceForQty()` in shop-core             | frontend-developer | libs/shop-core/src/lib/pricing.ts            | unit tests for 4 tier scenarios |
| T002 | Seed tools-shop catalogue with tier data                          | frontend-developer | libs/tools-shop-data/src/lib/catalogue.ts    | 80% of products have tiers      |
| T003 | UI: tier badge on `<ais-shop-product-card>` (price strikethrough) | frontend-developer | libs/shop-ui/src/lib/product-card.\*         | visual matches spec on hover    |
| T004 | Cart line shows tier-adjusted price                               | frontend-developer | libs/shop-ui/src/lib/cart-drawer.\*          | totals reflect tier discount    |
| T005 | "Request quote" CTA for 100+ qty (emits CustomEvent)              | frontend-developer | libs/shop-ui/src/lib/cart-drawer.\*          | event fired; toast confirmation |
| T006 | E2E: add 25 of a product, see 10% discount                        | test-engineer      | apps/tools-shop-e2e/src/bulk-pricing.spec.ts | green                           |
| T007 | Update docs                                                       | doc-writer         | docs/projects/tools-shop/\*.md               | doc-audit clean                 |

## Validation gate

```bash
pnpm affected:lint && pnpm typecheck && pnpm affected:test && pnpm affected:e2e && pnpm affected:build
```

## Risks & mitigations

- **Risk:** Pricing changes ripple to bookstore / toy-shop — Mitigation: `BulkPricingTier[]` optional on `BaseProduct`; products without it use flat price.
- **Risk:** UI clutter on cheap items — Mitigation: badge hidden when tiers absent; tested by snapshot.

## Rollback

`BulkPricingTier` is optional on the shared shape. Removing tier data from tools-shop catalogue reverts UI to plain price.
