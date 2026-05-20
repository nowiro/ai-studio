/**
 * Play scene — owns the canvas-side rendering and the input loop. Game logic
 * lives in `PongState`; this scene only translates inputs and draws snapshots.
 */
import Phaser from 'phaser';

import type { PongState } from '../state/pong-state.js';
import type { PlayerInput, PongConfig, PongEvent, PongEventHandler } from '../types.js';

const NOOP_EMIT: PongEventHandler = () => undefined;

function readPlayerInput(
  cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined,
  keyW: Phaser.Input.Keyboard.Key | undefined,
  keyS: Phaser.Input.Keyboard.Key | undefined,
  pointer: Phaser.Input.Pointer | undefined,
  canvasHeight: number,
): PlayerInput {
  // Keyboard wins so power users keep precision input on desktop.
  if (cursors?.up.isDown || keyW?.isDown) return 'up';
  if (cursors?.down.isDown || keyS?.isDown) return 'down';
  // Pointer / touch fallback — top half = up, bottom half = down. `isDown`
  // is true for both mouse-drag and any active touch, so this works on
  // mobile without a separate code path.
  if (pointer?.isDown) {
    return pointer.y < canvasHeight / 2 ? 'up' : 'down';
  }
  return 'idle';
}

export const SCENE_PLAY = 'play';

interface PlaySceneInit {
  readonly config: PongConfig;
  readonly state: PongState;
  readonly emit: PongEventHandler;
}

export class PlayScene extends Phaser.Scene {
  private config!: PongConfig;
  private state!: PongState;
  private externalEmit: PongEventHandler = NOOP_EMIT;

  private playerRect!: Phaser.GameObjects.Rectangle;
  private cpuRect!: Phaser.GameObjects.Rectangle;
  private ballRect!: Phaser.GameObjects.Rectangle;

  private keyW?: Phaser.Input.Keyboard.Key;
  private keyS?: Phaser.Input.Keyboard.Key;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private unsubscribe?: () => void;

  constructor() {
    super(SCENE_PLAY);
  }

  init(data: PlaySceneInit): void {
    this.config = data.config;
    this.state = data.state;
    this.externalEmit = data.emit;
  }

  create(): void {
    const { width, height, paddleHeight, paddleWidth, ballSize } = this.config;
    this.cameras.main.setBackgroundColor('#0b1020');

    // Centre line
    const centre = this.add.rectangle(width / 2, height / 2, 2, height - 16, 0xffffff, 0.15);
    centre.setOrigin(0.5);

    this.playerRect = this.add.rectangle(0, 0, paddleWidth, paddleHeight, 0xffffff).setOrigin(0);
    this.cpuRect = this.add.rectangle(0, 0, paddleWidth, paddleHeight, 0xffffff).setOrigin(0);
    this.ballRect = this.add.rectangle(0, 0, ballSize, ballSize, 0xffffff).setOrigin(0);

    if (this.input.keyboard) {
      this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
      this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
      this.cursors = this.input.keyboard.createCursorKeys();
      this.input.keyboard.on('keydown-ESC', () => this.togglePause());
      this.input.keyboard.on('keydown-P', () => this.togglePause());
    }

    this.unsubscribe = this.state.subscribe((event: PongEvent) => this.externalEmit(event));
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.unsubscribe?.());
  }

  override update(_time: number, delta: number): void {
    const input = readPlayerInput(this.cursors, this.keyW, this.keyS, this.input.activePointer, this.config.height);
    this.state.setPlayerInput(input);
    this.state.tick(delta);

    const ball = this.state.getBall();
    const { player, cpu } = this.state.getPaddles();
    this.playerRect.setPosition(player.x, player.y);
    this.cpuRect.setPosition(cpu.x, cpu.y);
    this.ballRect.setPosition(ball.x, ball.y);
  }

  private togglePause(): void {
    if (this.state.getStatus() === 'playing') this.state.pause();
    else if (this.state.getStatus() === 'paused') this.state.resume();
  }
}
