---
id: plan.library-app
title: Build library demo app (catalogue + lending + reservations)
type: plan
date: 2026-05-18
trigger: user request — "kolejnym przykladem moze byc biblioteka"
status: done
owner: orchestrator
agents:
  - analyst
  - architect
  - frontend-developer
  - test-engineer
links:
  spec: docs/analytical/specs/library-app/spec.md
  adr: null
  issue: null
---

# Plan: Library app (book lending demo)

## Goal

Demo a small-library front-end: browse catalogue, search by title/author/
ISBN, reserve/borrow books, see "my account" with current loans + history

- overdue warnings. Frontend-only with a seeded JSON catalogue (~200
  books) and per-tab in-memory member account. Strong on **routing with
  guards + role-based views** (reader vs. librarian) and **table-driven
  UIs with MatTable**.

## Scope

| In                                                                                         | Out                                              |
| ------------------------------------------------------------------------------------------ | ------------------------------------------------ |
| Public catalogue: search, filter (genre, author, year, language, availability), pagination | Real authentication / OAuth                      |
| Book detail: cover, blurb, copies (free vs. on-loan), reservation queue                    | Backend / database                               |
| Reader account: my loans, my reservations, my history, fines                               | Payments (overdue fines are display-only)        |
| Librarian view (toggled via mock-login): all loans, overdue list, add book, update copies  | Multi-branch routing                             |
| Role-based route guards (`reader` / `librarian`)                                           | Email reminders                                  |
| Mock-login screen: pick reader-1 / reader-2 / librarian-1 from a dropdown                  | Statistical dashboards beyond 1 read-only KPI    |
| Material 3 MatTable with sort + paginator + sticky header                                  | Real-time updates (no SSE / WebSocket)           |
| `i18n`: PL primary, EN via the shared toggle                                               | Accessibility audit beyond MaterialA11y defaults |
| Vitest unit tests on services (loan-policy, reservation-queue, search ranking)             |                                                  |
| Playwright smoke E2E (browse → reserve → "my account")                                     |                                                  |

## Inputs

- `apps/personal-data-wizard/**` — Reactive Forms patterns
- `apps/union-vault/**` — multi-page app conventions
- `libs/shared-language/**` — i18n toggle (PL/EN)
- `.ai/rules/{angular,nx,styling,testing}.md`
- Reference: <https://www.biblioteka.bn.org.pl/> (Polish national library UX)
- Reference: Material MatTable with sort + filter + paginator

## Architecture

```
apps/library                           (scope:app, type:app)         port 4206
apps/library-e2e                       (scope:app, type:e2e)

libs/library-feature-catalogue         (scope:library, type:feature)
  ├ catalogue-page.component.ts        (search + facet panel + table/grid toggle)
  ├ book-detail.component.ts           (cover + blurb + copies + reserve CTA)
  └ search-bar.component.ts            (debounced search input + advanced filters)

libs/library-feature-account           (scope:library, type:feature)
  ├ my-loans.component.ts              (MatTable: due date, days-left, renew)
  ├ my-reservations.component.ts       (queue position, cancel)
  ├ my-history.component.ts            (past loans)
  └ login-mock.component.ts            (member dropdown: pick reader vs. librarian)

libs/library-feature-librarian         (scope:library, type:feature)
  ├ overdue-list.component.ts          (MatTable; bulk-message disabled v1)
  ├ all-loans.component.ts             (filter by reader, status, due date)
  ├ add-book.component.ts              (Reactive Form; cover URL field)
  └ kpi-strip.component.ts             (single read-only stat: copies-on-loan today)

libs/library-data                      (scope:library, type:data-access)
  ├ models/                            (Book, Copy, Loan, Reservation, Member, Role)
  ├ catalogue.service.ts               (signals: books, filtered, facets)
  ├ loans.service.ts                   (issue/return/renew; loan-policy.ts pure fns)
  ├ reservations.service.ts            (queue ops; fairness invariant)
  ├ auth.service.ts                    (signals: currentMember, role; mock store)
  └ search.service.ts                  (search ranking pure fn; tested)

libs/library-data-seed                 (scope:library, type:util)
  └ seed.ts                            (~200 books, 4–6 readers, 1 librarian)

libs/library-ui                        (scope:library, type:ui)
  ├ book-cover.component.ts            (lazy image + fallback)
  ├ availability-chip.component.ts     (free / borrowed / reserved)
  ├ due-date-badge.component.ts        (today / soon / overdue)
  └ role-guard.directive.ts            (structural: *aisRoleAllow="['librarian']")

eslint.config.mjs depConstraints — `scope:library` libs may only depend on
`scope:shared`, other `scope:library` libs, and `scope:util`.
```

## Tasks (DAG)

| id   | title                                                                              | agent              | inputs           | outputs                                   | done_when                            | parallel_with | blocked_by |
| ---- | ---------------------------------------------------------------------------------- | ------------------ | ---------------- | ----------------------------------------- | ------------------------------------ | ------------- | ---------- |
| T001 | Spec: entity model, role matrix, loan/reservation invariants                       | analyst            | reference UX     | docs/analytical/specs/library-app/spec.md | No `[?]` markers; AC table complete  |               |            |
| T002 | ADR: role-based routing approach (guard + directive vs. component-level branching) | architect          | T001             | docs/adr/NNNN-library-roles.md            | ADR Status: accepted                 |               | T001       |
| T003 | Scaffold libs (library-data, library-data-seed, library-ui, 3 feature libs)        | frontend-developer | T002             | libs/library-\*/\*\*                      | `pnpm nx lint <each>` clean          |               | T002       |
| T004 | Seed catalogue (~200 books) + members (4–6 readers, 1 librarian)                   | frontend-developer | T003             | libs/library-data-seed/src/seed.ts        | Loadable, type-checked               | T005          | T003       |
| T005 | Build pure logic: loan-policy.ts, reservation-queue.ts, search ranking             | frontend-developer | T003             | libs/library-data/src/\*\*                | ≥80 % branch coverage on these       | T004          | T003       |
| T006 | Catalogue page + book-detail + search bar                                          | frontend-developer | T004, T005       | libs/library-feature-catalogue/\*\*       | Renders 200 books, search <50 ms     | T007          | T004, T005 |
| T007 | Account views (my-loans, my-reservations, my-history, login-mock)                  | frontend-developer | T005             | libs/library-feature-account/\*\*         | MatTable + sort + paginator working  | T008          | T005       |
| T008 | Librarian view (all-loans, overdue-list, add-book, kpi-strip)                      | frontend-developer | T005             | libs/library-feature-librarian/\*\*       | Role-guarded routes work             | T007          | T005       |
| T009 | Role-guard directive + route guards in apps/library                                | frontend-developer | T002, T007, T008 | libs/library-ui/, apps/library/           | Non-librarian sees 403 on /librarian |               | T007, T008 |
| T010 | Generate `apps/library` + `apps/library-e2e` (port 4206)                           | frontend-developer | T006..T009       | apps/library/\*\*                         | `pnpm nx serve library` boots :4206  |               | T009       |
| T011 | Wire ESLint depConstraints; `start:library` + extend `start:all`                   | frontend-developer | T010             | eslint.config.mjs, package.json           | `pnpm nx lint` clean                 |               | T010       |
| T012 | Vitest: services, pure fns, guards                                                 | test-engineer      | T003..T010       | libs/library-_/\*\*/_.spec.ts             | Coverage ≥ thresholds                | T013          | T010       |
| T013 | Playwright E2E: browse → reserve → my-account → librarian-toggle → mark overdue    | test-engineer      | T010             | apps/library-e2e/src/\*\*.spec.ts         | E2E green                            | T012          | T010       |
| T014 | Code review                                                                        | code-reviewer      | T012 + T013 diff | review verdict                            | verdict: approved                    |               | T012, T013 |
| T015 | Update CHANGELOG + README + this plan (status: done)                               | doc-writer         | accepted PR      | CHANGELOG.md, this file                   | doc-audit clean                      |               | T014       |

## Definition of Done

- All tasks ✅
- `pnpm nx run-many -t lint test build --parallel=3` green
- Spec + ADR linked and approved
- This plan's `status: done`
