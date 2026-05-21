---
id: docs.projects.tetris-game.technical
title: Tetris-game — technical documentation
type: technical
status: in-progress
date: 2026-05-19
---

# Tetris-game — technical documentation

## Architecture

```
apps/
  tetris-game/                 port 4204
  tetris-game-e2e/             Playwright smoke (scaffold added 2026-05-19)

libs/
  game-tetris/                 pure logic — bag, rotation, line clears
  game-tetris-ui/              canvas + keyboard input
```

## game-tetris (pure)

- 7-bag randomiser with explicit seed.
- SRS rotation system + standard kick table.
- Deterministic line-clear scoring (single, double, triple, tetris).
- API: `step(state, action) → state` — frame-agnostic.

## game-tetris-ui

- Canvas-based host (`ais-tetris-host`).
- Keyboard handlers — about to be extracted to `InputController` per next plan.
- Next-queue + hold + score side-panel components.

## Build & serve

```bash
pnpm start:tetris-game
pnpm nx test game-tetris --coverage
pnpm nx e2e tetris-game-e2e   # available when project tests stabilise
```

## References

- [`.ai/rules/games.md`](../../../.ai/rules/games.md)
- [`docs/projects/pong-game/technical.md`](../pong-game/technical.md) — sibling pattern
