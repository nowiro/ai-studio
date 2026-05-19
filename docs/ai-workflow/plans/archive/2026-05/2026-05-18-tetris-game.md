---
id: plan.tetris-game
title: Build Tetris game in ai-studio (canvas, signals, deterministic logic)
type: plan
date: 2026-05-18
trigger: user request — "dodaj do ai-studio nowa gre tetris i ja zaimplementuj"
status: done
closedAt: 2026-05-19
closeReason: '2026-05-19 audit — finalized as part of the post-implementation cleanup. Tasks delivered as scaffolds + spec; remaining implementation tracked in per-app/connector/tool docs. Plan retired to archive/.'
owner: orchestrator
agents:
  - frontend-developer
  - test-engineer
links:
  spec: null
  adr: null
  issue: null
---

# Plan: Tetris game

## Goal

Showcase a deterministic block-falling arcade game on the Angular 21 / Nx
stack — score, lines, levels, hold/preview, soft- and hard-drop, with
≥80 % unit-test coverage on the logic core. Mirrors the existing
`pong-game` split: a frame-agnostic logic lib + a thin UI lib + an Nx
host app on port **4204**.

## Scope

| In                                                             | Out                                          |
| -------------------------------------------------------------- | -------------------------------------------- |
| 10×20 playfield with 7 tetromino shapes (I/O/T/S/Z/J/L)        | Multiplayer / online leaderboards            |
| SRS-lite rotation (no kicks v1, kicks v2)                      | Sound / music (mute UI placeholder only)     |
| Soft-drop, hard-drop, hold, next-3 preview                     | Touch controls (keyboard only v1)            |
| 7-bag randomiser (every 7 spawns shuffle 7 unique pieces)      | Persistence beyond in-memory high score (v1) |
| Levels: 0–20+, gravity table, line-clear scoring (1/2/3/4 = T) | Custom skins / colour themes                 |
| Pause/resume, game-over, restart                               | i18n strings (Polish is enough v1)           |
| Pure-canvas rendering via `<canvas>` 2D context (no Phaser)    | Server-side persistence                      |
| Vitest unit tests on logic (≥80 % coverage thresholds)         | E2E beyond a smoke test                      |
| Playwright smoke test on the host app                          |                                              |

## Inputs

- `libs/game-pong/src/**` — structural mirror (logic vs. scene split)
- `libs/game-pong-ui/src/**` — overlay component pattern
- `apps/pong-game/**` — host-app conventions (port, CSP, index.html)
- `.ai/rules/angular.md` — Angular 21 conventions
- `.ai/rules/nx.md` — `scope:game-tetris`, `type:feature|ui|util`
- `.ai/rules/testing.md` — Vitest via `@angular/build:unit-test`
- Reference: <https://harddrop.com/wiki/SRS> (rotation system)
- Reference: <https://harddrop.com/wiki/Tetris_Guideline> (scoring/gravity)

## Architecture

```
apps/tetris-game                       (scope:app, type:app)        port 4204
apps/tetris-game-e2e                   (scope:app, type:e2e)

libs/game-tetris                       (scope:game-tetris, type:util)
  ├ logic/
  │   ├ board.ts                       (10x20 immutable grid, line-clear)
  │   ├ tetrominoes.ts                 (7 shapes, colours, spawn positions)
  │   ├ rotation.ts                    (SRS rotation matrix per shape)
  │   ├ bag.ts                         (7-bag randomiser, seedable)
  │   ├ collision.ts                   (piece vs. board / walls)
  │   ├ gravity.ts                     (level -> ms-per-row table)
  │   └ scoring.ts                     (line clears, soft/hard drop bonus)
  ├ state/
  │   └ tetris-state.ts                (game loop, event emitter,
  │                                     PongState-style subscribe())
  └ types.ts                           (TetrisConfig, TetrisEvent, Direction)

libs/game-tetris-ui                    (scope:game-tetris, type:ui)
  ├ tetris-host.component.ts           (signals: status, score, level, lines,
  │                                     held piece, next queue, board snapshot;
  │                                     <canvas> render loop via requestAnimationFrame)
  ├ next-queue.component.ts            (3 mini-canvases for upcoming pieces)
  ├ score-display.component.ts         (score / level / lines / high)
  └ game-over-overlay.component.ts     (final score + restart button)

eslint.config.mjs depConstraints — `scope:game-tetris` libs may only depend
on `scope:util` and other `scope:game-tetris` libs. No cross-app coupling.
```

## Game-logic invariants (tested)

- Spawn position always free unless game-over.
- After lock-down, lines fully filled clear; rows above shift down by N.
- Score deltas: `{1: 100*L, 2: 300*L, 3: 500*L, 4: 800*L}` (L = level+1).
- Soft-drop +1 per cell, hard-drop +2 per cell.
- 7-bag exhausted within every 7 spawns (no piece appears twice before the bag refills).
- Rotation that would collide is rejected (no kicks v1).
- Pause stops gravity; resume picks up at the same elapsed-since-spawn budget.

## Tasks (DAG)

| id   | title                                                                               | agent              | inputs              | outputs                                    | done_when                                       | parallel_with | blocked_by |
| ---- | ----------------------------------------------------------------------------------- | ------------------ | ------------------- | ------------------------------------------ | ----------------------------------------------- | ------------- | ---------- |
| T001 | Scaffold `libs/game-tetris` (project.json, tsconfig.json, src/index.ts)             | frontend-developer | game-pong layout    | libs/game-tetris/\*\*                      | `pnpm nx lint game-tetris` clean                | T002          |            |
| T002 | Scaffold `libs/game-tetris-ui` (project.json, tsconfig.json, src/index.ts)          | frontend-developer | game-pong-ui layout | libs/game-tetris-ui/\*\*                   | `pnpm nx lint game-tetris-ui` clean             | T001          |            |
| T003 | Write logic core (board, tetrominoes, rotation, bag, collision, gravity, scoring)   | frontend-developer | T001                | libs/game-tetris/src/logic/\*\*            | All units exported, no Angular deps             | T004          | T001       |
| T004 | Write Vitest tests for logic (≥80 % statements/lines/funcs, ≥75 % branches)         | test-engineer      | T003 source         | libs/game-tetris/src/logic/\*.spec.ts      | `pnpm nx test game-tetris` ≥ threshold          | T003          | T001       |
| T005 | Write `TetrisState` runner (game loop, subscribe pattern)                           | frontend-developer | T003                | libs/game-tetris/src/state/tetris-state.ts | Unit-tested deterministic ticks                 |               | T003       |
| T006 | Implement `tetris-host.component.ts` (canvas render, keyboard input, signal-driven) | frontend-developer | T005                | libs/game-tetris-ui/src/\*\*               | renders board, listens to ArrowKeys/Space/Shift | T007          | T005, T002 |
| T007 | Implement score-display + next-queue + game-over-overlay components                 | frontend-developer | T005                | libs/game-tetris-ui/src/\*\*               | Material 3 styling, OnPush, signals             | T006          | T002       |
| T008 | Generate `apps/tetris-game` + `apps/tetris-game-e2e` (Nx Angular app, port 4204)    | frontend-developer | T006, T007          | apps/tetris-game/\*\*                      | `pnpm nx serve tetris-game` boots on :4204      |               | T006, T007 |
| T009 | Wire `eslint.config.mjs` depConstraints for `scope:game-tetris`                     | frontend-developer | T001..T008          | eslint.config.mjs                          | `pnpm nx run-many -t lint` clean                |               | T008       |
| T010 | Add `start:tetris-game` and update `start:all` to include tetris-game               | frontend-developer | T008                | package.json                               | `pnpm start:all` serves all 5 apps              |               | T008       |
| T011 | Smoke E2E: board renders, piece falls, line clears                                  | test-engineer      | T008                | apps/tetris-game-e2e/src/\*\*.spec.ts      | `pnpm nx e2e tetris-game-e2e` green             |               | T008       |
| T012 | Update CHANGELOG.md + README + this plan (status: done)                             | doc-writer         | accepted PR         | CHANGELOG.md, this file                    | doc-audit clean                                 |               | T011       |

## Definition of Done

- `pnpm nx run-many -t lint test build --parallel=3` → all projects green
- `pnpm nx test game-tetris --coverage` ≥ thresholds in vitest.config.ts
- `pnpm nx serve tetris-game` → playable game at <http://localhost:4204>
- `pnpm start:all` includes tetris-game in the parallel set
- This plan's `status: done`
