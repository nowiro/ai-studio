/**
 * Public API for the Tetris game library. Framework-agnostic.
 * @packageDocumentation
 */
export {
  DEFAULT_TETRIS_CONFIG,
  type ActivePiece,
  type BoardRow,
  type BoardSnapshot,
  type CellPos,
  type CellValue,
  type PlayerMove,
  type Rotation,
  type TetrisConfig,
  type TetrisEvent,
  type TetrisEventHandler,
  type TetrisScore,
  type TetrisStatus,
  type TetrominoKind,
} from './types.js';
export { TetrisState } from './state/tetris-state.js';
export { ALL_KINDS, TETROMINOES, shapeCells, spawnPosition } from './logic/tetrominoes.js';
export {
  clearRows,
  countFilledCells,
  createEmptyBoard,
  distinctKindsOnBoard,
  findFullRows,
  isTopOut,
  lockPiece,
} from './logic/board.js';
export { isValidPosition, tryMove, dropToBottom, dropDistance } from './logic/collision.js';
export { nextRotation, tryRotate } from './logic/rotation.js';
export { msPerRow } from './logic/gravity.js';
export { applyLineClear, applySoftDrop, applyHardDrop, initialScore } from './logic/scoring.js';
export { SevenBag } from './logic/bag.js';
