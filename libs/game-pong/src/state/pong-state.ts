/**
 * Pong game state — pure TypeScript class with deterministic `tick(dtMs)`.
 * Emits {@link PongEvent} on every transition. No Phaser, no Angular.
 * @see docs/analytical/specs/2026-05-08-pong-game/plan.md § Module taxonomy
 */
import { nextAiVelocity } from '../logic/ai.js';
import { type Ball, type Paddle, reflectBallOnPaddle, reflectBallOnWall } from '../logic/collision.js';
import { applyScore, isWinningScore, serveDirection } from '../logic/scoring.js';
import type { PlayerInput, PongConfig, PongEvent, PongEventHandler, PongScore, PongStatus, Side } from '../types.js';

/** Translate player input into a vertical velocity. */
function playerVelocity(input: PlayerInput, speed: number): number {
  if (input === 'up') return -speed;
  if (input === 'down') return speed;
  return 0;
}

/** Internal mutable shape — never exposed publicly. */
interface MutableBall {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
}

interface MutablePaddle {
  x: number;
  y: number;
  width: number;
  height: number;
  vy: number;
}

export class PongState {
  private readonly handlers = new Set<PongEventHandler>();

  private status: PongStatus = 'idle';
  private score: PongScore = { player: 0, cpu: 0 };
  private playerInput: PlayerInput = 'idle';

  private readonly ball: MutableBall;
  private readonly playerPaddle: MutablePaddle;
  private readonly cpuPaddle: MutablePaddle;

  constructor(private readonly config: PongConfig) {
    const cy = (config.height - config.paddleHeight) / 2;
    this.playerPaddle = {
      x: 16,
      y: cy,
      width: config.paddleWidth,
      height: config.paddleHeight,
      vy: 0,
    };
    this.cpuPaddle = {
      x: config.width - 16 - config.paddleWidth,
      y: cy,
      width: config.paddleWidth,
      height: config.paddleHeight,
      vy: 0,
    };
    this.ball = this.serveBall(-1);
  }

  // --- public surface --------------------------------------------------------

  start(): void {
    this.score = { player: 0, cpu: 0 };
    this.resetPaddles();
    Object.assign(this.ball, this.serveBall(this.randomServe()));
    this.status = 'playing';
    this.emit({ type: 'started' });
  }

  pause(): void {
    if (this.status !== 'playing') return;
    this.status = 'paused';
    this.emit({ type: 'paused' });
  }

  resume(): void {
    if (this.status !== 'paused') return;
    this.status = 'playing';
    this.emit({ type: 'resumed' });
  }

  reset(): void {
    this.score = { player: 0, cpu: 0 };
    this.resetPaddles();
    Object.assign(this.ball, this.serveBall(-1));
    this.status = 'idle';
    this.emit({ type: 'reset' });
  }

  setPlayerInput(input: PlayerInput): void {
    this.playerInput = input;
  }

  subscribe(handler: PongEventHandler): () => void {
    this.handlers.add(handler);
    return () => this.handlers.delete(handler);
  }

  getScore(): PongScore {
    return this.score;
  }

  getStatus(): PongStatus {
    return this.status;
  }

  /** Read-only ball view (snapshot). */
  getBall(): Ball {
    return { x: this.ball.x, y: this.ball.y, vx: this.ball.vx, vy: this.ball.vy, size: this.ball.size };
  }

  /** Read-only paddle views (snapshots). */
  getPaddles(): { player: Paddle; cpu: Paddle } {
    return {
      player: this.snapshotPaddle(this.playerPaddle),
      cpu: this.snapshotPaddle(this.cpuPaddle),
    };
  }

  /**
   * Advance simulation by `dtMs` milliseconds. No-op when paused or idle.
   * Returns `true` if any state-changing event fired during this tick.
   */
  tick(dtMs: number): boolean {
    if (this.status !== 'playing') return false;
    const dt = Math.max(0, dtMs) / 1000;
    let dirty = false;

    // Player paddle
    const pVy = playerVelocity(this.playerInput, this.config.paddleSpeed);
    this.playerPaddle.vy = pVy;
    this.playerPaddle.y = this.clampPaddle(this.playerPaddle.y + pVy * dt);

    // CPU paddle
    const aiVy = nextAiVelocity(
      this.cpuPaddle.y,
      this.cpuPaddle.height,
      this.ball.y + this.ball.size / 2,
      this.config.aiSpeed,
    );
    this.cpuPaddle.vy = aiVy;
    this.cpuPaddle.y = this.clampPaddle(this.cpuPaddle.y + aiVy * dt);

    // Ball motion
    this.ball.x += this.ball.vx * dt;
    this.ball.y += this.ball.vy * dt;

    // Wall collisions
    const wall = reflectBallOnWall(this.ball, this.config.height);
    if (wall.hit) {
      this.ball.x = wall.ball.x;
      this.ball.y = wall.ball.y;
      this.ball.vx = wall.ball.vx;
      this.ball.vy = wall.ball.vy;
      this.emit({ type: 'wall-hit', side: wall.hit });
      dirty = true;
    }

    // Paddle collisions
    const paddleHit = this.checkPaddleHits();
    if (paddleHit) {
      this.emit({ type: 'paddle-hit', side: paddleHit });
      dirty = true;
    }

    // Goal detection
    if (this.ball.x + this.ball.size <= 0) {
      this.handleGoal('cpu');
      dirty = true;
    } else if (this.ball.x >= this.config.width) {
      this.handleGoal('player');
      dirty = true;
    }

    return dirty;
  }

  // --- internals -------------------------------------------------------------

  private snapshotPaddle(p: MutablePaddle): Paddle {
    return { x: p.x, y: p.y, width: p.width, height: p.height };
  }

  private resetPaddles(): void {
    const cy = (this.config.height - this.config.paddleHeight) / 2;
    this.playerPaddle.y = cy;
    this.playerPaddle.vy = 0;
    this.cpuPaddle.y = cy;
    this.cpuPaddle.vy = 0;
  }

  private clampPaddle(y: number): number {
    return Math.max(0, Math.min(this.config.height - this.config.paddleHeight, y));
  }

  private serveBall(direction: number): MutableBall {
    return {
      x: (this.config.width - this.config.ballSize) / 2,
      y: (this.config.height - this.config.ballSize) / 2,
      vx: this.config.ballSpeed * Math.sign(direction || -1),
      vy: 0,
      size: this.config.ballSize,
    };
  }

  /** Pseudo-random serve direction; deterministic given seed via Math.random. */
  private randomServe(): 1 | -1 {
    // Game serve direction is gameplay variety, not a security boundary.
    // eslint-disable-next-line sonarjs/pseudo-random
    return Math.random() < 0.5 ? -1 : 1;
  }

  private checkPaddleHits(): Side | null {
    const reflectedPlayer = reflectBallOnPaddle(this.snapshotBall(), this.snapshotPaddle(this.playerPaddle));
    if (reflectedPlayer !== this.snapshotBall() && reflectedPlayer.vx > 0) {
      Object.assign(this.ball, reflectedPlayer);
      return 'player';
    }
    const reflectedCpu = reflectBallOnPaddle(this.snapshotBall(), this.snapshotPaddle(this.cpuPaddle));
    if (reflectedCpu !== this.snapshotBall() && reflectedCpu.vx < 0) {
      Object.assign(this.ball, reflectedCpu);
      return 'cpu';
    }
    return null;
  }

  private snapshotBall(): Ball {
    return { x: this.ball.x, y: this.ball.y, vx: this.ball.vx, vy: this.ball.vy, size: this.ball.size };
  }

  private handleGoal(scoredBy: Side): void {
    this.score = applyScore(this.score, scoredBy);
    this.emit({ type: 'score', score: this.score, scoredBy });

    const winner = isWinningScore(this.score, this.config.winScore);
    if (winner) {
      this.status = 'over';
      this.emit({ type: 'game-over', winner, score: this.score });
      return;
    }

    Object.assign(this.ball, this.serveBall(serveDirection(scoredBy)));
    this.resetPaddles();
  }

  private emit(event: PongEvent): void {
    for (const handler of this.handlers) {
      handler(event);
    }
  }
}
