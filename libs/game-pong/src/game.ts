/**
 * `createGame` factory — composes a Phaser game with `PongState` and returns
 * a framework-agnostic `GameApi`. The Angular host bridges this to signals.
 * @see docs/analytical/specs/2026-05-08-pong-game/plan.md § Public API surface
 */
import Phaser from 'phaser';

import { BootScene } from './scenes/boot.scene.js';
import { PlayScene } from './scenes/play.scene.js';
import { PongState } from './state/pong-state.js';
import {
  DEFAULT_PONG_CONFIG,
  type GameApi,
  type PongConfig,
  type PongEventHandler,
  type PongScore,
  type PongStatus,
} from './types.js';

/**
 * Mount a Pong game inside `parent` and return its public API.
 * @param parent host element to receive the canvas
 * @param overrides optional partial configuration; merged onto {@link DEFAULT_PONG_CONFIG}
 */
export function createGame(parent: HTMLElement, overrides: Partial<PongConfig> = {}): GameApi {
  const config: PongConfig = { ...DEFAULT_PONG_CONFIG, ...overrides };
  const state = new PongState(config);
  const handlers = new Set<PongEventHandler>();

  const emit: PongEventHandler = (event) => {
    for (const handler of handlers) handler(event);
  };

  const phaserConfig: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: config.width,
    height: config.height,
    parent,
    backgroundColor: '#0b1020',
    scene: [BootScene, PlayScene],
    physics: { default: 'arcade' },
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    audio: { disableWebAudio: false },
  };

  const game = new Phaser.Game(phaserConfig);

  // Pass init data to PlayScene once it boots.
  game.events.once(Phaser.Core.Events.READY, () => {
    game.scene.start('play', { config, state, emit });
  });

  const api: GameApi = {
    start: () => state.start(),
    pause: () => state.pause(),
    resume: () => state.resume(),
    reset: () => state.reset(),
    mute: (muted: boolean) => {
      game.sound.mute = muted;
    },
    setVolume: (volume: number) => {
      const clamped = Number.isFinite(volume) ? Math.max(0, Math.min(1, volume)) : 0;
      game.sound.volume = clamped;
      game.sound.mute = clamped === 0;
    },
    setPlayerSpeedMultiplier: (multiplier: number) => {
      state.setPlayerSpeedMultiplier(multiplier);
    },
    subscribe: (handler: PongEventHandler) => {
      handlers.add(handler);
      return () => handlers.delete(handler);
    },
    score: (): PongScore => state.getScore(),
    status: (): PongStatus => state.getStatus(),
    destroy: () => {
      handlers.clear();
      game.destroy(true);
    },
  };

  return api;
}
