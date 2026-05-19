---
id: docs.projects.tetris-game.business
title: Tetris-game — business documentation
type: business
status: in-progress
date: 2026-05-19
---

# Tetris-game — business documentation

## Value proposition

Second reference (after `pong-game`) for the "pure logic lib + thin UI lib + app" split, covering a more involved game loop (piece bag, rotations, line clears, soft/hard drop, hold queue).

## Personas

| ID    | Role         | Need                                               |
| ----- | ------------ | -------------------------------------------------- |
| P-DEV | Frontend dev | "Reference for a non-trivial deterministic game"   |
| P-EDU | Educator     | "Test coverage of bag randomiser + rotation kicks" |
| P-VIS | Site visitor | "Classic Tetris on the portfolio"                  |

## Demo

| Step | Action                             | Outcome                                  |
| ---- | ---------------------------------- | ---------------------------------------- |
| 1    | Open `http://localhost:4204`       | Board + next-queue + hold panel rendered |
| 2    | Arrow keys move piece; Up rotates  | Piece animates, ghost preview shown      |
| 3    | Space hard-drops                   | Piece slams; line clears if filled       |
| 4    | Hold (Shift) swaps active and hold | Hold cell now shows previous piece       |

## KPIs

| Metric                          | Target                                                                           |
| ------------------------------- | -------------------------------------------------------------------------------- |
| Frame budget on mid-tier laptop | < 8 ms                                                                           |
| Logic-lib coverage              | ≥ 90%                                                                            |
| Smoke E2E green                 | ✅ (delivered by [next plan](../../ai-workflow/plans/2026-05-19-tetris-game.md)) |
