/**
 * Pure functions for the playfield matrix. The board is a 2D array stored
 * row-major: `board[y][x]`. We deliberately keep these as `readonly` outputs
 * so consumers can't mutate state behind `TetrisState`'s back.
 */
import type { ActivePiece, BoardRow, BoardSnapshot, CellValue, TetrominoKind } from '../types.js';
import { shapeCells } from './tetrominoes.js';

/** Build a fresh empty board. */
export function createEmptyBoard(cols: number, rows: number): BoardSnapshot {
  return Array.from({ length: rows }, () => Array.from({ length: cols }, (): CellValue => 0));
}

/**
 * Lock a piece into the board. Cells outside the visible area (`y < 0`) are
 * silently dropped — the caller is responsible for detecting topping out
 * via `isTopOut` before locking.
 */
export function lockPiece(board: BoardSnapshot, piece: ActivePiece): BoardSnapshot {
  const cells = shapeCells(piece.kind, piece.rotation);
  const next: CellValue[][] = board.map((row) => row.slice());
  for (const cell of cells) {
    const x = piece.position.x + cell.x;
    const y = piece.position.y + cell.y;
    if (y < 0 || y >= board.length) continue;
    const targetRow = next[y];
    if (!targetRow) continue;
    if (x < 0 || x >= targetRow.length) continue;
    targetRow[x] = piece.kind;
  }
  return next;
}

/**
 * Find rows that are completely filled. Returns top-to-bottom indices.
 */
export function findFullRows(board: BoardSnapshot): readonly number[] {
  const full: number[] = [];
  for (let y = 0; y < board.length; y++) {
    const row = board[y];
    if (!row) continue;
    if (row.every((cell) => cell !== 0)) full.push(y);
  }
  return full;
}

/**
 * Clear the given rows and shift everything above down. Returns the new
 * board snapshot.
 */
export function clearRows(board: BoardSnapshot, rows: readonly number[]): BoardSnapshot {
  if (rows.length === 0) return board;
  const cols = board[0]?.length ?? 0;
  const toRemove = new Set(rows);
  const kept: BoardRow[] = [];
  for (let y = 0; y < board.length; y++) {
    if (!toRemove.has(y)) {
      const row = board[y];
      if (row) kept.push(row);
    }
  }
  // Prepend empty rows so the total height stays the same.
  const missing = board.length - kept.length;
  const emptyRows: BoardRow[] = Array.from({ length: missing }, () => Array.from({ length: cols }, (): CellValue => 0));
  return [...emptyRows, ...kept];
}

/**
 * "Top out" detection — any cell of the spawned/landed piece sits *above* the
 * visible playfield (`y < 0`) AND there's a collision in the visible part too.
 * Simpler version: piece can't move *down* from its spawn position.
 *
 * The caller has already attempted to move the piece; this just checks
 * whether the piece overlaps with locked cells in the visible board.
 */
export function isTopOut(board: BoardSnapshot, piece: ActivePiece): boolean {
  // Any filled cell of the piece at y < 0 means we've spilled above the field.
  const cells = shapeCells(piece.kind, piece.rotation);
  return cells.some((cell) => piece.position.y + cell.y < 0 && board[0]?.every((c) => c === 0) === false);
}

/** Helper for tests/UI: count filled cells in the board. */
export function countFilledCells(board: BoardSnapshot): number {
  let count = 0;
  for (const row of board) {
    for (const cell of row) {
      if (cell !== 0) count++;
    }
  }
  return count;
}

/** Helper for tests/UI: get all distinct piece kinds present on the board. */
export function distinctKindsOnBoard(board: BoardSnapshot): readonly TetrominoKind[] {
  const kinds = new Set<TetrominoKind>();
  for (const row of board) {
    for (const cell of row) {
      if (cell !== 0) kinds.add(cell);
    }
  }
  return [...kinds];
}
