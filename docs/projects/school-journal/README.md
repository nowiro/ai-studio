---
id: docs.school-journal
title: School-journal — documentation hub
type: project
status: done
date: 2026-05-18
links:
  spec: ../../analytical/specs/school-journal/spec.md
  plan: ../../ai-workflow/plans/2026-05-18-school-journal.md
  adr: ../../adr/0008-journal-context.md
  app: ../../../apps/school-journal
  port: 4207
---

# School-journal

> Librus / Vulcan-style virtual class register. Four roles (student /
> parent / teacher / admin), weekly timetable, per-subject weighted
> grades, attendance summary. Frontend-only — no backend, mock-login.

|               |                                                                    |
| ------------- | ------------------------------------------------------------------ |
| **Status**    | ✅ done                                                            |
| **Port**      | `4207`                                                             |
| **Start**     | `pnpm start:school-journal` → <http://localhost:4207>              |
| **Scope tag** | `scope:school-journal`                                             |
| **Stack**     | Angular 21 · Material 3 · Tailwind v4 · signals · bespoke 5×8 grid |

## Audience routing

| You are…                      | Start here                                                                                                                                                                       |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Product / analyst**         | [`business.md`](business.md)                                                                                                                                                     |
| **Frontend / DevOps**         | [`technical.md`](technical.md)                                                                                                                                                   |
| **Test engineer / QA**        | [`testing.md`](testing.md)                                                                                                                                                       |
| **Reviewer (SDD compliance)** | [`spec.md`](../../analytical/specs/school-journal/spec.md) → [`plan.md`](../../ai-workflow/plans/2026-05-18-school-journal.md) → [`ADR-0008`](../../adr/0008-journal-context.md) |

## Quickstart

```bash
pnpm install
pnpm start:school-journal
# → http://localhost:4207

# Validation
pnpm nx run-many -t lint test build --projects=school-journal,journal-data,journal-ui,journal-feature-shell,journal-feature-grades,journal-feature-timetable,journal-feature-attendance

# E2E smoke
pnpm nx e2e school-journal-e2e
```

## Demo in 90 seconds

1. Open `/` — dashboard with mock-login dropdown and term switcher
   (T1 / T2 / T3).
2. In **Profil demo**, pick **Anna Kowalska (uczeń)** — student view.
3. Click **Plan lekcji** → bespoke 5-day × 8-period grid showing class
   5A's week (subject + room per cell).
4. Click **Oceny** → grades grouped by subject with weighted averages.
5. Switch profile to **Ewa Lewandowska (nauczyciel)**. Toolbar gains
   "Wystaw ocenę".
6. Open "Wystaw ocenę" → pick a student + subject + value + weight →
   **Zapisz** → confirmation chip with the new grade id.
7. Switch back to **Anna**, open **Oceny** → new grade is visible
   (signal-driven; no reload needed).

The smoke flow is automated in
[`apps/school-journal-e2e/src/smoke.spec.ts`](../../../apps/school-journal-e2e/src/smoke.spec.ts).

## Project map

```
apps/
  school-journal/                port 4207, role-aware shell + RouterOutlet
  school-journal-e2e/            Playwright smoke

libs/
  journal-data/                  models + filter/sort + 5 services + seed
  journal-ui/                    chips (grade, attendance, role) + tone helpers
  journal-feature-shell/         dashboard + login-mock + term-switcher
  journal-feature-timetable/     bespoke 5×8 grid
  journal-feature-grades/        student grades view + teacher editor
  journal-feature-attendance/    attendance summary
```

`AUTH_CONTEXT` provided in `main.ts` so the shared role-allow + guard
read `SessionService.role()`. See
[`technical.md#role-and-context`](technical.md#role-and-context).

## Health metrics

| Metric                          | Target                                                | Current         |
| ------------------------------- | ----------------------------------------------------- | --------------- |
| Unit-test pass rate             | 100 %                                                 | 30/30           |
| `journal-data` coverage (stmts) | ≥ 80 %                                                | ≥ 95 %          |
| Seed dataset                    | 2 classes / 12 subjects / ~20 students / ~10 teachers | ✅              |
| Bundle size                     | < 1.5 MB                                              | ~450 kB initial |
| Timetable render                | < 16 ms                                               | ✅              |

## SDD artefacts

- [`spec.md`](../../analytical/specs/school-journal/spec.md) — problem,
  personas, AC-1 … AC-10.
- [`plan.md`](../../ai-workflow/plans/2026-05-18-school-journal.md) —
  task DAG + DoD.
- [`ADR-0008`](../../adr/0008-journal-context.md) — singleton
  `SessionService` as source of truth for role + term + class context.

## Related repo-wide docs

- [`docs/projects/README.md`](../README.md) — index + conventions.
- [`docs/programming/testing-strategy.md`](../../programming/testing-strategy.md)
- [`.ai/rules/angular.md`](../../../.ai/rules/angular.md)
