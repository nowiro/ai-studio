---
id: plan.school-journal-next
title: school-journal — parent persona + email-notification stub
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
  spec: docs/analytical/specs/school-journal/spec.md
  adr: docs/adr/0008-journal-context.md
  hub: ../../projects/school-journal/README.md
  bpmn: ../../bpmn/school-journal-grading.bpmn
---

# Plan: school-journal — parent persona + email-notification stub

## Goal

Add a third persona (parent) with read-only access to their child's grades / attendance / timetable, and a notification stub that records emails-that-would-be-sent (no real SMTP) so the demo shows the full parent-engagement loop.

## Context

After audit `school-journal` runs at :4207 with role-based contexts (teacher, student) and `libs/journal-feature-{grades,attendance,timetable,shell}`. Status `done`.

## Scope

| In                                                        | Out                                               |
| --------------------------------------------------------- | ------------------------------------------------- |
| Parent persona in mock auth (1-to-many parent → children) | Real auth integration (Keycloak plan covers this) |
| Parent dashboard: grades, attendance, upcoming events     | Two-way messaging                                 |
| `NotificationStubStore` recording emails per parent       | Real SMTP / queue                                 |
| Grade-threshold rule (notify when grade drops below 3)    | Configurable rules engine                         |

## Tasks (DAG)

| id   | title                                                       | agent              | outputs                                        | done_when                             |
| ---- | ----------------------------------------------------------- | ------------------ | ---------------------------------------------- | ------------------------------------- |
| T001 | Mock auth: add `Parent` persona + `parentOf` relation       | frontend-developer | libs/shared-app-shell/src/lib/auth.service.ts  | role signal returns 'parent'          |
| T002 | `libs/journal-feature-parent` (new lib)                     | frontend-developer | libs/journal-feature-parent/src/\*\*           | feature exported, tagged scope:parent |
| T003 | Route guard `roleGuard(['parent'], '/account')`             | frontend-developer | libs/journal-feature-shell/.../routes.ts       | guard test passes                     |
| T004 | `NotificationStubStore` (signal-based queue)                | frontend-developer | libs/journal-data/src/lib/notifications.ts     | round-trip in unit test               |
| T005 | Grade-threshold rule (drop < 3) → enqueue notification      | frontend-developer | libs/journal-feature-grades/.../grade-rules.ts | rule covers 4 edge cases              |
| T006 | Update BPMN with parent notification fan-out                | doc-writer         | docs/bpmn/school-journal-grading.bpmn          | `pnpm bpmn:lint` clean                |
| T007 | E2E: parent logs in, sees child grades, drops grade, queued | test-engineer      | apps/school-journal-e2e/src/parent.spec.ts     | green                                 |
| T008 | Update docs                                                 | doc-writer         | docs/projects/school-journal/\*.md             | doc-audit clean                       |

## Validation gate

```bash
pnpm affected:lint && pnpm typecheck && pnpm affected:test --coverage && pnpm affected:e2e && pnpm affected:build
```

## Risks & mitigations

- **Risk:** Three personas multiply route guards — Mitigation: keep a single `roleGuard(allowed[], fallback)` (already exists for library); reused across journal.
- **Risk:** Threshold rule conflates "informational" and "critical" — Mitigation: rule output includes `severity: 'info'|'warning'` field; UI shows colour-coded chip.

## Rollback

`libs/journal-feature-parent` and parent persona are additive. Without them, teacher + student flows unchanged.
