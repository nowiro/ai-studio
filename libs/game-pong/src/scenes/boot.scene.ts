/**
 * Boot scene — loads inline placeholder textures and transitions to play.
 * Real game would preload sprites/audio here.
 */
import Phaser from 'phaser';

export const SCENE_BOOT = 'boot';
export const SCENE_PLAY = 'play';

export class BootScene extends Phaser.Scene {
  constructor() {
    super(SCENE_BOOT);
  }

  // No preload needed — PlayScene renders geometric primitives via
  // `this.add.rectangle(...)` which draws coloured polys directly. The earlier
  // inline `textures.generate('white', ...)` was dead code (the rectangles
  // never referenced the 'white' texture) and `TextureManager.generate` was
  // removed in Phaser 4, so this scene jumps straight to play.

  create(): void {
    this.scene.start(SCENE_PLAY);
  }
}
