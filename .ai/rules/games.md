---
id: rules.games
title: Games rules — Phaser 3 inside Angular
type: rules
scope: games
priority: 2
version: 1.0.0
---

# Games rules

> Phaser 3 is the **default 2D game framework** for AI Studio. ADR: [`docs/adr/0004-phaser-as-default-game-library.md`](../../docs/adr/0004-phaser-as-default-game-library.md). Examples reference: <https://github.com/phaserjs/examples>.

## 1. When to reach for Phaser

| Need                                                 | Use this                          |
| ---------------------------------------------------- | --------------------------------- |
| Sprite-based 2D game (puzzle, arcade, side-scroller) | **Phaser 3** scene + game lib     |
| Interactive UI widget that _looks_ game-like         | Angular component + CSS animation |
| 3D / WebGPU                                          | Out of scope — open an ADR        |
| Visualisation / chart                                | D3 or Chart.js — not Phaser       |

**Phaser is for actual games.** Don't use it as a fancy animation library.

## 2. Project layout

```
apps/<game-name>-game/        # Angular shell hosting the canvas
libs/game-<name>/             # Phaser scenes + state (no Angular import)
libs/game-engine/             # shared boot, asset loader, audio bus, save adapter
libs/game-<name>-ui/          # HUD components — Angular Material + Tailwind
```

- The **game lib** is framework-agnostic — exports a `createGame(parent: HTMLElement, config?: GameConfig): Phaser.Game` factory.
- The **app** mounts the game inside an Angular component and bridges signals ↔ Phaser events.
- Tag the project `scope:game` + `type:feature` (or `type:util` for `game-engine`).

## 3. Angular ↔ Phaser bridge

Use a thin host component — never let Phaser scenes import from Angular libs.

```ts
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { createGame, type GameApi } from '@ai-studio/game-asteroids';

@Component({
  selector: 'ais-asteroids-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block h-screen bg-surface' },
  template: `
    <div
      class="h-full w-full"
      #canvas
      data-testid="game-canvas"
    ></div>
  `,
})
export class AsteroidsHostComponent implements AfterViewInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly canvas = viewChild.required<ElementRef<HTMLDivElement>>('canvas');

  private api?: GameApi;

  ngAfterViewInit(): void {
    this.api = createGame(this.canvas().nativeElement);
    this.destroyRef.onDestroy(() => this.api?.destroy());
  }
}
```

The game lib exports `GameApi` with the public surface (`pause()`, `resume()`, `setVolume()`, observable `score$`). The Angular side wraps `score$` with `toSignal()`.

## 4. Scenes

- One scene per file: `<scene-name>.scene.ts`. Class extends `Phaser.Scene`. Constructor only sets the key.
- Asset paths under `libs/game-<name>/src/assets/`. Loaded in `preload()`.
- State held in **plain TS classes** or `signal()` from `@angular/core` if shared with Angular. **Never** subscribe Phaser to Angular's change detection.
- Update loop: keep `update(time, delta)` short (< 4 ms). Heavy work goes to Phaser timers or workers.

## 5. Performance

- Target 60 fps on a mid-range laptop. Profile with Phaser's `game.loop.actualFps`.
- Use **physics** judiciously — `arcade` for most games; `matter` only when needed.
- Pool sprites for projectiles / enemies. Don't `new` per frame.
- Atlas textures (`TexturePacker`) over loose images.
- `setBlendMode` and shaders cost — measure before adopting.

## 6. Testing

- **Unit (Vitest)**: pure game-logic functions (collision, scoring, save serialisation). `Phaser.Scene` not required.
- **Integration (Vitest + jsdom)**: scene state transitions using a `Phaser.Game` with the headless renderer (`type: Phaser.HEADLESS`).
- **E2E (Playwright)**: game loads, key inputs map to expected outcomes, save/load round-trips. Use `data-testid="game-canvas"` for the host element.

## 7. Forbidden

- ❌ `tailwindcss` classes inside the canvas — Tailwind is for the surrounding HUD/Angular UI only.
- ❌ Importing Angular APIs in `libs/game-*/` (lib graph stays Angular-free).
- ❌ Storing assets larger than 1 MB in the lib — host them via `assets/` and lazy-load.
- ❌ Mutating Phaser's globals (`Phaser.GameObjects`, `Phaser.Scene` prototypes).
- ❌ `console.*` in scenes — use the project `LoggerService` via the `GameApi.log` callback.

## 8. Examples to crib from

The official examples at <https://github.com/phaserjs/examples> ship MIT-licensed scenes for every common pattern. When porting:

1. Start from the closest example.
2. Strip CDN / inline imports — replace with our lib structure.
3. Replace ad-hoc state with our typed `GameApi` contract.
4. Run `pnpm lint:fix` and ensure no `any` survives.

Reference index: <https://phaser.io/examples>.
