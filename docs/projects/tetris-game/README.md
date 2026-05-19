---
id: docs.projects.tetris-game
title: Tetris-game — project hub
type: project
status: in-progress
date: 2026-05-19
links:
  app: ../../../apps/tetris-game
  e2e: ../../../apps/tetris-game-e2e
  port: 4204
  plan: ../../ai-workflow/plans/2026-05-19-tetris-game.md
  preceding_plan: ../../ai-workflow/plans/2026-05-18-tetris-game.md
---

# Tetris-game

> Block-falling arcade on Angular 21 + canvas. Mirrors the `pong-game` split: pure `libs/game-tetris` logic + `libs/game-tetris-ui` UI + `apps/tetris-game` app.

| Aspect    | Value                                                                                                  |
| --------- | ------------------------------------------------------------------------------------------------------ |
| Status    | in-progress (E2E + InputController per [next plan](../../ai-workflow/plans/2026-05-19-tetris-game.md)) |
| Port      | 4204                                                                                                   |
| Start     | `pnpm start:tetris-game` → <http://localhost:4204>                                                     |
| Scope tag | `scope:game-tetris`                                                                                    |

## Read first

- [`business.md`](business.md) — demo script.
- [`technical.md`](technical.md) — logic + UI split.
- [`testing.md`](testing.md) — coverage + plans for E2E.

## Status notes

- App + libs delivered per [`2026-05-18-tetris-game.md`](../../ai-workflow/plans/2026-05-18-tetris-game.md).
- E2E project scaffold added 2026-05-19; full spec roster on [`2026-05-19-tetris-game.md`](../../ai-workflow/plans/2026-05-19-tetris-game.md).
