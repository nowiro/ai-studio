/**
 * Tetris runner — owns the playfield, the active piece, the bag, the score,
 * and the gravity timer. Frame-agnostic: the UI calls `tick(dtMs)` once per
 * animation frame. All transitions emit `TetrisEvent` to subscribers.
 *
 * Determinism is preserved by passing an explicit `seed` in the config —
 * tests get reproducible piece sequences without monkey-patching `Math.random`.
 *
 * Mirrors the design of `@ai-studio/game-pong`'s `PongState`.
 */
import { SevenBag } from '../logic/bag.js';
import { clearRows, createEmptyBoard, findFullRows, lockPiece } from '../logic/board.js';
import { dropDistance, dropToBottom, isValidPosition, tryMove } from '../logic/collision.js';
import { msPerRow } from '../logic/gravity.js';
import { tryRotate } from '../logic/rotation.js';
import { applyHardDrop, applyLineClear, applySoftDrop, initialScore } from '../logic/scoring.js';
import { ALL_KINDS, shapeCells, spawnPosition } from '../logic/tetrominoes.js';
import type {
  ActivePiece,
  BoardSnapshot,
  CellPos,
  PlayerMove,
  TetrisConfig,
  TetrisEvent,
  TetrisEventHandler,
  TetrisScore,
  TetrisStatus,
  TetrominoKind,
} from '../types.js';

export class TetrisState {
  private readonly handlers = new Set<TetrisEventHandler>();
  private readonly bag: SevenBag;

  private status: TetrisStatus = 'idle';
  private board: BoardSnapshot;
  private active: ActivePiece | null = null;
  private held: TetrominoKind | null = null;
  private holdLocked = false;
  private gravityAccumMs = 0;
  private score: TetrisScore = initialScore();

  constructor(private readonly config: TetrisConfig) {
    this.board = createEmptyBoard(config.cols, config.rows);
    this.bag = new SevenBag(config.seed);
  }

  // Event types reused often — extracted to constants to satisfy
  // sonarjs/no-duplicate-string and document the canonical event keys.
  private static readonly EVT_MOVED = 'piece-moved' as const;

  // ── public surface ─────────────────────────────────────────────────────

  /** Start a fresh round (resets board + score, spawns first piece). */
  start(): void {
    this.board = createEmptyBoard(this.config.cols, this.config.rows);
    this.score = initialScore(this.score.highScore);
    this.held = null;
    this.holdLocked = false;
    this.gravityAccumMs = 0;
    this.status = 'playing';
    this.emit({ type: 'started' });
    this.spawnNext();
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
    this.board = createEmptyBoard(this.config.cols, this.config.rows);
    this.active = null;
    this.held = null;
    this.holdLocked = false;
    this.gravityAccumMs = 0;
    this.status = 'idle';
    this.emit({ type: 'reset' });
  }

  /**
   * Advance the simulation by `dtMs` milliseconds. Repeatedly drops the piece
   * by one row whenever the gravity budget exceeds `msPerRow(level)`. Lock
   * happens at the end of the row in which the piece can no longer fall.
   */
  tick(dtMs: number): void {
    if (this.status !== 'playing' || !this.active) return;
    this.gravityAccumMs += Math.max(0, dtMs);
    const period = msPerRow(this.score.level);
    while (this.gravityAccumMs >= period) {
      this.gravityAccumMs -= period;
      const moved = tryMove(this.board, this.active, 0, 1);
      if (moved) {
        this.active = moved;
        this.emit({ type: TetrisState.EVT_MOVED, piece: this.active });
      } else {
        this.lockAndProgress();
        return;
      }
    }
  }

  /** Handle a player command. */
  input(move: PlayerMove): void {
    if (this.status !== 'playing' || !this.active) return;
    switch (move) {
      case 'left':
        this.tryShift(-1);
        return;
      case 'right':
        this.tryShift(1);
        return;
      case 'rotate-cw':
        this.applyRotation('cw');
        return;
      case 'rotate-ccw':
        this.applyRotation('ccw');
        return;
      case 'soft-drop':
        this.doSoftDrop();
        return;
      case 'hard-drop':
        this.doHardDrop();
        return;
      case 'hold':
        this.doHold();
        return;
    }
  }

  /** Subscribe; returns the unsubscribe function. */
  subscribe(handler: TetrisEventHandler): () => void {
    this.handlers.add(handler);
    return () => this.handlers.delete(handler);
  }

  /** Read-only board (rendered each frame). */
  getBoard(): BoardSnapshot {
    return this.board;
  }

  getActivePiece(): ActivePiece | null {
    return this.active;
  }

  /** Cells (in board coords) where the active piece would land if hard-dropped now. */
  getGhostCells(): readonly CellPos[] {
    if (!this.active) return [];
    const landing = dropToBottom(this.board, this.active);
    return shapeCells(landing.kind, landing.rotation).map((c) => ({
      x: landing.position.x + c.x,
      y: landing.position.y + c.y,
    }));
  }

  getStatus(): TetrisStatus {
    return this.status;
  }

  getScore(): TetrisScore {
    return this.score;
  }

  getHeld(): TetrominoKind | null {
    return this.held;
  }

  getNextQueue(): readonly TetrominoKind[] {
    return this.bag.peek(this.config.previewCount);
  }

  // ── internals ──────────────────────────────────────────────────────────

  private emit(event: TetrisEvent): void {
    for (const handler of this.handlers) handler(event);
  }

  private spawnNext(): void {
    const kind = this.bag.next();
    // `holdLocked` is intentionally NOT reset here — `doHold` also calls this
    // method, and we want the lock to persist until the next NATURAL
    // lock-and-spawn cycle. `lockAndProgress` resets it explicitly.
    const piece: ActivePiece = {
      kind,
      rotation: 0,
      position: spawnPosition(this.config.cols),
    };
    // If the spawn position itself collides, the game is over.
    if (!isValidPosition(this.board, piece)) {
      this.active = null;
      this.status = 'over';
      this.emit({ type: 'game-over', score: this.score });
      return;
    }
    this.active = piece;
    this.emit({ type: 'piece-spawned', piece, next: this.bag.peek(this.config.previewCount) });
  }

  private tryShift(dx: number): void {
    if (!this.active) return;
    const moved = tryMove(this.board, this.active, dx, 0);
    if (moved) {
      this.active = moved;
      this.emit({ type: TetrisState.EVT_MOVED, piece: this.active });
    }
  }

  private applyRotation(direction: 'cw' | 'ccw'): void {
    if (!this.active) return;
    const rotated = tryRotate(this.board, this.active, direction);
    if (rotated) {
      this.active = rotated;
      this.emit({ type: TetrisState.EVT_MOVED, piece: this.active });
    }
  }

  private doSoftDrop(): void {
    if (!this.active) return;
    const moved = tryMove(this.board, this.active, 0, 1);
    if (moved) {
      this.active = moved;
      this.score = applySoftDrop(this.score, 1);
      this.emit({ type: TetrisState.EVT_MOVED, piece: this.active });
      this.emit({ type: 'score-changed', score: this.score });
    } else {
      this.lockAndProgress();
    }
  }

  private doHardDrop(): void {
    if (!this.active) return;
    const distance = dropDistance(this.board, this.active);
    const landing = dropToBottom(this.board, this.active);
    this.active = landing;
    this.score = applyHardDrop(this.score, distance);
    this.emit({ type: TetrisState.EVT_MOVED, piece: this.active });
    if (distance > 0) this.emit({ type: 'score-changed', score: this.score });
    this.lockAndProgress();
  }

  private doHold(): void {
    if (!this.active || this.holdLocked) return;
    const currentKind = this.active.kind;
    const restoring = this.held;
    this.held = currentKind;
    this.holdLocked = true; // cannot hold again until next spawn
    this.emit({ type: 'hold', held: this.held });
    if (restoring) {
      const piece: ActivePiece = {
        kind: restoring,
        rotation: 0,
        position: spawnPosition(this.config.cols),
      };
      if (!isValidPosition(this.board, piece)) {
        this.active = null;
        this.status = 'over';
        this.emit({ type: 'game-over', score: this.score });
        return;
      }
      this.active = piece;
      this.emit({ type: 'piece-spawned', piece, next: this.bag.peek(this.config.previewCount) });
    } else {
      // No previously held piece — just draw a fresh one and continue.
      this.spawnNext();
    }
  }

  private lockAndProgress(): void {
    if (!this.active) return;
    const locked = this.active;
    this.board = lockPiece(this.board, locked);
    this.holdLocked = false; // natural lock — hold becomes available again
    this.emit({ type: 'piece-locked', piece: locked });
    const fullRows = findFullRows(this.board);
    if (fullRows.length > 0) {
      const count = fullRows.length as 1 | 2 | 3 | 4;
      this.board = clearRows(this.board, fullRows);
      const prevLevel = this.score.level;
      this.score = applyLineClear(this.score, count, this.config.linesPerLevel);
      this.emit({ type: 'lines-cleared', rows: fullRows, count });
      this.emit({ type: 'score-changed', score: this.score });
      if (this.score.level > prevLevel) {
        this.emit({ type: 'level-up', level: this.score.level });
      }
    }
    this.active = null;
    this.spawnNext();
  }
}

/** Type-check helper for tests — guarantees the runtime kind enum is exhaustive. */
export const _ALL_KINDS = ALL_KINDS;
