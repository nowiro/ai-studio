---
id: spec.school-journal
title: Virtual school journal — Librus/Vulcan-style demo
type: spec
phase: 1-specify
status: accepted
date: 2026-05-18
author: analyst
links:
  plan: null
  adr: ../../../adr/0008-journal-context.md
---

# Virtual school journal — specification

## Problem statement

The repo lacks an example with **deeply role-aware, multi-context UI**.
A Polish school's "wirtualny dziennik" (Librus / Vulcan style) is a
natural reference: same dataset, four roles (student / parent / teacher
/ admin), three orthogonal contexts (term, class section, subject) and
two distinct UI shapes (grid for the timetable, table for grades).

This spec drives an Angular 21 frontend-only demo that exercises:

- a bespoke 5-day × 8-period timetable grid,
- per-subject weighted-average grade aggregation,
- an attendance calendar with present / absent / late / excused chips,
- a mock-login dropdown that swaps role + child / class context.

## Personas affected

| Persona id       | Role             | Why they care                                              |
| ---------------- | ---------------- | ---------------------------------------------------------- |
| P-STUDENT        | Pupil            | Wants to see timetable, grades, attendance, announcements. |
| P-PARENT         | Parent           | Same view as student but for their child.                  |
| P-TEACHER        | Teacher          | Issues grades, marks attendance, sets lesson topics.       |
| P-ADMIN          | School secretary | Manages roster + class assignment + terms.                 |
| P-DEV / P-TESTER | Engineering      | Reference + smoke E2E.                                     |

## User stories

### US-1 — See my week

> **As** P-STUDENT **I want** a weekly timetable grid **so that** I know
> which lessons happen when and where.

### US-2 — See grades by subject

> **As** P-STUDENT / P-PARENT **I want** grades grouped by subject with
> weighted averages **so that** I know where I stand.

### US-3 — Mark attendance

> **As** P-TEACHER **I want** a roll-call view of my class
> for the current lesson **so that** I can mark present / absent / late
> / excused per student in seconds.

### US-4 — Issue a grade

> **As** P-TEACHER **I want** to add a grade for a given student, subject
> and weight **so that** the aggregated average reflects it immediately.

### US-5 — Switch term

> **As** any persona **I want** to switch between Term 1 / 2 / 3
> **so that** I see the right data slice.

## Acceptance criteria

### AC-1 — Mock-login switches role and context

- **Given** the user opens the dropdown
- **When** they pick a profile labeled "Anna (uczeń · 5A)"
- **Then** the menu shows reader-style entries (timetable, grades, attendance)
- **And** the header shows the chosen role badge

### AC-2 — Timetable renders 5 × 8 grid

- **Given** a student profile is active
- **When** they open the `/timetable` route
- **Then** a 5-column × 8-period grid renders with the selected term's lessons

### AC-3 — Grades grouped by subject with weighted average

- **Given** the student has ≥ 1 grade in the current term
- **When** they open `/grades`
- **Then** rows are grouped by subject
- **And** each row shows the weighted average computed by `Σ(value·weight) / Σ(weight)`
- **And** subjects with no grades show "—"

### AC-4 — Term switcher filters data

- **Given** the user picks "Trimester 2" in the term chip
- **When** the grades view re-renders
- **Then** only grades from that term are visible

### AC-5 — Teacher can add a grade

- **Given** a teacher profile is active
- **When** they pick a student, subject, value and weight
- **Then** the new grade is persisted in the signal store
- **And** the student's `/grades` view shows it after switching back

### AC-6 — Teacher roll-call

- **Given** a teacher profile is active and a lesson is selected
- **When** they tap chips to set each student's attendance state
- **Then** the values persist and the calendar reflects them

### AC-7 — Admin can edit term ranges

- **Given** an admin profile is active
- **When** they open `/admin/terms` and change a term's `endDate`
- **Then** the term-from-today derivation updates

### AC-8 — Role-guarded routes

- **Given** the active profile is a student
- **When** they navigate to `/teacher/grades`
- **Then** they are redirected to the dashboard

### AC-9 — Tests gate the build

- **Given** the developer runs `pnpm nx test journal-data --coverage`
- **Then** statement / line / function coverage is ≥ 80 %
- **And** branch coverage is ≥ 75 %

### AC-10 — Playwright smoke test

- **Given** the developer runs `pnpm nx e2e school-journal-e2e`
- **Then** the smoke flow (login as student → see grades → login as teacher
  → add grade → switch to student → confirm) passes

## Success metrics

| Metric                  | Target                                                                   |
| ----------------------- | ------------------------------------------------------------------------ |
| Seed dataset            | 2 classes × ~20 students, 12 subjects, ~30 baseline grades, ~10 teachers |
| Render performance      | Timetable grid renders < 16 ms on a mid-range laptop                     |
| Unit-test coverage      | ≥ 80 % stmts / ≥ 75 % branches on `libs/journal-data`                    |
| E2E acceptance coverage | AC-1 … AC-10 each map to ≥ 1 Playwright assertion                        |

## Non-goals

- Real authentication / OAuth / SAML.
- Real-time push (no SSE / WebSocket).
- Email + SMS notifications.
- Cross-school messaging.
- Bell-schedule editor.
- PDF certificate export.

## Open questions

(All resolved during /clarify; left here as audit trail.)

- ✅ Auth? — **Mock-login dropdown**.
- ✅ State? — **Pure signals + services** (see ADR-0008).
- ✅ Grading scale? — **1–6** Polish school standard, integer values.
- ✅ Term model? — **Three trimesters** with fixed start / end dates.
- ✅ i18n? — **Polish only** for v1 (English code).

## Traceability

- **ADR (role + class context):** [`../../../adr/0008-journal-context.md`](../../../adr/0008-journal-context.md)
