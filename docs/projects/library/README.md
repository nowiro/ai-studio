---
id: docs.library
title: Library — documentation hub
type: project
status: done
date: 2026-05-18
links:
  spec: ../../analytical/specs/library-app/spec.md
  plan: ../../ai-workflow/plans/2026-05-18-library-app.md
  adr: ../../adr/0007-library-roles.md
  app: ../../../apps/library
  port: 4206
---

# Library

> Small-library management demo. Reader / librarian role-based views,
> paginated MatTable catalogue, mock-login dropdown. Frontend-only —
> no backend, no real auth.

|               |                                                                        |
| ------------- | ---------------------------------------------------------------------- |
| **Status**    | ✅ done                                                                |
| **Port**      | `4206`                                                                 |
| **Start**     | `pnpm start:library` → <http://localhost:4206>                         |
| **Scope tag** | `scope:library`                                                        |
| **Stack**     | Angular 21 · Material 3 · Tailwind v4 · signals · MatTable + paginator |

## Audience routing

| You are…                      | Start here                                                                                                                                                               |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Product / analyst**         | [`business.md`](business.md)                                                                                                                                             |
| **Frontend / DevOps**         | [`technical.md`](technical.md)                                                                                                                                           |
| **Test engineer / QA**        | [`testing.md`](testing.md)                                                                                                                                               |
| **Reviewer (SDD compliance)** | [`spec.md`](../../analytical/specs/library-app/spec.md) → [`plan.md`](../../ai-workflow/plans/2026-05-18-library-app.md) → [`ADR-0007`](../../adr/0007-library-roles.md) |

## Quickstart

```bash
pnpm install
pnpm start:library
# → http://localhost:4206

# Validation gate
pnpm nx run-many -t lint test build --projects=library,library-data,library-ui,library-feature-catalogue,library-feature-account,library-feature-librarian

# E2E smoke
pnpm nx e2e library-e2e
```

## Demo in 90 seconds

1. Open `/` — catalogue with ≥ 50 books across genres / languages.
2. Click **Fantasy** under "Gatunek"; results narrow.
3. Click any row → book detail (cover + blurb + availability chips).
4. Go to **Moje konto** in the toolbar.
5. In **Profil demo**, pick **Anna Kowalska**. Reader-only views appear.
6. Switch profile to **Ewa Lewandowska** (librarian). Toolbar gains
   "Panel bibliotekarza".
7. Open the librarian panel → KPI strip + overdue list + all loans
   with mark-returned buttons.
8. As a reader, try to navigate to `/librarian` directly → guard
   redirects to `/account`.

The smoke flow is automated in
[`apps/library-e2e/src/catalogue.spec.ts`](../../../apps/library-e2e/src/catalogue.spec.ts).

## Project map

```
apps/
  library/                   port 4206, AppShell + role-aware menu
  library-e2e/               Playwright smoke

libs/
  library-data/              models + filter/sort + signal services + seed
  library-ui/                presentational chips (availability, due-date, book-cover)
  library-feature-catalogue/ catalogue page (MatTable) + book detail
  library-feature-account/   my-loans, my-reservations, login-mock
  library-feature-librarian/ overdue list, all-loans table, KPI strip
```

Role-allow directive + role guard live in
[`@ai-studio/shared-app-shell`](../../../libs/shared-app-shell) — see
[`technical.md#role-gating`](technical.md#role-gating).

## Health metrics

| Metric                          | Target                    | Current                            |
| ------------------------------- | ------------------------- | ---------------------------------- |
| Unit-test pass rate             | 100 %                     | 44/44                              |
| `library-data` coverage (stmts) | ≥ 80 %                    | ≥ 95 %                             |
| Dataset                         | 100–200 books, ≥ 8 genres | 60 books / 10 genres / 5 languages |
| Initial bundle size (gzip)      | < 350 KB delta            | within budget                      |
| E2E flow                        | passes in chromium        | ✅                                 |

## SDD artefacts

- [`spec.md`](../../analytical/specs/library-app/spec.md) — problem
  statement, personas, AC-1 … AC-11.
- [`plan.md`](../../ai-workflow/plans/2026-05-18-library-app.md) — task
  DAG (T001 … T015) + DoD.
- [`ADR-0007`](../../adr/0007-library-roles.md) — role-routing
  strategy (`CanMatchFn` guard + structural directive; both read
  `AuthService.role()`).

## Related repo-wide docs

- [`docs/projects/README.md`](../README.md) — index + doc conventions.
- [`docs/programming/testing-strategy.md`](../../programming/testing-strategy.md)
- [`.ai/rules/angular.md`](../../../.ai/rules/angular.md)
