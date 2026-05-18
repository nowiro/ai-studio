/**
 * Public types for the Tetris game library. Framework-agnostic — no Angular,
 * no canvas, no DOM. Bridges to the UI lib (`@ai-studio/game-tetris-ui`) via
 * read-only board snapshots + an event subscriber pattern (same model as
 * `@ai-studio/game-pong`).
 *
 * @see docs/ai-workflow/plans/2026-05-18-tetris-game.md
 */

/** The seven standard tetrominoes (Tetris Guideline). */
export type TetrominoKind = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

/**
 * Cell value on the playfield:
 *
 * - `0` — empty
 * - any `TetrominoKind` — the colour key of the piece that locked there.
 *
 * Storing the kind (rather than a colour string) keeps the logic pure and
 * lets the UI layer pick its own palette.
 */
export type CellValue = 0 | TetrominoKind;

/** A board row is a fixed-length tuple, but TS arrays are sufficient here. */
export type BoardRow = readonly CellValue[];

/** Read-only board snapshot (10 cols × 20 rows by default). */
export type BoardSnapshot = readonly BoardRow[];

/** Rotation index 0..3 (north, east, south, west). */
export type Rotation = 0 | 1 | 2 | 3;

/** Coordinate inside the playfield. `(0, 0)` is top-left. */
export interface CellPos {
  readonly x: number;
  readonly y: number;
}

/** A live falling piece. */
export interface ActivePiece {
  readonly kind: TetrominoKind;
  readonly rotation: Rotation;
  readonly position: CellPos;
}

/** Lifecycle status of the game. */
export type TetrisStatus = 'idle' | 'playing' | 'paused' | 'over';

/** Horizontal/vertical input from the player. */
export type PlayerMove = 'left' | 'right' | 'soft-drop' | 'hard-drop' | 'rotate-cw' | 'rotate-ccw' | 'hold';

/** Score line. Immutable on every update. */
export interface TetrisScore {
  readonly score: number;
  readonly lines: number;
  readonly level: number;
  /** Best score in this session (resets on page reload). */
  readonly highScore: number;
}

/** Discriminated union of events fired by `TetrisState`. */
export type TetrisEvent =
  | { readonly type: 'started' }
  | { readonly type: 'paused' }
  | { readonly type: 'resumed' }
  | { readonly type: 'piece-spawned'; readonly piece: ActivePiece; readonly next: readonly TetrominoKind[] }
  | { readonly type: 'piece-moved'; readonly piece: ActivePiece }
  | { readonly type: 'piece-locked'; readonly piece: ActivePiece }
  | { readonly type: 'lines-cleared'; readonly rows: readonly number[]; readonly count: 1 | 2 | 3 | 4 }
  | { readonly type: 'score-changed'; readonly score: TetrisScore }
  | { readonly type: 'level-up'; readonly level: number }
  | { readonly type: 'hold'; readonly held: TetrominoKind | null }
  | { readonly type: 'game-over'; readonly score: TetrisScore }
  | { readonly type: 'reset' };

/** Subscriber signature. */
export type TetrisEventHandler = (event: TetrisEvent) => void;

/** Tunable configuration. */
export interface TetrisConfig {
  /** Playfield width in cells. Guideline = 10. */
  readonly cols: number;
  /** Playfield height in cells. Guideline = 20. Top 2 rows are the "buffer" zone. */
  readonly rows: number;
  /** Score threshold per level (`lines / 10` floors → level). */
  readonly linesPerLevel: number;
  /** Number of "next" pieces visible in the preview queue. */
  readonly previewCount: number;
  /** Optional RNG seed for deterministic 7-bag (tests pass it; runtime omits). */
  readonly seed?: number;
}

/** Default config — Guideline-faithful. */
export const DEFAULT_TETRIS_CONFIG: TetrisConfig = {
  cols: 10,
  rows: 20,
  linesPerLevel: 10,
  previewCount: 3,
};
