/**
 * Rotation helper — SRS-lite (no wall kicks v1). Tries the new orientation
 * at the same `(x, y)`; if it collides, rejects (returns `null`).
 *
 * Future v2 enhancement: implement the JLSTZ + I wall-kick offset tables
 * from the SRS spec (4 kick offsets per rotation, tested in order).
 */
import type { ActivePiece, BoardSnapshot, Rotation } from '../types.js';
import { isValidPosition } from './collision.js';

/** Next rotation index, cycling through 0/1/2/3. */
export function nextRotation(rotation: Rotation, direction: 'cw' | 'ccw'): Rotation {
  if (direction === 'cw') return ((rotation + 1) % 4) as Rotation;
  return ((rotation + 3) % 4) as Rotation; // ccw = +3 mod 4
}

/** Attempt to rotate the piece, returning the new piece or `null`. */
export function tryRotate(board: BoardSnapshot, piece: ActivePiece, direction: 'cw' | 'ccw'): ActivePiece | null {
  const rotated: ActivePiece = { ...piece, rotation: nextRotation(piece.rotation, direction) };
  return isValidPosition(board, rotated) ? rotated : null;
}
