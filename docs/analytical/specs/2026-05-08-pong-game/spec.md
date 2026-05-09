---
id: spec.pong-game
title: Pong — single-player browser game
type: spec
phase: 1-specify
status: accepted
date: 2026-05-08
author: analyst
links:
  plan: ./plan.md
  adr: ../../../adr/0004-phaser-as-default-game-library.md
---

# Pong — specification

> Phase 1 (Specify) artefact. No tech choices below. The architect's `plan.md` resolves them.

## Problem statement

The repo has Phaser 3 as the default 2D game library ([ADR-0004](../../../adr/0004-phaser-as-default-game-library.md)) and a documented `apps/<game-name>-game/ + libs/game-<name>/` layout (`.ai/rules/games.md`), but `apps/` and `libs/` are empty. We need a worked example that proves the trinity-aware multi-agent SDD flow can produce a working game from scratch — including spec, plan, tasks, code, unit tests, E2E tests, and documentation — in a way analysts, testers, developers, devops, and admins can each consume.

Pong is the smallest interesting choice: known rules (no business analysis required), tight gameplay loop, easy to assert deterministic outcomes in tests.

## Personas affected

| Persona id | Role                     | Why they care                                                                    |
| ---------- | ------------------------ | -------------------------------------------------------------------------------- |
| P-PLAYER   | Casual player (end user) | Wants a 2-minute distraction that works without an account.                      |
| P-DEV      | Frontend developer       | Uses this as the reference for new Phaser-in-Angular features.                   |
| P-TESTER   | Test engineer / QA       | Authors test scenarios from `spec.md`; runs them via `/run-test-scenarios`.      |
| P-ANALYST  | Product / Analyst        | Wants to see acceptance criteria + success metrics traceable to the working app. |
| P-DEVOPS   | DevOps / SRE             | Needs the app to fit the standard Nx build/serve/e2e cadence (no special infra). |
| P-ADMIN    | Site admin               | Wants a way to disable the game route via configuration alone.                   |

(Persona ids will be promoted to `.ai/context/personas.md` once the canonical persona catalogue exists. Today we cite them inline.)

## User stories

### US-1 — Casual play

> **As** P-PLAYER **I want** to open a URL and immediately play a single round of Pong against the computer **so that** I can take a quick break.

### US-2 — Reference implementation

> **As** P-DEV **I want** the game to demonstrate every game-specific rule from `.ai/rules/games.md` **so that** I can copy the structure when adding a new game.

### US-3 — Test scenarios derived from the spec

> **As** P-TESTER **I want** every acceptance criterion to map to at least one Playwright scenario **so that** the spec is the source of truth for QA coverage.

### US-4 — Configurable rollout

> **As** P-ADMIN **I want** the game route gated by a feature flag **so that** I can hide the page if a security or performance regression is found.

## Acceptance criteria

Written as Given/When/Then; identifiers feed the test-scenario-author.

### AC-1 — Game starts on the menu

- **Given** the player navigates to the game URL
- **When** the page finishes loading (no `[data-testid="game-loading"]` visible)
- **Then** a menu with a `data-testid="start-game"` button is visible
- **And** the game canvas (`data-testid="game-canvas"`) is visible
- **And** no automated motion is happening yet

### AC-2 — Starting a round resets state

- **Given** the menu is visible
- **When** the player clicks `[data-testid="start-game"]`
- **Then** the score becomes `0 – 0`
- **And** the ball is centred and starts moving toward one of the players
- **And** both paddles are vertically centred

### AC-3 — Player paddle responds to keyboard

- **Given** the round is in progress and focus is on the canvas
- **When** the player holds **W** or **ArrowUp**
- **Then** the left paddle moves up at a constant speed
- **When** the player holds **S** or **ArrowDown**
- **Then** the left paddle moves down at a constant speed
- **And** the paddle never leaves the play area

### AC-4 — AI paddle tracks the ball

- **Given** the round is in progress
- **When** the ball moves toward the right wall
- **Then** the right paddle's vertical position approaches the ball's vertical position at no more than the configured AI speed (so that perfect play is impossible at default difficulty)

### AC-5 — Ball bounces off paddles and walls

- **Given** the ball is in play
- **When** the ball collides with the top or bottom of the play area
- **Then** its vertical velocity inverts; horizontal velocity unchanged
- **When** the ball collides with a paddle
- **Then** its horizontal velocity inverts; vertical velocity gains a small offset based on where the ball hit the paddle

### AC-6 — Scoring on miss

- **Given** the ball passes the left edge of the play area
- **Then** the right player's score increases by 1
- **And** the ball resets to centre, served toward the player who just scored
- **(Symmetrically for the right edge.)**

### AC-7 — First to 5 wins

- **Given** either side scores their 5th point
- **When** the score crosses the threshold
- **Then** play stops
- **And** an end-screen with `data-testid="game-over"` is visible
- **And** the screen shows the winner ("YOU WIN" or "CPU WINS")
- **And** a `data-testid="play-again"` button restarts a fresh round

### AC-8 — Pause and resume

- **Given** the round is in progress
- **When** the player presses **Esc** or **P**
- **Then** the game pauses
- **And** ball and paddles stop moving
- **And** a `data-testid="paused"` overlay is visible
- **When** the player presses the same key again
- **Then** the game resumes from the same state

### AC-9 — Mute and unmute

- **Given** the round is in progress
- **When** the player clicks `[data-testid="mute-toggle"]` (or presses **M**)
- **Then** all sound effects stop
- **And** the icon flips to "muted"
- **When** the same control is activated again
- **Then** sound effects resume

### AC-10 — Feature flag

- **Given** the env var `PONG_ENABLED` is `"false"` at build time
- **When** the player navigates to the game URL
- **Then** the page returns a 404-style "not found" view
- **And** no Phaser bundle is downloaded (verified by absence of the chunk in the network tab)

## Success metrics

| Metric                  | Target                                                                           |
| ----------------------- | -------------------------------------------------------------------------------- |
| Time to first frame     | < 500 ms on a mid-range laptop, cold cache.                                      |
| Frames per second       | ≥ 55 fps measured by Phaser `game.loop.actualFps` over a 30-second sample.       |
| Bundle size delta       | < 250 KB gzip added by `apps/pong-game` + `libs/game-pong*` over baseline shell. |
| Unit-test coverage      | ≥ 80 % statements / ≥ 75 % branches on touched files.                            |
| E2E acceptance coverage | every AC-N has at least one Playwright test that asserts its outcome.            |
| Lighthouse Performance  | ≥ 90 on the game page.                                                           |

## Non-goals

- Multiplayer (local or networked).
- Persistent leaderboards or accounts.
- Mobile-touch controls (focus is keyboard; mobile is a future ADR).
- Difficulty selector (one default difficulty for v1).
- 3D or shader-based effects.
- Asset pipelines (TexturePacker, audio sprites). Single-file assets only for v1.

## Open questions

(All resolved during /clarify; left here as audit trail.)

- ✅ Single-player only? — **Yes.** Multiplayer is a separate spec.
- ✅ Win threshold? — **5 points.** Tunable via a constant; not user-configurable in v1.
- ✅ Mobile? — **Not for v1.** Keyboard only.
- ✅ Persistent state? — **No.** Each visit is a fresh game.
- ✅ Sound? — **Yes,** simple bleeps; muteable; respects `prefers-reduced-motion` and `prefers-reduced-sound` media queries.

## Traceability

- **Plan:** [`./plan.md`](./plan.md)
- **Tasks:** [`./tasks.md`](./tasks.md)
- **ADR (Phaser):** [`docs/adr/0004-phaser-as-default-game-library.md`](../../../adr/0004-phaser-as-default-game-library.md)
- **Game rules:** [`.ai/rules/games.md`](../../../../.ai/rules/games.md)
- **Spec-driven workflow:** [`.ai/workflows/spec-driven.md`](../../../../.ai/workflows/spec-driven.md)
- **Persona catalogue:** [`docs/analytical/personas.md`](../../personas.md)
