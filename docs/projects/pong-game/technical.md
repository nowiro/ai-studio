---
id: docs.projects.pong-game.technical
title: Pong-game — technical documentation
type: technical
status: done
date: 2026-05-19
---

# Pong-game — technical documentation

## Architecture

```
apps/
  pong-game/                   port 4202, hosts the UI
  pong-game-e2e/               Playwright smoke

libs/
  game-pong/                   pure logic — frame-agnostic
  game-pong-ui/                canvas component + keyboard input
```

## game-pong (pure)

- Inputs: `{ width, height, paddleSpeed, ballSpeed }` config.
- Outputs: frame state `{ ball, paddle, score, status }` per tick.
- No DOM, no Angular import. Plain TypeScript.
- Determinism: given the same seed, same inputs → same frame stream.

## game-pong-ui

- Single canvas component (`ais-pong-host`).
- Reads keyboard via a host `keydown` listener decorator (placeholder) → to be moved to `KeyboardInputController` in the next iteration plan.
- `signal(state)` updated each `requestAnimationFrame` from `game-pong` step result.

## Build & serve

```bash
pnpm start:pong-game           # → http://localhost:4202
pnpm nx test game-pong --coverage
pnpm nx e2e pong-game-e2e
```

## References

- [`.ai/rules/angular.md`](../../../.ai/rules/angular.md) (OnPush, signals)
- [`.ai/rules/games.md`](../../../.ai/rules/games.md) (workspace game conventions)
