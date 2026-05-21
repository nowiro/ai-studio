---
id: docs.projects.tetris-game.testing
title: Tetris-game — testing
type: testing
status: in-progress
date: 2026-05-19
---

# Tetris-game — testing

## Pyramid

```
                 ▲
                 │  E2E (Playwright) — board renders, piece falls, line clears
                 │  (scaffold landed 2026-05-19; specs grow per next plan)
                 │
                 │  Unit (Vitest) — pure logic: bag, rotation, scoring, kicks
                 ▼
```

## Files

```
libs/game-tetris/src/lib/
├── tetris-logic.ts
├── tetris-logic.spec.ts
├── bag.ts
├── bag.spec.ts
└── rotation.spec.ts

libs/game-tetris-ui/src/lib/
├── tetris-host.component.ts
└── tetris-host.component.spec.ts

apps/tetris-game-e2e/src/
└── example.spec.ts             — placeholder; full suite per next plan
```

## Coverage gates

- `game-tetris` (pure): ≥ 90% statements
- `game-tetris-ui`: ≥ 80% statements

## Traceability matrix

| AC                                        | Test                              | Layer      |
| ----------------------------------------- | --------------------------------- | ---------- |
| 7-bag randomiser exhausts each piece once | `bag.spec.ts`                     | unit       |
| SRS rotation kicks tabulated correctly    | `rotation.spec.ts`                | unit       |
| Tetris line clear scores 800              | `tetris-logic.spec.ts`            | unit       |
| Hard drop locks piece at floor            | `tetris-logic.spec.ts`            | unit       |
| Board renders on app load                 | `apps/tetris-game-e2e/...spec.ts` | e2e (next) |
