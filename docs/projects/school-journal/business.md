---
id: docs.school-journal.business
title: School-journal — business documentation
type: business
status: living
date: 2026-05-18
audience: [product, analyst, sales, stakeholder]
links:
  spec: ../../analytical/specs/school-journal/spec.md
  hub: README.md
---

# School-journal — business documentation

> The "what and why" view for the virtual class register demo. Tech:
> [`technical.md`](technical.md). Canonical AC: [`spec.md`](../../analytical/specs/school-journal/spec.md).

## Value proposition

A reference implementation of a Polish-style virtual class register
(`wirtualny dziennik`). Demonstrates that AI-assisted Angular delivery
handles:

- **Multi-role + multi-context UIs over the same dataset** — student,
  parent, teacher, admin × term × class. Each role sees its own slice
  of the same `Grade` / `AttendanceMark` / `TimetableSlot` entities.
- **Bespoke grid layout** — the 5-day × 8-period timetable proves the
  pattern for any week/calendar UI without Material's calendar widget.
- **Weighted aggregates** — per-subject weighted average grades
  (`Σ(value·weight) / Σ(weight)`); a model for any GPA / KPI rollup.
- **Singleton context service** ([ADR-0008](../../adr/0008-journal-context.md))
  — `SessionService` exposes role + term + class as signals; every
  page builds its view via `computed()` chains.

Reusable for: any role-based workflow where the same data has
different shapes per persona (HR systems, CRM, ticketing).

## Personas

Verbatim from [`spec.md` § Personas](../../analytical/specs/school-journal/spec.md#personas-affected):

| ID        | Role             | Primary need                                      |
| --------- | ---------------- | ------------------------------------------------- |
| P-STUDENT | Pupil            | See timetable, grades, attendance, announcements. |
| P-PARENT  | Parent           | Same view as student but for their child.         |
| P-TEACHER | Teacher          | Issue grades, mark attendance, set lesson topics. |
| P-ADMIN   | School secretary | Manage roster + class assignment + terms.         |

## User journeys

### Journey 1 — Student checks the week

1. **Dashboard** — `/`, picks **Anna Kowalska (uczeń · 5A)**.
2. **Plan lekcji** — 5-day × 8-period grid for class 5A; cell shows
   subject label + room.
3. **Oceny** — table grouped by subject; columns: oceny chips +
   weighted average.
4. **Frekwencja** — KPI tiles for present / absent / late / excused +
   chronological list of recent marks.
5. **Term switch** — top-of-dashboard chip group; switch T2 → T3; all
   subsequent views re-render via signals.

### Journey 2 — Teacher issues a grade

1. **Dashboard** — picks **Ewa Lewandowska (nauczyciel)**.
2. **Toolbar** — gains "Wystaw ocenę" via `*aisRoleAllow="['teacher', 'admin']"`.
3. **Editor** — drop-downs for student + subject + value (1–6) + weight
   (0.5–3.0).
4. **Save** — `GradesService.add()` appends to the signal store; new
   grade id displayed.
5. **Student verifies** — re-pick **Anna**; **Oceny** shows the new
   chip without reload.

### Journey 3 — Parent monitors their child

1. **Dashboard** — picks **Maria Kowalska (rodzic)**; her `childId`
   maps to student-5a-01 (Anna).
2. **Oceny** / **Frekwencja** — show data for Anna (read-only).
3. **Plan lekcji** — class 5A's timetable.

### Journey 4 — Role guard blocks student from teacher route

1. Student profile active.
2. Pastes `/teacher/grades` in URL bar.
3. `roleGuard(['teacher', 'admin'])` redirects to `/`.

## Feature inventory

| Feature                                   | Covered by AC | Notes                                                           |
| ----------------------------------------- | ------------- | --------------------------------------------------------------- |
| Mock-login (4 profiles, 1 per role)       | AC-1          | Uses shared `<ais-mock-login>`                                  |
| 5-day × 8-period timetable grid (bespoke) | AC-2          | Per active class section                                        |
| Grades by subject with weighted average   | AC-3          | `Σ(value·weight) / Σ(weight)`                                   |
| Term switcher (T1 / T2 / T3)              | AC-4          | Drives grade filter; signal-driven                              |
| Teacher grade editor                      | AC-5          | Reactive Forms; clamps value to 1..6                            |
| Teacher roll-call (mark attendance)       | AC-6          | (spec scope; minimal UI in v1 — KPI shows counts)               |
| Admin term editor                         | AC-7          | Out of v1 minimum; deferred (see [Roadmap](#roadmap-post-demo)) |
| Role-guarded teacher route                | AC-8          | `roleGuard(['teacher', 'admin'])`                               |
| Unit tests (≥ 80% / ≥ 75% branches)       | AC-9          | 30 tests on `journal-data/filters/`                             |
| Playwright smoke E2E                      | AC-10         | Login → grades + role-gate redirect                             |

## Non-goals

Verbatim from [`spec.md` § Non-goals](../../analytical/specs/school-journal/spec.md#non-goals):

- Real authentication / OAuth / SAML.
- Real-time push (no SSE / WebSocket).
- Email + SMS notifications.
- Cross-school messaging.
- Bell-schedule editor.
- PDF certificate export.

## KPIs and acceptance metrics

| Metric             | Target                                                          | Status                                                             |
| ------------------ | --------------------------------------------------------------- | ------------------------------------------------------------------ |
| Seed dataset       | 2 classes × ~20 students, 12 subjects, ~30 grades, ~10 teachers | ✅                                                                 |
| Timetable render   | < 16 ms                                                         | ✅                                                                 |
| Unit-test coverage | ≥ 80% stmts / ≥ 75% branches                                    | ✅                                                                 |
| E2E coverage of AC | every AC → ≥ 1 Playwright assertion                             | ✅ ([matrix](testing.md#acceptance-criteria-to-test-traceability)) |

## Demo script (sales / showcase)

| Step | Action                                                                       | Expected outcome                                           |
| ---- | ---------------------------------------------------------------------------- | ---------------------------------------------------------- |
| 1    | Open `<http://localhost:4207>`                                               | Dashboard with login dropdown + term switcher.             |
| 2    | Pick **Anna Kowalska (uczeń · 5A)**.                                         | Reader-style nav cards appear.                             |
| 3    | Open **Plan lekcji**.                                                        | 5×8 grid with subject + room cells.                        |
| 4    | Open **Oceny**.                                                              | Subjects grouped; each row shows chips + weighted average. |
| 5    | Switch term T3 → T2.                                                         | Grades table re-renders (empty in seed for T2).            |
| 6    | Switch profile to **Ewa Lewandowska (nauczyciel)**.                          | Toolbar gains "Wystaw ocenę".                              |
| 7    | Open "Wystaw ocenę" → fill student, subject, value=5, weight=2 → **Zapisz**. | Confirmation chip with new grade id.                       |
| 8    | Switch profile back to **Anna**.                                             | Toolbar loses teacher menu.                                |
| 9    | Open **Oceny**.                                                              | New `5` chip visible in the right subject row.             |
| 10   | Paste `/teacher/grades` in the URL bar.                                      | Redirected to `/` (role guard).                            |

## Roadmap (post-demo)

- **Teacher roll-call UI** — promote AC-6 to a dedicated component
  (`<ais-class-roll-call>`); chip-driven status per student per lesson.
- **Admin module** — roster + class assignment + term editor (AC-7
  deferred from v1).
- **Real auth** — swap `SessionService` for an OAuth-backed signal
  source; `AUTH_CONTEXT` wiring is unchanged.
- **Announcements** — teacher-to-class messages; spec mentions but v1
  scope explicitly omits.
- **Attendance calendar** — bespoke month grid in addition to the
  KPI strip.
- **Multi-language** — extract PL strings to `@ai-studio/shared-language`.
- **WCAG audit** — beyond Material defaults.

## Glossary

| Term                 | Meaning                                                                        |
| -------------------- | ------------------------------------------------------------------------------ |
| **Trymestr**         | Polish school term; this demo uses T1 (Sep–Nov) / T2 (Dec–Feb) / T3 (Mar–Jun). |
| **Class section**    | A specific class (e.g. `5A`, `5B`).                                            |
| **Weighted average** | Per-subject average where weights ∈ [0.5, 3.0]. Empty subject → `null`.        |
| **Grade value**      | 1 (lowest) – 6 (highest); standard Polish primary-school scale.                |
| **Period**           | One lesson slot in the day (1..8).                                             |
| **Mock-login**       | Demo-only profile picker; no real authentication.                              |
