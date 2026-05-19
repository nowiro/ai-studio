---
id: plan.bookstore-next
title: bookstore — user reviews + ratings persistence
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
  hub: ../../projects/bookstore/README.md
  bpmn: ../../bpmn/bookstore-purchase.bpmn
---

# Plan: bookstore — user reviews + ratings persistence

## Goal

Add per-book user reviews (text + 1-5 stars) persisted to localStorage so subsequent sessions show the rating distribution and reviewer count, completing the e-commerce demo loop.

## Context

Per 2026-05-19 audit `bookstore` runs at :4208 on shared `shop-core` + `shop-ui`. Cart and checkout work. `<ais-shop-stars-rating>` exists in `libs/shop-ui` but only renders static averages.

## Scope

| In                                              | Out                                     |
| ----------------------------------------------- | --------------------------------------- |
| Review form on book detail (auth required mock) | Backend persistence (localStorage only) |
| Star aggregate computed signal on catalog rows  | Moderation / flagging                   |
| Review list with pagination (10 per page)       | i18n of reviews                         |

## Tasks (DAG)

| id   | title                                                          | agent              | outputs                                             | done_when                           |
| ---- | -------------------------------------------------------------- | ------------------ | --------------------------------------------------- | ----------------------------------- |
| T001 | `Review` model + `BookstoreReviewStore` (signal-based)         | frontend-developer | libs/bookstore-data/src/lib/review-store.ts         | store API tested                    |
| T002 | Persistence to localStorage (key `ais.bookstore.reviews.v1`)   | frontend-developer | libs/bookstore-data/src/lib/review-storage.ts       | round-trip preserves state          |
| T003 | Review form component (Reactive Form + 5-star input)           | frontend-developer | libs/bookstore-feature-catalogue/.../review-form.\* | a11y: label + role=slider for stars |
| T004 | Aggregate signal on catalog row (avg + count)                  | frontend-developer | libs/bookstore-feature-catalogue/.../catalog.\*     | row shows average to 1 decimal      |
| T005 | Update `<ais-shop-stars-rating>` to consume aggregate          | frontend-developer | libs/shop-ui/src/lib/stars-rating/\*                | binding via input signal            |
| T006 | E2E: submit review, reload, count persists                     | test-engineer      | apps/bookstore-e2e/src/reviews.spec.ts              | green                               |
| T007 | Update docs/projects/bookstore/{business,technical,testing}.md | doc-writer         | docs/projects/bookstore/\*.md                       | doc-audit clean                     |

## Validation gate

```bash
pnpm affected:lint
pnpm typecheck
pnpm affected:test --coverage
pnpm affected:e2e
pnpm affected:build
```

## Risks & mitigations

- **Risk:** localStorage quota exhausted with long reviews — Mitigation: cap review text 1000 chars; emit warning when total bytes > 1 MB.
- **Risk:** Mock auth used for "user" identity — Mitigation: keep `AuthService.user()` signal as the identity source; review owner is whatever mock user is active.

## Rollback

Single feature branch. All changes additive (new lib code, optional component). Revert via `git checkout`.
