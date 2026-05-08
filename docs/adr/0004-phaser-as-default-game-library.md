# 0004 — Phaser 3 as the default 2D game framework

- Status: accepted
- Date: 2026-05-08
- Decision-makers: maintainers
- Consulted: frontend-developer agent owners
- Informed: all contributors

## Context and problem statement

AI Studio is positioned as a multi-purpose Angular Nx starter, and we want game-oriented apps to land in a known shape rather than every team picking a different engine. We need a default 2D framework that:

- has TypeScript support out of the box,
- runs in the browser (no native build step),
- has a deep, MIT-licensed examples corpus we can crib from,
- doesn't entangle game code with the Angular dependency graph.

## Decision drivers

- **DX**: examples-driven onboarding beats reading framework internals.
- **Decoupling**: game logic must not import Angular APIs — the canvas is the contract.
- **Bundle size**: the host app shouldn't pay for the engine if it doesn't import a game lib.
- **Maintenance**: actively maintained framework with predictable releases.

## Considered options

1. **Phaser 3** — battle-tested 2D engine with first-class TS, MIT-licensed [examples repo](https://github.com/phaserjs/examples).
2. **PixiJS** — lower-level renderer; more flexible but no game loop / scene system.
3. **Excalibur** — TS-native, smaller community.
4. **Three.js / Babylon.js** — 3D-first; overkill for 2D.
5. **Hand-roll on Canvas 2D / WebGL** — no.

## Decision outcome

Chosen **option 1 — Phaser 3**.

- TypeScript types ship with the package as of 3.80; no `@types/phaser` needed.
- The [examples repo](https://github.com/phaserjs/examples) covers every common pattern (input, physics, tilemaps, audio, save state) under MIT.
- Phaser scenes are plain classes — they fit our "framework-agnostic library" rule cleanly.
- Tagged `scope:game` + `type:feature` (or `type:util` for shared engine code), the libs participate normally in `nx affected`.

### Consequences

- ➕ A single, well-known starting point for game projects.
- ➕ Game libs stay Angular-free → game-engine code is reusable in non-Angular hosts (Vite, Tauri).
- ➖ The starter's root `package.json` carries `phaser` even when no game is in flight. Acceptable while the workspace is empty; once a game lib exists, move `phaser` into that lib's package boundary so non-game apps don't pay the cost.
- ➖ 3D requirements eventually need a separate ADR (Three.js or Babylon).

## Pros and cons of the options

### Option 1 — Phaser 3

- ➕ Mature, well-documented, deep examples corpus.
- ➕ Active maintenance (regular releases).
- ➕ TS types in-tree.
- ➖ ~1.2 MB minified — non-trivial bundle if mis-imported into a non-game app.

### Option 2 — PixiJS

- ➕ Smaller, lower-level.
- ➖ Not a game framework — no scenes, no input manager, no physics. We'd build half of Phaser.

### Option 3 — Excalibur

- ➕ TS-native, clean API.
- ➖ Smaller community; fewer examples to copy from.

### Option 4 — Three.js / Babylon.js

- ➕ 3D capable.
- ➖ Overkill for 2D, and the API surface would tempt teams into 3D before we have UI tooling for it.

## Implementation plan

- [x] Add `phaser@^3.87.0` to root `package.json` dependencies.
- [x] Author `.ai/rules/games.md` with the convention (lib taxonomy, Angular bridge, performance rules, forbidden patterns).
- [x] Add a row for Phaser to `.ai/context/tech-stack.md` and `docs/technical/tech-stack.md`.
- [ ] When the first game lib lands, move `phaser` from root deps into `libs/game-engine/package.json` and update this ADR with the path.

## References

- Phaser docs: <https://phaser.io/>
- Phaser examples (MIT): <https://github.com/phaserjs/examples>
- Phaser API docs: <https://newdocs.phaser.io/>
- [`.ai/rules/games.md`](../../.ai/rules/games.md)
