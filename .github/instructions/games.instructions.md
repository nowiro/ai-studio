---
applyTo: 'apps/*-game/**/*.{ts,html,scss},libs/game-*/**/*.{ts,html,scss}'
description: Phaser 3 inside Angular — scenes, bridge, performance, tests
---

# Games (Copilot scope: `apps/*-game/`, `libs/game-*/`)

Pełny tekst: [`.ai/rules/games.md`](../../.ai/rules/games.md). ADR: [`docs/adr/0004-phaser-as-default-game-library.md`](../../docs/adr/0004-phaser-as-default-game-library.md).

> **Phaser 3** jest domyślnym 2D game framework. Używaj go dla **rzeczywistych gier** — nie jako fancy animation library.

## Kiedy sięgnąć po Phaser

| Potrzeba                                             | Użyj                              |
| ---------------------------------------------------- | --------------------------------- |
| Sprite-based 2D game (puzzle, arcade, side-scroller) | **Phaser 3** scene + game lib     |
| Interactive UI widget, który _wygląda_ game-like     | Angular component + CSS animation |
| 3D / WebGPU                                          | Out of scope — otwórz ADR         |
| Visualisation / chart                                | D3 lub Chart.js                   |

## Layout projektu

```
apps/<game-name>-game/        # Angular shell hostujący canvas
libs/game-<name>/             # Phaser scenes + state (no Angular imports)
libs/game-engine/             # shared boot, asset loader, audio bus, save adapter
libs/game-<name>-ui/          # HUD components — Material + Tailwind
```

Game lib jest framework-agnostic — eksportuje `createGame(parent, config?): Phaser.Game`. App montuje go przez cienki host komponent mostujący signals ↔ Phaser events.

## Most Angular ↔ Phaser

- Jedna scena per plik: `<scene-name>.scene.ts`. Klasa extends `Phaser.Scene`. Konstruktor ustawia tylko klucz.
- Game lib eksponuje typed `GameApi` (`pause()`, `resume()`, `setVolume()`, `score$`).
- Strona Angular wrappuje `score$` z `toSignal()`; **nigdy** nie subskrybuj Phaser do Angular change detection.

## Performance

- Target 60 fps na mid-range laptopie. Profiluj przez `game.loop.actualFps`.
- Używaj `arcade` physics dla większości gier; `matter` tylko gdy potrzebne.
- Pool sprites dla projectiles / enemies. Nie `new` per frame.
- Atlas textures (`TexturePacker`) zamiast loose images.
- `setBlendMode` i shaders kosztują — mierz najpierw.

## Testing

- **Unit (Vitest)**: pure game-logic functions (collision, scoring, save serialisation). Żadne `Phaser.Scene` niepotrzebne.
- **Integration (Vitest + jsdom)**: scene transitions z `type: Phaser.HEADLESS`.
- **E2E (Playwright)**: load, key inputs, save/load round-trips. Używaj `data-testid="game-canvas"` dla host element.

## Zabronione

- Klasy Tailwind wewnątrz canvas — utilities są tylko dla HUD/Angular UI.
- Importowanie API Angulara z `libs/game-*/` — trzymaj graph Angular-free tam.
- Assets > 1 MB w libie — hostuj przez `assets/` i lazy-load.
- Mutowanie globali Phaser (`Phaser.GameObjects`, prototype `Phaser.Scene`).
- `console.*` w scenes — używaj projektu `LoggerService` przez callback `GameApi.log`.

## Cross-references

- Konwencje Angular → [`angular.instructions.md`](angular.instructions.md)
- Testing → [`testing.instructions.md`](testing.instructions.md)
- Nx layout → [`nx.instructions.md`](nx.instructions.md)
