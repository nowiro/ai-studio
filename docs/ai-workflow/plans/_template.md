---
id: plan.<slug>
title: <Plan title — imperative noun phrase>
type: plan
date: <YYYY-MM-DD>
trigger: <slash command or user request>
status: draft # draft | accepted | in-progress | done | aborted
owner: orchestrator
agents:
  - <list specialists touched, e.g. frontend-developer, test-engineer>
links:
  spec: <docs/analytical/specs/<slug>/spec.md if any, else null>
  adr: <docs/adr/NNNN-<slug>.md if any, else null>
  issue: <#NN if any, else null>
---

# Plan: <title>

> Filled in by the **orchestrator** before delegating. Specialists refuse delegations that don't cite this file.

## Goal

One sentence — what does success look like.

## Scope

| In       | Out      |
| -------- | -------- |
| <bullet> | <bullet> |
| <bullet> | <bullet> |

## Inputs

- `<file/path>:<line>` — why it's relevant
- `<rule path>` — which rule applies
- `<external doc URL>` — if any

## Tasks (DAG)

| id   | title                              | agent              | inputs           | outputs                              | done_when                         | parallel_with | blocked_by |
| ---- | ---------------------------------- | ------------------ | ---------------- | ------------------------------------ | --------------------------------- | ------------- | ---------- |
| T001 | <imperative — "Create FooService"> | analyst            | <files/specs>    | docs/analytical/specs/<slug>/spec.md | spec.md exists, no `[?]` markers  |               |            |
| T002 | <imperative>                       | architect          | T001 output      | docs/adr/NNNN-<slug>.md              | ADR Status: accepted              |               | T001       |
| T003 | <imperative>                       | frontend-developer | T002 output      | libs/feature-foo/...                 | tests pass, lint clean            | T004          | T002       |
| T004 | <imperative>                       | test-engineer      | T003 hand-off    | libs/feature-foo/\*_/_.spec.ts       | coverage ≥ 80 % on touched code   | T003          | T002       |
| T005 | <imperative>                       | code-reviewer      | T003 + T004 diff | review verdict                       | verdict: approved                 |               | T003, T004 |
| T006 | <imperative>                       | doc-writer         | accepted PR      | docs/technical/<topic>.md            | doc-audit clean for touched files |               | T005       |

Tasks form a DAG (no cycles). Keep each task ≤ 1 specialist turn — split if larger.

## Validation gate

```bash
pnpm affected:lint
pnpm typecheck
pnpm affected:test
pnpm affected:e2e
pnpm affected:build
pnpm ai:validate
pnpm docs:audit   # if docs touched
```

All green + Conventional Commit + ADR (if behaviour changed).

## Risks & mitigations

- **Risk:** <one line> — **Mitigation:** <one line>
- **Risk:** … — **Mitigation:** …

## Rollback

- One sentence on how to revert if the plan is aborted mid-execution.

## Run log

Per-task one-liners are appended to `docs/ai-workflow/runs/<date>-<slug>.md` as they execute. The orchestrator updates `status:` above each phase boundary.
