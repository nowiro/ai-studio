---
id: docs.projects.pong-game.testing
title: Pong-game — testing
type: testing
status: done
date: 2026-05-19
---

# Pong-game — testing

## Pyramid

```
                 ▲
                 │  E2E (Playwright) — board renders, score increments
                 │
                 │  Unit (Vitest) — pure logic: collisions, scoring, reset
                 ▼
```

## Files

```
libs/game-pong/src/lib/
├── pong-logic.ts
└── pong-logic.spec.ts

libs/game-pong-ui/src/lib/
├── pong-host.component.ts
└── pong-host.component.spec.ts

apps/pong-game-e2e/src/
└── smoke.spec.ts
```

## Coverage gates

- `game-pong` (pure): ≥ 90% statements
- `game-pong-ui`: ≥ 80% statements
- Repo defaults otherwise.

## Traceability matrix

| AC                                | Test                               | Layer |
| --------------------------------- | ---------------------------------- | ----- |
| Ball bounces off paddle           | `pong-logic.spec.ts`               | unit  |
| Score increments after bounce     | `pong-logic.spec.ts`               | unit  |
| Game ends when ball passes paddle | `pong-logic.spec.ts`               | unit  |
| Reset clears state to initial     | `pong-logic.spec.ts`               | unit  |
| Canvas renders on app load        | `apps/pong-game-e2e/smoke.spec.ts` | e2e   |
