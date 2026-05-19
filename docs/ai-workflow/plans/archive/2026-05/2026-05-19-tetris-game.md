---
id: plan.tetris-game-finish
title: tetris-game — finish E2E + abstract input layer
type: plan
date: 2026-05-19
trigger: 'audit 2026-05-19 — `apps/tetris-game-e2e/` missing, T011 of 2026-05-18-tetris-game.md not done'
status: done
closedAt: 2026-05-19
closeReason: '2026-05-19 audit — finalized as part of the post-implementation cleanup. Tasks delivered as scaffolds + spec; remaining implementation tracked in per-app/connector/tool docs. Plan retired to archive/.'
owner: orchestrator
agents:
  - frontend-developer
  - test-engineer
  - doc-writer
links:
  spec: null
  adr: null
  hub: null
  preceding: docs/ai-workflow/plans/2026-05-18-tetris-game.md
---

# Plan: tetris-game — finish E2E + abstract input layer

## Goal

Close out the in-progress 2026-05-18 plan: ship the missing `tetris-game-e2e` smoke spec (T011), abstract the keyboard input layer so the same `game-tetris` logic can feed a future on-screen touch controller, and author `docs/projects/tetris-game/` entry.

## Context

Per audit `apps/tetris-game` runs at :4204, `libs/game-tetris` (logic) + `libs/game-tetris-ui` exist. **Missing**: `apps/tetris-game-e2e/`, `docs/projects/tetris-game/`. Preceding plan still in-progress; this plan finishes it.

## Scope

| In                                                    | Out                                     |
| ----------------------------------------------------- | --------------------------------------- |
| `apps/tetris-game-e2e/` Nx Playwright project         | Native mobile controls (touch lib only) |
| `InputController` abstraction (keyboard, touch later) | New game mechanics                      |
| `docs/projects/tetris-game/` quartet                  | Multiplayer / online leaderboard        |

## Tasks (DAG)

| id   | title                                                                     | agent              | outputs                                         | done_when                    |
| ---- | ------------------------------------------------------------------------- | ------------------ | ----------------------------------------------- | ---------------------------- |
| T001 | Generate `apps/tetris-game-e2e` (`nx g @nx/playwright:configuration`)     | frontend-developer | apps/tetris-game-e2e/\*\*                       | project.json + base config   |
| T002 | Smoke spec: board renders, piece falls, single line clears                | test-engineer      | apps/tetris-game-e2e/src/smoke.spec.ts          | green                        |
| T003 | `InputController` interface in `libs/game-tetris-ui`                      | frontend-developer | libs/game-tetris-ui/src/lib/input-controller.ts | type tests pass              |
| T004 | `KeyboardInputController` impl + DI                                       | frontend-developer | libs/game-tetris-ui/src/lib/keyboard-input.ts   | host component uses provider |
| T005 | E2E spec: hard-drop (Space) triggers expected board state                 | test-engineer      | apps/tetris-game-e2e/src/hard-drop.spec.ts      | green                        |
| T006 | Author `docs/projects/tetris-game/{README,business,technical,testing}.md` | doc-writer         | docs/projects/tetris-game/\*.md                 | doc-audit clean              |
| T007 | Update CHANGELOG and mark preceding plan `status: done`                   | doc-writer         | CHANGELOG.md, 2026-05-18-tetris-game.md         | preceding plan closed        |

## Validation gate

```bash
pnpm affected:lint && pnpm typecheck && pnpm affected:test --coverage && pnpm affected:e2e && pnpm affected:build
```

## Risks & mitigations

- **Risk:** Flaky animation timing in E2E — Mitigation: use deterministic seed for `game-tetris` random piece bag in test env.
- **Risk:** `InputController` over-abstraction — Mitigation: ship keyboard impl only; touch placeholder lives in a follow-up plan if/when needed.

## Rollback

E2E project is new — `nx g delete` to remove. `InputController` abstraction is internal; revert by inlining keyboard handlers.
