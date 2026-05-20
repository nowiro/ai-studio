---
id: rules.games
title: Reguły games — Phaser 3 wewnątrz Angular
type: rules
scope: games
priority: 2
version: 2.0.0
---

# Reguły games

> Phaser 3 jest **domyślnym 2D game framework** dla AI Studio. ADR: [`docs/adr/0004-phaser-as-default-game-library.md`](../../docs/adr/0004-phaser-as-default-game-library.md). Examples reference: <https://github.com/phaserjs/examples>.

## 1. Kiedy sięgnąć po Phaser

| Potrzeba                                             | Użyj                              |
| ---------------------------------------------------- | --------------------------------- |
| Sprite-based 2D game (puzzle, arcade, side-scroller) | **Phaser 3** scene + game lib     |
| Interactive UI widget, który _wygląda_ game-like     | Angular component + CSS animation |
| 3D / WebGPU                                          | Out of scope — otwórz ADR         |
| Visualisation / chart                                | D3 lub Chart.js — nie Phaser      |

**Phaser jest dla rzeczywistych gier.** Nie używaj go jako fancy animation library.

## 2. Layout projektu

```
apps/<game-name>-game/        # Angular shell hostujący canvas
libs/game-<name>/             # Phaser scenes + state (no Angular import)
libs/game-engine/             # shared boot, asset loader, audio bus, save adapter
libs/game-<name>-ui/          # HUD components — Angular Material + Tailwind
```

- **Game lib** jest framework-agnostic — eksportuje factory `createGame(parent: HTMLElement, config?: GameConfig): Phaser.Game`.
- **App** montuje grę wewnątrz Angular component i mostuje signals ↔ Phaser events.
- Taguj projekt `scope:game` + `type:feature` (lub `type:util` dla `game-engine`).

## 3. Most Angular ↔ Phaser

Używaj cienkiego host komponentu — nigdy nie pozwól Phaser scenes importować z libów Angular.

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

Game lib eksportuje `GameApi` z public surface (`pause()`, `resume()`, `setVolume()`, observable `score$`). Strona Angular wrappuje `score$` z `toSignal()`.

## 4. Scenes

- Jedna scena per plik: `<scene-name>.scene.ts`. Klasa extends `Phaser.Scene`. Konstruktor ustawia tylko klucz.
- Asset paths pod `libs/game-<name>/src/assets/`. Ładowane w `preload()`.
- State trzymany w **plain TS classes** lub `signal()` z `@angular/core` jeśli shared z Angular. **Nigdy** nie subskrybuj Phaser do change detection Angulara.
- Update loop: trzymaj `update(time, delta)` krótko (< 4 ms). Heavy work idzie do Phaser timers lub workers.

## 5. Performance

- Target 60 fps na mid-range laptopie. Profiluj z `game.loop.actualFps` Phaser.
- Używaj **physics** rozsądnie — `arcade` dla większości gier; `matter` tylko gdy potrzebne.
- Pool sprites dla projectiles / enemies. Nie `new` per frame.
- Atlas textures (`TexturePacker`) zamiast loose images.
- `setBlendMode` i shaders kosztują — mierz przed adopcją.

## 6. Testing

- **Unit (Vitest)**: pure game-logic functions (collision, scoring, save serialisation). `Phaser.Scene` niewymagane.
- **Integration (Vitest + jsdom)**: scene state transitions używając `Phaser.Game` z headless renderer (`type: Phaser.HEADLESS`).
- **E2E (Playwright)**: gra się ładuje, key inputs mapują na expected outcomes, save/load round-trips. Użyj `data-testid="game-canvas"` dla host element.

## 7. Zabronione

- ❌ Klasy `tailwindcss` wewnątrz canvas — Tailwind jest tylko dla otaczającego HUD/Angular UI.
- ❌ Importowanie API Angulara w `libs/game-*/` (lib graph zostaje Angular-free).
- ❌ Storing assets larger than 1 MB w libie — hostuj je przez `assets/` i lazy-load.
- ❌ Mutowanie globali Phaser (`Phaser.GameObjects`, prototype `Phaser.Scene`).
- ❌ `console.*` w scenes — używaj projektu `LoggerService` przez callback `GameApi.log`.

## 8. Examples z których ścinać

Oficjalne przykłady pod <https://github.com/phaserjs/examples> shipują MIT-licensed scenes dla każdego common pattern. Gdy portujesz:

1. Zacznij od najbliższego przykładu.
2. Strip CDN / inline imports — zamień na naszą lib structure.
3. Zamień ad-hoc state na nasz typed kontrakt `GameApi`.
4. Uruchom `pnpm lint:fix` i upewnij się, że żadne `any` nie przeżyło.

Reference index: <https://phaser.io/examples>.
