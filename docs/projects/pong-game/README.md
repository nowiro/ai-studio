---
id: docs.projects.pong-game
title: Pong-game — project hub
type: project
status: done
date: 2026-05-19
links:
  app: ../../../apps/pong-game
  e2e: ../../../apps/pong-game-e2e
  port: 4202
  plan: ../../ai-workflow/plans/2026-05-19-pong-game.md
  runs: ../../ai-workflow/runs/2026-05-08-pong-game/
---

# Pong-game

> Deterministic block-paddle game on Angular 21 + canvas. Pure logic in `libs/game-pong`; UI in `libs/game-pong-ui`. Mirror split of `tetris-game`.

| Aspect    | Value                                            |
| --------- | ------------------------------------------------ |
| Status    | done                                             |
| Port      | 4202                                             |
| Start     | `pnpm start:pong-game` → <http://localhost:4202> |
| Scope tag | `scope:game-pong`                                |
| Stack     | Angular 21 · canvas 2D · signals · Tailwind v4   |

## Read first

- [`business.md`](business.md) — demo script + KPIs.
- [`technical.md`](technical.md) — logic + UI lib split.
- [`testing.md`](testing.md) — coverage + traceability.

## Next iteration

[`2026-05-19-pong-game.md`](../../ai-workflow/plans/2026-05-19-pong-game.md) — tournament mode + leaderboard.
