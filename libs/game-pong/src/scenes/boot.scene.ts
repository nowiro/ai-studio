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

  preload(): void {
    // Inline 1x1 white texture used for paddles and ball — keeps the lib
    // free of binary assets while still letting Phaser render rectangles.
    this.textures.generate('white', {
      data: ['1'],
      pixelWidth: 1,
      palette: {
        0: '#fff',
        1: '#fff',
        2: '#fff',
        3: '#fff',
        4: '#fff',
        5: '#fff',
        6: '#fff',
        7: '#fff',
        8: '#fff',
        9: '#fff',
        A: '#fff',
        B: '#fff',
        C: '#fff',
        D: '#fff',
        E: '#fff',
        F: '#fff',
      },
    });
  }

  create(): void {
    this.scene.start(SCENE_PLAY);
  }
}
