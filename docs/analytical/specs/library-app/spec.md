---
id: spec.library-app
title: Library — small-library catalogue + lending + reservations demo
type: spec
phase: 1-specify
status: accepted
date: 2026-05-18
author: analyst
links:
  plan: null
  adr: ../../../adr/0007-library-roles.md
---

# Library — specification

> Phase 1 (Specify) artefact. Tech choices live in the linked plan + ADR.

## Problem statement

After the tire-shop demo proves the facet/cart pattern, the repo still
lacks a worked example of **role-based UIs** — same data, two very
different views. Libraries are the smallest interesting model: a single
collection of books with two personas (reader, librarian) that need
distinct screens and protected actions.

This spec drives an Angular 21 demo of a small-library system: browse,
reserve, borrow, and (as a librarian) issue / return / overdue-track —
all frontend-only with a ~200-book seed dataset.

## Personas affected

| Persona id  | Role               | Why they care                                              |
| ----------- | ------------------ | ---------------------------------------------------------- |
| P-READER    | Library patron     | Wants to find a book, reserve a copy, and track loans.     |
| P-LIBRARIAN | Library staff      | Issues / returns books; sees overdue list; adds new books. |
| P-DEV       | Frontend developer | Needs the reference for role-guarded routing.              |
| P-TESTER    | Test engineer / QA | Authors E2E from this spec.                                |

## User stories

### US-1 — Find a book

> **As** P-READER **I want** to search the catalogue by title / author /
> ISBN and filter by genre, language and availability **so that** I can
> find what I want to borrow.

### US-2 — Reserve a copy

> **As** P-READER **I want** to reserve a copy of an unavailable book
> **so that** I get the next copy that comes in.

### US-3 — See my loans

> **As** P-READER **I want** to see my active loans with due dates and
> overdue flags **so that** I can return on time.

### US-4 — Issue a book (librarian)

> **As** P-LIBRARIAN **I want** to mark a book as issued to a member
> **so that** the system tracks who has it.

### US-5 — See the overdue list

> **As** P-LIBRARIAN **I want** to see all overdue loans with member
> contact info **so that** I can chase them up.

## Acceptance criteria

### AC-1 — Catalogue lists ≥ 100 books

- **Given** the user navigates to `/`
- **When** the page loads
- **Then** at least 100 book rows are visible across paginated MatTable pages

### AC-2 — Search by title / author / ISBN

- **Given** the catalogue is loaded
- **When** the user types a substring of any book's title or author
- **Then** only matching books remain visible

### AC-3 — Facet filters (genre, language, availability)

- **Given** the catalogue is loaded
- **When** the user selects a genre filter
- **Then** only books of that genre remain visible
- **And** the result count chip updates

### AC-4 — Book detail page

- **Given** a row is clicked
- **When** the detail page loads
- **Then** cover, blurb, copies (free / on-loan / reserved) and a reserve CTA are visible
- **And** the reserve CTA is disabled if a copy is already free (then "borrow" surfaces)

### AC-5 — Mock-login switches role

- **Given** the user opens the login dropdown
- **When** they pick "librarian-1"
- **Then** the librarian menu items appear
- **And** the route `/librarian` becomes accessible

### AC-6 — Role guard blocks non-librarian

- **Given** the user is signed in as a reader
- **When** they navigate to `/librarian`
- **Then** they are redirected to `/account` and a snackbar warns about the forbidden route

### AC-7 — My loans and reservations

- **Given** the user is signed in as a reader who has 1 active loan and 1 reservation
- **When** they open `/account`
- **Then** both lists are visible with correct due dates / queue positions

### AC-8 — Issue a book

- **Given** the librarian is on `/librarian`
- **When** they pick a book + member and click "Issue"
- **Then** the book moves from "free" to "on-loan" with the member's name
- **And** the reader's `/account` page shows the new loan after they re-login

### AC-9 — Overdue marker

- **Given** a loan's `dueDate` is in the past
- **When** the librarian opens the overdue list
- **Then** that loan is visible
- **And** an `overdue` badge is shown on the reader's `/account`

### AC-10 — Tests gate the build

- **Given** the developer runs `pnpm nx test library-data --coverage`
- **Then** statement / line / function coverage is ≥ 80 %
- **And** branch coverage is ≥ 75 %

### AC-11 — Playwright happy path

- **Given** the developer runs `pnpm nx e2e library-e2e`
- **Then** the smoke test ("browse → reserve → librarian-toggle → issue") passes

## Success metrics

| Metric                  | Target                                                                 |
| ----------------------- | ---------------------------------------------------------------------- |
| Catalogue dataset size  | 100–200 books across ≥ 8 genres, ≥ 4 languages                         |
| Search response time    | < 50 ms on a mid-range laptop                                          |
| Bundle size delta       | < 350 KB gzip added by `apps/library` + `libs/library-*` over baseline |
| Unit-test coverage      | ≥ 80 % statements / ≥ 75 % branches on `libs/library-data`             |
| E2E acceptance coverage | AC-1 … AC-11 each map to at least one Playwright assertion             |

## Non-goals

- Real authentication / OAuth / SSO.
- Real payments (fines are display-only).
- Backend / database persistence (in-memory + seed only).
- Email reminders / notifications.
- Multi-branch routing / inventory transfer.
- Statistical dashboards beyond a single read-only KPI.

## Open questions

(All resolved during /clarify; left here as audit trail.)

- ✅ Real authentication? — **No.** Mock-login dropdown.
- ✅ State management? — **Pure signals + services** (see ADR-0007).
- ✅ Currency for fines? — **Display only, PLN format.**
- ✅ Loan policy? — **14-day default, 1 renewal, 0.50 zł/day overdue.**

## Traceability

- **ADR (roles):** [`../../../adr/0007-library-roles.md`](../../../adr/0007-library-roles.md)
