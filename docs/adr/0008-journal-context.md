---
id: adr.0008
title: School-journal — role + class context as injectable signals
status: accepted
date: 2026-05-18
deciders: [architect, frontend-developer]
supersedes: null
superseded-by: null
links:
  plan: ../ai-workflow/plans/2026-05-18-school-journal.md
  spec: ../analytical/specs/school-journal/spec.md
---

# ADR-0008 — School-journal context strategy

## Context

The school-journal demo has three orthogonal cross-cutting selections:
**role** (student / parent / teacher / admin), **term** (1 / 2 / 3) and
**class section** (5A, 5B). All three combine to filter grades,
attendance, timetable rows and admin views.

Two patterns were considered:

1. Plain Angular signals on a `SessionService` (singleton), inject the
   service everywhere.
2. Provider hierarchy: parent route provides `currentClass$`, child
   components inject the right level.

## Decision

**Use the singleton `SessionService` approach.** A single source of
truth is easier to reason about for a frontend-only demo, and Angular
signals make the resulting components `computed()` chains trivial.

`SessionService` exposes:

- `currentMember: Signal<JournalMember | null>` — drives role.
- `currentTerm: Signal<Term>` — driven by the chip group in the shell.
- `currentClassSectionId: Signal<string | null>` — derived from the
  active member (student / parent → child's class; teacher → "all
  taught"; admin → optional global filter).

## Rationale

- **One injection target.** Any component can `inject(SessionService)`
  and read `role()`, `term()`, `classId()` synchronously.
- **`computed()` chains stay readable.** Each feature page builds its
  view with `computed(() => filterFor(this.session.term(), ...))`.
- **Pattern consistency.** Tire-shop / library both use the same
  signal-service shape; refactoring across demos costs less if we keep
  one mental model.

## Consequences

### Positive

- No provider-tree gymnastics in route definitions.
- Effective tests: stub `SessionService` with a constant set of signals.

### Negative

- The service has 3 axes — discipline needed to keep its surface narrow.
  We constrain it to "current member / term / class id" + helpers
  derived from them; nothing else moves in.

## Compliance

- `SessionService.currentMember`, `currentTerm`, `currentClassSectionId`
  are `signal()`s exposed via `.asReadonly()`.
- Route guards inject the service and read `role()` synchronously.
- Feature components inject the service plus the relevant
  `Grades / Attendance / Timetable` service and build views via
  `computed()`.

## Links

- Spec: [`../analytical/specs/school-journal/spec.md`](../analytical/specs/school-journal/spec.md)
- Plan: [`../ai-workflow/plans/2026-05-18-school-journal.md`](../ai-workflow/plans/2026-05-18-school-journal.md)
