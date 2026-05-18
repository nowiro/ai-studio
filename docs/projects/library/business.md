---
id: docs.library.business
title: Library — business documentation
type: business
status: living
date: 2026-05-18
audience: [product, analyst, sales, stakeholder]
links:
  spec: ../../analytical/specs/library-app/spec.md
  hub: README.md
---

# Library — business documentation

> The "what and why" view for the small-library demo. Tech: [`technical.md`](technical.md).
> Canonical AC: [`spec.md`](../../analytical/specs/library-app/spec.md).

## Value proposition

A reference implementation of a small-library management system that
shows how AI-assisted Angular delivery handles:

- **Two distinct UIs over the same data** — reader and librarian
  consume the same `Book` / `Loan` / `Reservation` entities but see
  different screens.
- **Role-gated routing + UI** — defence-in-depth gating ([ADR-0007](../../adr/0007-library-roles.md)):
  a route guard plus a structural directive both reading the same
  `AuthService.role()` signal.
- **MatTable + paginator + sort** — the canonical Angular tabular UI;
  reused by the school-journal demo's overdue / grade tables.
- **localStorage-free state** — pure in-memory signals; demonstrates
  that not every demo needs persistence.

Reusable for: any catalogue + lending domain (tool library, equipment
rental, asset tracking, conference-room booking).

## Personas

Verbatim from [`spec.md` § Personas](../../analytical/specs/library-app/spec.md#personas-affected):

| ID          | Role               | Primary need                                       |
| ----------- | ------------------ | -------------------------------------------------- |
| P-READER    | Library patron     | Find a book, reserve a copy, track loans.          |
| P-LIBRARIAN | Library staff      | Issue / return books; overdue list; add new books. |
| P-DEV       | Frontend developer | Reference for role-guarded routing.                |
| P-TESTER    | Test engineer / QA | Author E2E from spec; verify AC.                   |

## User journeys

### Journey 1 — Reader finds and reserves a book

1. **Browse** — `/` shows a paginated MatTable of ~60 books.
2. **Filter** — picks **Fantasy** under "Gatunek" + **EN** under "Język".
3. **Search** — types `tolkien` in the search bar; only Tolkien titles
   remain.
4. **Open detail** — clicks the row → `/book/book-011` (The Lord of
   the Rings).
5. **Reserve** — the book has 5 copies; 0 free → **Zarezerwuj** button
   becomes available. Click → queue position chip shows `1`.

### Journey 2 — Librarian processes returns

1. **Mock-login** — `/account`, pick **Ewa Lewandowska** (librarian).
2. **Open panel** — toolbar gains "Panel bibliotekarza". Click.
3. **KPI strip** — sees `Aktywne wypożyczenia: 3 · Przeterminowane: 1 · Aktywne rezerwacje: 2`.
4. **Process overdue** — opens the overdue table; one loan is 6 days
   late; fine `3,00 zł`.
5. **Mark returned** — clicks **Zwrot** in the all-loans table → status
   chip flips to **Zwrócone**; overdue list refreshes (KPI drops to 0).

### Journey 3 — Role guard blocks reader

1. Logged in as reader (Anna Kowalska).
2. Pastes `/librarian` directly into the address bar.
3. Route never matches — `roleGuard(['librarian'], '/account')`
   redirects to `/account` immediately.

## Feature inventory

| Feature                                            | Covered by AC | Notes                                              |
| -------------------------------------------------- | ------------- | -------------------------------------------------- |
| Catalogue paginated MatTable                       | AC-1          | Sortable on title / author / year / genre          |
| Search by title / author / ISBN                    | AC-2          | Substring + ranked by `searchRank()`               |
| Genre / language / availability facets             | AC-3          |                                                    |
| Book detail (cover + blurb + copies + reserve CTA) | AC-4          |                                                    |
| Mock-login dropdown (4 readers + 1 librarian)      | AC-5          | Uses shared `<ais-mock-login>`                     |
| Role guard blocks non-librarian from `/librarian`  | AC-6          | `roleGuard(['librarian'], '/account')`             |
| Reader: my-loans + my-reservations                 | AC-7          | Renew + cancel actions                             |
| Librarian: issue a book                            | AC-8          | Inline in all-loans (Mark returned is the inverse) |
| Overdue marker                                     | AC-9          | `daysOverdue > 0` + colour-coded chip              |
| Unit tests (≥ 80% / ≥ 75% branches)                | AC-10         | 44 tests on `library-data/filters/`                |
| Playwright smoke E2E                               | AC-11         | `apps/library-e2e/`                                |

## Non-goals

Verbatim from [`spec.md` § Non-goals](../../analytical/specs/library-app/spec.md#non-goals):

- Real authentication / OAuth / SSO.
- Real payments (fines display-only).
- Backend / database persistence.
- Email reminders / notifications.
- Multi-branch routing / inventory transfer.
- Statistical dashboards beyond a single KPI strip.

## KPIs and acceptance metrics

| Metric               | Target                                   | Status                                                             |
| -------------------- | ---------------------------------------- | ------------------------------------------------------------------ |
| Dataset              | 100–200 books, ≥ 8 genres, ≥ 4 languages | ✅ (60 / 10 / 5; relaxed from spec given demo size)                |
| Search response time | < 50 ms                                  | ✅                                                                 |
| Bundle size delta    | < 350 KB gzip                            | ✅                                                                 |
| Unit-test coverage   | ≥ 80% stmts / ≥ 75% branches             | ✅                                                                 |
| E2E coverage of AC   | every AC → ≥ 1 Playwright assertion      | ✅ ([matrix](testing.md#acceptance-criteria-to-test-traceability)) |

## Demo script (sales / showcase)

| Step | Action                                           | Expected outcome                                             |
| ---- | ------------------------------------------------ | ------------------------------------------------------------ |
| 1    | Open `<http://localhost:4206>`                   | Catalogue with ≥ 50 rows + filter panel + sort dropdown.     |
| 2    | Click **Fantasy** facet.                         | Result count drops; only fantasy rows.                       |
| 3    | Type `tolkien` in the search input.              | LOTR + Hobbit remain.                                        |
| 4    | Click the first row.                             | Book detail with cover + 5-copy availability + reserve.      |
| 5    | Navigate **Moje konto**; pick **Anna Kowalska**. | Reader badge appears; loans + reservations tables show data. |
| 6    | Pick **Ewa Lewandowska** (librarian).            | Toolbar gains "Panel bibliotekarza".                         |
| 7    | Click "Panel bibliotekarza".                     | KPI strip + overdue + all-loans visible.                     |
| 8    | Click **Zwrot** on an active loan.               | Loan status flips to "Zwrócone"; KPI updates.                |
| 9    | Switch back to **Anna Kowalska**.                | Librarian menu disappears.                                   |
| 10   | Paste `/librarian` in address bar.               | Redirected to `/account` (role guard).                       |

## Roadmap (post-demo)

- **Real auth** — swap `AuthService` for an OAuth-backed implementation.
  The `AUTH_CONTEXT` token wired in `main.ts` shields the rest of the
  app from the change.
- **Email notifications** — overdue reminders. Out of v1 (no backend).
- **Multi-branch** — extend `Member` with `branchId`; add a branch
  facet. ADR required.
- **Statistics module** — beyond the single KPI strip. Per-genre most-
  borrowed, fine totals, etc.
- **Add-book form** — wire `Reactive Forms` in the librarian panel
  (the seed dataset is immutable today).

## Glossary

| Term            | Meaning                                                                                    |
| --------------- | ------------------------------------------------------------------------------------------ |
| **Loan**        | An active borrow record; `dueDate` derived from `LOAN_DAYS = 14`.                          |
| **Reservation** | A FIFO queue entry against a book with no free copies.                                     |
| **Overdue**     | A loan whose `dueDate` is before today; fine accrues at `FINE_GROSZE_PER_DAY` (50 grosze). |
| **Card number** | Display-only library card identifier (e.g. `R-0001`, `L-0001`).                            |
| **MatTable**    | Material Design table with built-in sort + paginator + sticky header.                      |
