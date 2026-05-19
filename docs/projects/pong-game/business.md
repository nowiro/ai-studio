---
id: docs.projects.pong-game.business
title: Pong-game — business documentation
type: business
status: done
date: 2026-05-19
---

# Pong-game — business documentation

## Value proposition

The simplest reference for the "pure logic lib + thin UI lib + Nx app" split in `ai-studio`. New game-style demos in the workspace mirror this structure (see `tetris-game`).

## Personas

| ID    | Role         | Need                                         |
| ----- | ------------ | -------------------------------------------- |
| P-DEV | Frontend dev | "Where to put pure logic vs DOM-aware code"  |
| P-VIS | Site visitor | "A 30-second arcade demo on the portfolio"   |
| P-EDU | Educator     | "Example of deterministic game-loop testing" |

## User journeys

### Journey 1 — Play

1. Open `/` (port 4202).
2. Use arrow keys to move the paddle.
3. Score increments on every successful bounce; game ends on miss.

### Journey 2 — Test the logic

1. Run `pnpm nx test game-pong --coverage`.
2. Read `libs/game-pong/src/lib/*.spec.ts` — every collision, score, and reset path covered.

## KPIs

| Metric                          | Target  |
| ------------------------------- | ------- |
| Frame budget on mid-tier laptop | < 8 ms  |
| Logic-lib coverage              | ≥ 90%   |
| Bundle size (gzip)              | < 80 KB |

## Roadmap

See [`2026-05-19-pong-game.md`](../../ai-workflow/plans/2026-05-19-pong-game.md) — tournament + leaderboard.
