---
id: plan.game-settings-panels
title: Pong + Tetris settings panels (volume, paddle speed, ghost piece, reset best)
type: plan
date: 2026-05-20
trigger: user request — "Settings panele (volume slider, reset best, pong paddle speed)" (post-T009/T010 follow-up)
status: done
closedAt: 2026-05-20
closeReason: 'All 8 tasks delivered. Settings stores (signal + localStorage v1) for both games with full unit-test coverage. Pong paddle speed wired into PongState via setPlayerSpeedMultiplier — fast preset is measurably faster than slow under tick(). Volume wired to game.sound.volume via new GameApi.setVolume. Tetris ghost-piece toggle wired into tetris-host drawBoard. Settings overlays use Material 3 (mat-slider, mat-button-toggle, mat-slide-toggle) and live alongside menu overlays. Gear icon button in both menus opens settings; ESC closes. Builds green; pong initial bundle 131.59 kB transferred (5 kB over budget — slider + button-toggle added weight, follow-up if it matters).'
owner: orchestrator
agents:
  - frontend-developer
  - test-engineer
links:
  spec: null
  adr: null
  issue: null
---

# Plan: Pong + Tetris settings panels

> Domyka brakujący kawałek T009/T010 z `2026-05-20-echarts-wrappers-dashboards-games.md`. Gry mają mute toggle + best score, ale brakuje pełnowartościowego settings panelu (volume slider, paddle speed dla pong, ghost piece toggle dla tetris, reset best). Settings persist w localStorage; UI overlay otwierany z menu via gear icon.

## Scope

| In                                                                                     | Out                                                                                           |
| -------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `PongSettingsStore` + `TetrisSettingsStore` (signal + localStorage)                    | Difficulty curves dla tetris (DAS/ARR, lock-delay) — niche, follow-up                         |
| Settings overlay (Material 3) dla obu gier — wzór z menu-overlay                       | Audio engine refactor — pong używa już `game.sound.volume`; tetris bez audio (settings-ready) |
| Volume slider 0..100% (mute = 0), reset best score                                     | E2E spec dla settings (mock-only unit tests)                                                  |
| Pong: paddle speed (slow/normal/fast) — wired via `PongState.setPlayerSpeedMultiplier` | AI difficulty (osobna podróż — wymaga rebalansu)                                              |
| Tetris: ghost piece toggle — wired via host conditional `drawGhost`                    | Touch controls / leaderboard view (odrębne follow-upy)                                        |
| Menu overlay: gear icon button → emit `openSettings`                                   | Settings przez modal (zostajemy przy overlay positioned absolute — spójność z menu)           |

## Tasks (DAG)

| id   | title                                                                      | agent              | inputs     | outputs                                                               | done_when                             | parallel_with | blocked_by |
| ---- | -------------------------------------------------------------------------- | ------------------ | ---------- | --------------------------------------------------------------------- | ------------------------------------- | ------------- | ---------- |
| T001 | `PongSettingsStore` (signal + localStorage v1) + spec                      | frontend-developer | discovery  | libs/game-pong/src/settings-store.{ts,spec.ts}                        | unit tests green, exported from index | T002          |            |
| T002 | `TetrisSettingsStore` (signal + localStorage v1) + spec                    | frontend-developer | discovery  | libs/game-tetris/src/settings-store.{ts,spec.ts}                      | unit tests green, exported from index | T001          |            |
| T003 | `PongState.setPlayerSpeedMultiplier` runtime mutation + spec               | frontend-developer | T001       | libs/game-pong/src/state/pong-state.ts (+ existing spec extension)    | multiplier affects tick(), spec green |               | T001       |
| T004 | Pong `SettingsOverlayComponent` (mat-slider, button-toggle, reset, close)  | frontend-developer | T001,T003  | libs/game-pong-ui/src/settings-overlay/settings-overlay.component.ts  | overlay renders, all controls bound   | T005          | T001,T003  |
| T005 | Tetris `SettingsOverlayComponent` (mat-slider, slide-toggle, reset, close) | frontend-developer | T002       | libs/game-tetris-ui/src/settings-overlay.component.ts                 | overlay renders, all controls bound   | T004          | T002       |
| T006 | Pong menu: gear icon → openSettings; host: track overlay + apply to game   | frontend-developer | T004       | libs/game-pong-ui/src/menu-overlay + apps/pong-game/src/app/pong-host | gear icon visible, settings apply     |               | T004       |
| T007 | Tetris menu: gear icon → openSettings; host: track overlay + apply ghost   | frontend-developer | T005       | libs/game-tetris-ui/src/menu-overlay + tetris-host                    | gear icon visible, ghost toggle works |               | T005       |
| T008 | Validators: lint + typecheck + test + build affected; trinity:check        | test-engineer      | T001..T007 | (no new files)                                                        | all gates green                       |               | T001..T007 |

## Validation gate

```bash
pnpm nx run-many --target=lint --projects=game-pong,game-tetris,game-pong-ui,game-tetris-ui
pnpm nx run-many --target=typecheck --projects=game-pong,game-tetris,game-pong-ui,game-tetris-ui
pnpm nx run-many --target=test --projects=game-pong,game-tetris
pnpm nx build pong-game
pnpm nx build tetris-game
pnpm trinity:check
```

## Risks & mitigations

- **Risk:** Settings persist but don't actually affect gameplay (hollow UX) — **Mitigation:** T003/T007 explicitly wire paddle speed multiplier into `PongState.tick()` and ghost visibility into `TetrisHostComponent.drawBoard()`; volume hits `game.sound.volume` via `GameApi.setVolume` extension.
- **Risk:** localStorage quota / private mode — **Mitigation:** mirror the swallow-and-fallback pattern already used by `PongHighScoreStore`.
- **Risk:** Settings change re-creates game state and resets score mid-round — **Mitigation:** runtime mutators only (paddle speed multiplier, volume, ghost flag); no `new PongState()` invocation outside `start()`.
- **Risk:** Material slider + button-toggle increase bundle — **Mitigation:** standalone imports only, no module bundles; verify via `pnpm nx build pong-game` size.

## Rollback

Each task lands as its own commit. Reverting the menu wire-up (T006/T007) leaves the settings stores + overlays unreachable but harmless. Reverting the wrapper components removes them from the public API — consumers don't yet exist outside the hosts.
