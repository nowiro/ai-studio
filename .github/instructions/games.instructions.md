---
applyTo: 'apps/*-game/**/*.{ts,html,scss},libs/game-*/**/*.{ts,html,scss}'
description: Phaser 3 inside Angular — scenes, bridge, performance, tests
---

# Games (Copilot scope: `apps/*-game/`, `libs/game-*/`)

Full text: [`.ai/rules/games.md`](../../.ai/rules/games.md). ADR: [`docs/adr/0004-phaser-as-default-game-library.md`](../../docs/adr/0004-phaser-as-default-game-library.md).

> **Phaser 3** is the default 2D game framework. Use it for **actual games** — not as a fancy animation library.

## When to reach for Phaser

| Need                                                 | Use this                          |
| ---------------------------------------------------- | --------------------------------- |
| Sprite-based 2D game (puzzle, arcade, side-scroller) | **Phaser 3** scene + game lib     |
| Interactive UI widget that _looks_ game-like         | Angular component + CSS animation |
| 3D / WebGPU                                          | Out of scope — open an ADR        |
| Visualisation / chart                                | D3 or Chart.js                    |

## Project layout

```
apps/<game-name>-game/        # Angular shell hosting the canvas
libs/game-<name>/             # Phaser scenes + state (no Angular imports)
libs/game-engine/             # shared boot, asset loader, audio bus, save adapter
libs/game-<name>-ui/          # HUD components — Material + Tailwind
```

The game lib is framework-agnostic — it exports `createGame(parent, config?): Phaser.Game`. The app mounts it via a thin host component that bridges signals ↔ Phaser events.

## Angular ↔ Phaser bridge

- One scene per file: `<scene-name>.scene.ts`. Class extends `Phaser.Scene`. Constructor only sets the key.
- Game lib exposes a typed `GameApi` (`pause()`, `resume()`, `setVolume()`, `score$`).
- Angular side wraps `score$` with `toSignal()`; **never** subscribe Phaser to Angular change detection.

## Performance

- Target 60 fps on a mid-range laptop. Profile via `game.loop.actualFps`.
- Use `arcade` physics for most games; `matter` only when needed.
- Pool sprites for projectiles / enemies. Don't `new` per frame.
- Atlas textures (`TexturePacker`) over loose images.
- `setBlendMode` and shaders cost — measure first.

## Testing

- **Unit (Vitest)**: pure game-logic functions (collision, scoring, save serialisation). No `Phaser.Scene` needed.
- **Integration (Vitest + jsdom)**: scene transitions with `type: Phaser.HEADLESS`.
- **E2E (Playwright)**: load, key inputs, save/load round-trips. Use `data-testid="game-canvas"` for the host element.

## Forbidden

- Tailwind classes inside the canvas — utilities are for HUD/Angular UI only.
- Importing Angular APIs from `libs/game-*/` — keep the graph Angular-free there.
- Assets > 1 MB in the lib — host via `assets/` and lazy-load.
- Mutating Phaser's globals (`Phaser.GameObjects`, `Phaser.Scene` prototypes).
- `console.*` in scenes — use the project `LoggerService` via the `GameApi.log` callback.

## Cross-references

- Angular conventions → [`angular.instructions.md`](angular.instructions.md)
- Testing → [`testing.instructions.md`](testing.instructions.md)
- Nx layout → [`nx.instructions.md`](nx.instructions.md)
