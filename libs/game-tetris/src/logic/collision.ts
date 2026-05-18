/**
 * Collision predicates — pure functions over a board snapshot and a piece.
 *
 * "Valid" means: every filled cell of the piece is either above the field
 * (`y < 0`, allowed for the buffer/spawn zone) OR inside bounds AND landing
 * on an empty cell.
 */
import type { ActivePiece, BoardSnapshot } from '../types.js';
import { shapeCells } from './tetrominoes.js';

/** True if the piece's cells all fit on the board with no overlap. */
export function isValidPosition(board: BoardSnapshot, piece: ActivePiece): boolean {
  const cells = shapeCells(piece.kind, piece.rotation);
  const cols = board[0]?.length ?? 0;
  const rows = board.length;
  for (const cell of cells) {
    const x = piece.position.x + cell.x;
    const y = piece.position.y + cell.y;
    if (x < 0 || x >= cols) return false;
    if (y >= rows) return false;
    if (y < 0) continue; // above field is allowed (spawn / buffer)
    const row = board[y];
    if (!row) return false;
    if (row[x] !== 0) return false;
  }
  return true;
}

/**
 * Move a piece by (`dx`, `dy`) if the result is valid; otherwise return null.
 */
export function tryMove(board: BoardSnapshot, piece: ActivePiece, dx: number, dy: number): ActivePiece | null {
  const next: ActivePiece = {
    ...piece,
    position: { x: piece.position.x + dx, y: piece.position.y + dy },
  };
  return isValidPosition(board, next) ? next : null;
}

/**
 * Drop the piece as far as possible (used by hard-drop and to compute the
 * "ghost" preview). Returns the resting piece (one row above the first
 * invalid position).
 */
export function dropToBottom(board: BoardSnapshot, piece: ActivePiece): ActivePiece {
  let current = piece;
  for (;;) {
    const moved = tryMove(board, current, 0, 1);
    if (!moved) return current;
    current = moved;
  }
}

/** Number of cells between the piece and where it would lock if dropped now. */
export function dropDistance(board: BoardSnapshot, piece: ActivePiece): number {
  const landing = dropToBottom(board, piece);
  return landing.position.y - piece.position.y;
}
