---
id: plan.school-journal
title: Build virtual school journal demo (grades, attendance, timetable, parent view)
type: plan
date: 2026-05-18
trigger: user request — "oraz wirtualny dziennik dla szkol"
status: done
owner: orchestrator
agents:
  - analyst
  - architect
  - frontend-developer
  - test-engineer
links:
  spec: docs/analytical/specs/school-journal/spec.md
  adr: null
  issue: null
---

# Plan: Virtual school journal

## Goal

Mock-Librus / Vulcan-style virtual class register for primary/secondary
schools: timetable, grades, attendance, lesson topics, messages, by role
(student / parent / teacher / admin). Demonstrates **complex routing
with deeply role-aware views**, **cross-cutting data filters by
class/term/subject**, and **a calendar-style timetable grid** (no
Material `mat-calendar` — bespoke grid component).

## Scope

| In                                                                                                        | Out                                                  |
| --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| Roles: student, parent, teacher, admin (school-secretary)                                                 | Real auth / OAuth / SAML                             |
| Mock-login screen: pick a profile from a dropdown                                                         | Backend / database                                   |
| Student/parent view: weekly timetable, grades table per subject, attendance, lesson topics, announcements | Direct messaging across schools                      |
| Teacher view: add/edit grades, mark attendance, edit lesson topics, send announcement to class            | Bell-schedule editor                                 |
| Admin view: roster (students, parents, teachers), assign classes, edit terms                              | Real-time push (no SSE / WebSocket — manual refresh) |
| Term-aware filtering (Trimester 1 / 2 / 3) across grades and attendance                                   | Statistics module beyond per-subject averages        |
| Localised Polish copy + EN secondary via shared toggle                                                    | PDF certificate export                               |
| Vitest tests on grade-average calculator, attendance-status pure fns, timetable layout pure fn            |                                                      |
| Playwright smoke E2E (login → see grades → teacher logs in → adds a grade → student sees it)              |                                                      |

## Inputs

- `apps/personal-data-wizard/**` — Reactive Forms + Material stepper
- `apps/union-vault/**` — multi-page app conventions, country/language picker
- `libs/shared-language/**` — i18n toggle
- `.ai/rules/{angular,nx,styling,testing}.md`
- Reference: <https://portal.librus.pl/rodzina> (Polish reference UX — login screens only)
- Reference: <https://www.vulcan.edu.pl/produkty/dziennik> (alternative model)

## Architecture

```
apps/school-journal                    (scope:app, type:app)          port 4207
apps/school-journal-e2e                (scope:app, type:e2e)

libs/journal-feature-shell             (scope:school-journal, type:feature)
  ├ shell.component.ts                 (mat-sidenav: role-aware menu)
  ├ login-mock.component.ts            (profile dropdown — student/parent/teacher/admin)
  └ term-switcher.component.ts         (Trimester 1/2/3 chips)

libs/journal-feature-timetable         (scope:school-journal, type:feature)
  └ timetable-grid.component.ts        (bespoke 5-day × 8-period grid, signals-driven)

libs/journal-feature-grades            (scope:school-journal, type:feature)
  ├ grades-by-subject.component.ts     (student/parent: read-only MatTable)
  ├ grade-editor.component.ts          (teacher: inline edit MatTable)
  └ subject-average.component.ts       (weighted; pure-fn under the hood)

libs/journal-feature-attendance        (scope:school-journal, type:feature)
  ├ attendance-calendar.component.ts   (month grid with per-day chips)
  └ class-roll-call.component.ts       (teacher: present/absent/late/excused toggles)

libs/journal-feature-admin             (scope:school-journal, type:feature)
  ├ roster.component.ts                (MatTable: students/parents/teachers)
  ├ class-assignment.component.ts      (drag-drop or dropdown)
  └ term-editor.component.ts           (term-start/term-end form)

libs/journal-data                      (scope:school-journal, type:data-access)
  ├ models/                            (Student, Parent, Teacher, ClassSection,
  │                                     Subject, Grade, AttendanceMark, Term,
  │                                     TimetableSlot, Announcement, Role)
  ├ grades.service.ts                  (per-subject grades; weighted-average.ts)
  ├ attendance.service.ts              (mark / get-month / overdue-excuse)
  ├ timetable.service.ts               (per-class layout; conflict-detection.ts)
  ├ roster.service.ts                  (students/parents/teachers/classes)
  └ auth.service.ts                    (current profile signal; role + class context)

libs/journal-data-seed                 (scope:school-journal, type:util)
  └ seed.ts                            (1 school year, 2 classes, 12 subjects,
                                       ~20 students, ~30 parents, ~10 teachers)

libs/journal-ui                        (scope:school-journal, type:ui)
  ├ grade-chip.component.ts            (1–6 with colour scale)
  ├ attendance-chip.component.ts       (present/absent/late/excused)
  ├ role-badge.component.ts            (small uppercase tag)
  ├ role-guard.directive.ts            (structural *aisRoleAllow=['teacher','admin'])
  └ class-context.directive.ts         (provides class-section to descendants)

eslint.config.mjs depConstraints — `scope:school-journal` libs may only
depend on `scope:shared`, other `scope:school-journal` libs, and
`scope:util`.
```

## Cross-cutting invariants (tested)

- Grade `value` in {1, 2, 3, 4, 5, 6}; `weight` ∈ [0.5, 3.0].
- Weighted average = `Σ(value·weight) / Σ(weight)`; empty subject = `null`.
- Attendance mark per `(student, lesson)` is one of: present | absent | late | excused.
- Timetable: no two slots overlap per `(class, day, period)`.
- Term ranges are non-overlapping; current term derived from "today" relative to ranges.
- Teachers can edit grades only for their `subject + classSection` pairs.
- Parents see only their child's data.

## Tasks (DAG)

| id   | title                                                                                            | agent              | inputs           | outputs                                      | done_when                                  | parallel_with | blocked_by |
| ---- | ------------------------------------------------------------------------------------------------ | ------------------ | ---------------- | -------------------------------------------- | ------------------------------------------ | ------------- | ---------- |
| T001 | Spec (entity model, role matrix, invariants, AC table)                                           | analyst            | reference UX     | docs/analytical/specs/school-journal/spec.md | No `[?]` markers; AC complete              |               |            |
| T002 | ADR: how to wire role+class context across deep routes (signals vs. providers)                   | architect          | T001             | docs/adr/NNNN-journal-context.md             | ADR Status: accepted                       |               | T001       |
| T003 | Scaffold 8 libs (data, data-seed, ui, 5 feature libs)                                            | frontend-developer | T002             | libs/journal-\*/\*\*                         | `pnpm nx lint <each>` clean                |               | T002       |
| T004 | Seed (1 year, 2 classes, 12 subjects, ~20 students, ~10 teachers)                                | frontend-developer | T003             | libs/journal-data-seed/src/seed.ts           | Loadable, type-checked                     | T005          | T003       |
| T005 | Pure logic: weighted-average, conflict-detection, term-from-date, search/sort                    | frontend-developer | T003             | libs/journal-data/src/\*\*                   | ≥80 % branch coverage                      | T004          | T003       |
| T006 | Build shell + login-mock + term-switcher                                                         | frontend-developer | T005             | libs/journal-feature-shell/\*\*              | Role-aware menu renders                    | T007          | T005       |
| T007 | Build timetable-grid (bespoke 5x8 grid)                                                          | frontend-developer | T005             | libs/journal-feature-timetable/\*\*          | Renders one class week                     | T008          | T005       |
| T008 | Build grades feature (read + teacher editor + subject-average)                                   | frontend-developer | T005             | libs/journal-feature-grades/\*\*             | Inline edit persists to signal store       | T009          | T005       |
| T009 | Build attendance feature (calendar + roll-call)                                                  | frontend-developer | T005             | libs/journal-feature-attendance/\*\*         | Mark all students in <3 clicks per row     | T010          | T005       |
| T010 | Build admin feature (roster + class assignment + term editor)                                    | frontend-developer | T005             | libs/journal-feature-admin/\*\*              | All MatTables sort + paginate              |               | T005       |
| T011 | Route guards + class-context directive                                                           | frontend-developer | T002, T006..T010 | libs/journal-ui/, apps/school-journal/       | Non-teacher cannot reach /grades/edit      |               | T006..T010 |
| T012 | Generate `apps/school-journal` + `apps/school-journal-e2e` (port 4207)                           | frontend-developer | T011             | apps/school-journal/\*\*                     | `pnpm nx serve school-journal` boots :4207 |               | T011       |
| T013 | Wire ESLint depConstraints; `start:school-journal` + extend `start:all`                          | frontend-developer | T012             | eslint.config.mjs, package.json              | `pnpm nx lint` clean                       |               | T012       |
| T014 | Vitest tests: services, pure fns, guards                                                         | test-engineer      | T003..T012       | libs/journal-_/\*\*/_.spec.ts                | Coverage ≥ thresholds                      | T015          | T012       |
| T015 | Playwright E2E: student-login → see grades → teacher-login → add grade → student-login → confirm | test-engineer      | T012             | apps/school-journal-e2e/src/\*\*.spec.ts     | E2E green                                  | T014          | T012       |
| T016 | Code review (esp. role-guard + class-context)                                                    | code-reviewer      | T014 + T015 diff | review verdict                               | verdict: approved                          |               | T014, T015 |
| T017 | Update CHANGELOG + README + this plan (status: done)                                             | doc-writer         | accepted PR      | CHANGELOG.md, this file                      | doc-audit clean                            |               | T016       |

## Definition of Done

- All tasks ✅
- `pnpm nx run-many -t lint test build --parallel=3` green
- Spec + ADR linked and approved
- This plan's `status: done`
