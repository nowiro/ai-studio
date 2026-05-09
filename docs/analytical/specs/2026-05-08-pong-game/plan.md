---
id: plan.pong-game
title: Pong — implementation plan
type: plan
date: 2026-05-08
trigger: /plan pong-game
status: accepted
owner: orchestrator
agents:
  - architect
  - frontend-developer
  - test-engineer
  - test-scenario-author
  - doc-writer
links:
  spec: ./spec.md
  adr: ../../../adr/0004-phaser-as-default-game-library.md
  issue: null
---

# Plan: Pong — implementation

> Phase 2 (Plan) artefact. Loads `spec.md` + `.ai/rules/principles.md` + `.ai/rules/{angular,nx,games,testing,security,styling}.md`.

## Goal

Ship a single-player browser Pong game in `apps/pong-game` that demonstrates every rule in `.ai/rules/games.md` while satisfying every acceptance criterion in `spec.md`.

## Scope

| In                                                                                                  | Out                                                                            |
| --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| One Nx Angular app (`apps/pong-game`).                                                              | Multiplayer (local or networked).                                              |
| Two libs: `libs/game-pong` (framework-agnostic Phaser) + `libs/game-pong-ui` (Angular HUD).         | Touch controls / mobile layout.                                                |
| Pure-TS game logic (collision, scoring, AI tracking) reusable in unit tests without a Phaser scene. | Difficulty selector / configurable AI.                                         |
| Vitest unit tests for pure logic; Playwright E2E for AC-1…AC-10 with a page-object.                 | Asset pipelines (TexturePacker, audio sprites).                                |
| Feature flag `PONG_ENABLED` gating the route at build time.                                         | Persistent state (high scores, accounts).                                      |
| Documentation: `docs/technical/pong-game.md` + per-persona links from `docs/README.md`.             | Re-introducing global state libs (signals only, scoped to the host component). |

## Inputs

- [`docs/analytical/specs/2026-05-08-pong-game/spec.md`](./spec.md) — acceptance criteria.
- [`.ai/rules/games.md`](../../../../.ai/rules/games.md) — Phaser-in-Angular constraints.
- [`.ai/rules/angular.md`](../../../../.ai/rules/angular.md) — Angular 21 conventions.
- [`.ai/rules/nx.md`](../../../../.ai/rules/nx.md) — apps/libs taxonomy.
- [`.ai/rules/testing.md`](../../../../.ai/rules/testing.md) — pyramid + page objects.
- [`.ai/rules/security.md`](../../../../.ai/rules/security.md) — model output untrusted; no eval; CSP-friendly assets.
- [`.ai/rules/styling.md`](../../../../.ai/rules/styling.md) — Material 3 + Tailwind v4; no `::ng-deep`.
- [`docs/adr/0004-phaser-as-default-game-library.md`](../../../adr/0004-phaser-as-default-game-library.md) — Phaser is approved.

## Tech choices

No new ADR required — Phaser, Vitest, Playwright are already adopted in the trinity baseline.

| Concern             | Choice                                                                                        | Why                                                                          |
| ------------------- | --------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Game framework      | **Phaser 3** with `arcade` physics                                                            | Smallest physics surface that handles paddle/ball/wall collisions; ADR-0004. |
| Renderer            | **WebGL** (Phaser default), fall back to Canvas via `Phaser.AUTO`                             | Performance; jsdom + `Phaser.HEADLESS` for integration tests.                |
| State               | Plain TypeScript class `PongState`; exposed to Angular via `signal()` adapter in the host     | Keeps lib Angular-free; matches `.ai/rules/games.md` §4.                     |
| Angular host        | Standalone component, OnPush, `inject()`, `viewChild()`, `signal()`, `takeUntilDestroyed`     | Angular 21 conventions.                                                      |
| HUD                 | Angular Material 3 buttons + Tailwind v4 utility classes; no `::ng-deep`                      | `.ai/rules/styling.md`.                                                      |
| Audio               | `Phaser.Sound.HTML5AudioSoundManager` with built-in beep WAVs in `libs/game-pong/src/assets/` | No third-party audio engine; respects `prefers-reduced-sound`.               |
| Bundle gating       | Build-time env var `PONG_ENABLED`; route guard returns `redirectTo: '/not-found'` when false  | Matches AC-10 and admin persona need.                                        |
| Tests — unit        | Vitest (Angular 21 native runner) on pure logic in `libs/game-pong/src/logic`                 | `.ai/rules/testing.md`; collision math is pure.                              |
| Tests — integration | Vitest + jsdom + `Phaser.HEADLESS` for scene transitions                                      | Allows asserting state changes without a real GPU.                           |
| Tests — E2E         | Playwright; chromium-only (per repo policy); page-object pattern                              | `.ai/rules/testing.md`; matches existing `e2e.yml`.                          |

## Module taxonomy

```
apps/
└── pong-game/                    # Nx Angular app — tags: scope:game, type:app
    ├── src/
    │   ├── main.ts
    │   ├── index.html
    │   ├── styles.css
    │   └── app/
    │       ├── app.component.ts            # routes wrapper
    │       ├── app.routes.ts               # / → PongHostComponent unless PONG_ENABLED=false
    │       ├── pong-host.component.ts      # mounts Phaser, bridges signals
    │       └── not-found.component.ts      # gate fallback
    └── project.json                  # build/serve/test/lint targets

apps/
└── pong-game-e2e/                # Playwright project — tags: scope:game, type:e2e
    └── src/
        ├── pong.e2e.spec.ts
        └── support/
            └── pong.page.ts            # page object

libs/
├── game-pong/                    # framework-agnostic Phaser game — tags: scope:game, type:feature
│   ├── src/
│   │   ├── index.ts                # public api: createGame, GameApi, types
│   │   ├── game.ts                 # createGame(parent) factory
│   │   ├── types.ts                # GameApi, PongConfig, PongEvents
│   │   ├── state/
│   │   │   └── pong-state.ts       # plain TS class; emits events
│   │   ├── logic/
│   │   │   ├── collision.ts        # pure functions
│   │   │   ├── scoring.ts          # pure functions
│   │   │   ├── ai.ts               # pure tracking
│   │   │   └── *.spec.ts           # Vitest unit tests
│   │   ├── scenes/
│   │   │   ├── boot.scene.ts
│   │   │   ├── menu.scene.ts
│   │   │   ├── play.scene.ts
│   │   │   └── game-over.scene.ts
│   │   └── assets/                 # one PNG sprite atlas + 3 small WAVs
│   └── project.json
└── game-pong-ui/                 # HUD components — tags: scope:game, type:ui
    ├── src/
    │   ├── index.ts                # public api
    │   ├── score-display/
    │   │   └── score-display.component.ts
    │   ├── menu-overlay/
    │   │   └── menu-overlay.component.ts
    │   └── game-over-overlay/
    │       └── game-over-overlay.component.ts
    └── project.json
```

## Public API surface

`libs/game-pong/src/index.ts`:

```typescript
export { createGame } from './game.js';
export type { GameApi, PongConfig, PongEvents, PongScore } from './types.js';
export { DEFAULT_PONG_CONFIG } from './types.js';
```

`libs/game-pong-ui/src/index.ts`:

```typescript
export { ScoreDisplayComponent } from './score-display/score-display.component.js';
export { MenuOverlayComponent } from './menu-overlay/menu-overlay.component.js';
export { GameOverOverlayComponent } from './game-over-overlay/game-over-overlay.component.js';
```

## Data model

```typescript
export interface PongConfig {
  readonly width: number; // px, default 800
  readonly height: number; // px, default 600
  readonly paddleHeight: number; // px, default 96
  readonly paddleSpeed: number; // px/s, default 480
  readonly ballSpeed: number; // px/s, default 360
  readonly aiSpeed: number; // px/s, default 320 (slower than player)
  readonly winScore: number; // default 5
}

export interface PongScore {
  readonly player: number;
  readonly cpu: number;
}

export type PongEvent =
  | { type: 'score'; score: PongScore }
  | { type: 'paddle-hit'; side: 'player' | 'cpu' }
  | { type: 'wall-hit'; side: 'top' | 'bottom' }
  | { type: 'game-over'; winner: 'player' | 'cpu' };

export interface GameApi {
  readonly start: () => void;
  readonly pause: () => void;
  readonly resume: () => void;
  readonly reset: () => void;
  readonly mute: (muted: boolean) => void;
  readonly subscribe: (handler: (event: PongEvent) => void) => () => void;
  readonly destroy: () => void;
}
```

## Generator plan

**No `nx generate` calls.** The repo has no committed projects; we manually create `project.json`, `tsconfig.json`, `tsconfig.spec.json`, and update `tsconfig.base.json` paths. This avoids generator-driven drift and keeps the change reviewable in one diff. Future games may switch to `nx g @nx/angular:lib …` once the workspace has stabilised.

Path aliases added to `tsconfig.base.json`:

```json
"paths": {
  "@ai-studio/game-pong": ["libs/game-pong/src/index.ts"],
  "@ai-studio/game-pong-ui": ["libs/game-pong-ui/src/index.ts"]
}
```

## Tasks (DAG)

| id   | title                                                     | agent                | inputs                       | outputs                                                                    | done_when                                         | parallel_with | blocked_by       |
| ---- | --------------------------------------------------------- | -------------------- | ---------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------- | ------------- | ---------------- |
| T001 | Scaffold `libs/game-pong` package with public API + types | frontend-developer   | `.ai/rules/games.md`, plan   | `libs/game-pong/{project.json, tsconfig.json, src/index.ts, src/types.ts}` | `pnpm typecheck` clean                            | T002          |                  |
| T002 | Scaffold `libs/game-pong-ui` with empty component shells  | frontend-developer   | `.ai/rules/styling.md`       | `libs/game-pong-ui/{project.json, src/index.ts, components}`               | `pnpm typecheck` clean                            | T001          |                  |
| T003 | Implement pure logic (collision, scoring, ai)             | frontend-developer   | spec AC-3..AC-7              | `libs/game-pong/src/logic/*.ts`                                            | functions exported, no `any`                      |               | T001             |
| T004 | Implement `PongState` + event emitter                     | frontend-developer   | T003                         | `libs/game-pong/src/state/pong-state.ts`                                   | emits `PongEvent` on transitions                  |               | T003             |
| T005 | Unit tests for logic + state (Vitest)                     | test-engineer        | T003, T004                   | `*.spec.ts` next to each module                                            | coverage ≥ 80 % statements, every AC has ≥ 1 test | T006          | T003, T004       |
| T006 | Implement Phaser scenes (boot/menu/play/game-over)        | frontend-developer   | T004, `.ai/rules/games.md`   | `libs/game-pong/src/scenes/*.scene.ts`                                     | `pnpm build` clean                                | T005          | T004             |
| T007 | Wire `createGame` factory + `GameApi`                     | frontend-developer   | T006                         | `libs/game-pong/src/game.ts`                                               | factory returns `Phaser.Game` + `GameApi`         |               | T006             |
| T008 | Scaffold `apps/pong-game` Angular shell + routes          | frontend-developer   | T002, `.ai/rules/angular.md` | `apps/pong-game/{project.json, src/}`                                      | dev server boots locally                          |               | T002             |
| T009 | Implement `PongHostComponent` mounting Phaser             | frontend-developer   | T007, T008                   | `apps/pong-game/src/app/pong-host.component.ts`                            | host bridges `score$` → `signal()`                |               | T007, T008       |
| T010 | Implement HUD components (score, menu overlay, game-over) | frontend-developer   | T002, T009                   | `libs/game-pong-ui/src/**/*.component.ts`                                  | components renderable in Storybook-style harness  |               | T002, T009       |
| T011 | Implement `PONG_ENABLED` route guard + not-found view     | frontend-developer   | spec AC-10                   | `apps/pong-game/src/app/{app.routes.ts, not-found.component.ts}`           | toggling env produces 404                         |               | T008             |
| T012 | E2E page object + AC-1..AC-10 Playwright tests            | test-scenario-author | spec AC-1..AC-10             | `apps/pong-game-e2e/src/**/*.ts`                                           | every AC referenced by test name; chromium green  | T013          | T009, T010, T011 |
| T013 | User-facing docs: technical + persona links               | doc-writer           | spec, plan, code             | `docs/technical/pong-game.md`, update `docs/README.md`                     | doc-audit clean for touched files                 |               | T009, T010       |
| T014 | Code review pass                                          | code-reviewer        | T009..T013 diff              | review verdict                                                             | verdict: approved                                 |               | T009..T013       |
| T015 | Security audit (XSS, CSP, dependency surface)             | security-auditor     | T014 verdict                 | audit notes appended to spec.md `Security review` section                  | no high findings                                  |               | T014             |

## Validation gate

```bash
pnpm affected:lint
pnpm typecheck
pnpm affected:test
pnpm affected:e2e
pnpm affected:build
pnpm ai:validate
pnpm docs:lint
pnpm docs:linkcheck
```

All green + Conventional Commit (`feat(app): pong game`) + this plan accepted.

## Risks & mitigations

- **Risk:** Phaser bundle inflates the main chunk → exceed 250 KB gzip target. **Mitigation:** Phaser is loaded only on the `/` route of `apps/pong-game`, never imported by other apps; the route is dynamic-import lazy.
- **Risk:** jsdom + `Phaser.HEADLESS` integration tests flake on missing browser APIs. **Mitigation:** keep Vitest tests on pure logic only; integration tests assert state transitions through the public `GameApi`, not Phaser internals.
- **Risk:** Keyboard event listeners leak between tests. **Mitigation:** `GameApi.destroy()` removes all listeners; Playwright explicitly calls it via `data-testid="reset-game"` after each test.
- **Risk:** Audio autoplay blocked by browser policy. **Mitigation:** initialise `Phaser.Sound` only on the first user interaction (start button); document the limitation in `docs/technical/pong-game.md`.
- **Risk:** WebGL unavailable in CI runner. **Mitigation:** `Phaser.AUTO` falls back to Canvas; Playwright runs on chromium with WebGL flag set.

## Rollback

If the plan is aborted mid-execution: delete `apps/pong-game`, `apps/pong-game-e2e`, `libs/game-pong`, `libs/game-pong-ui`; revert `tsconfig.base.json` paths; revert the `docs/analytical/specs/2026-05-08-pong-game/` directory. Trinity baseline files are not touched, so siblings stay green.

## Run log

Per-task one-liners are appended to `docs/ai-workflow/runs/2026-05-08-pong-game.md` as they execute. The orchestrator updates `status:` above each phase boundary.
