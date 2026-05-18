import { describe, expect, it } from 'vitest';

import type { ActivePiece, Rotation } from '../types.js';
import { createEmptyBoard, lockPiece } from './board.js';
import { nextRotation, tryRotate } from './rotation.js';

describe('nextRotation', () => {
  it('cycles clockwise through 0/1/2/3', () => {
    const seq: Rotation[] = [0, 1, 2, 3];
    let r: Rotation = 0;
    for (const expected of seq) {
      expect(r).toBe(expected);
      r = nextRotation(r, 'cw');
    }
  });

  it('cycles counter-clockwise back through 0/3/2/1', () => {
    expect(nextRotation(0, 'ccw')).toBe(3);
    expect(nextRotation(3, 'ccw')).toBe(2);
    expect(nextRotation(2, 'ccw')).toBe(1);
    expect(nextRotation(1, 'ccw')).toBe(0);
  });
});

describe('tryRotate', () => {
  it('rotates a T-piece on an empty board', () => {
    const board = createEmptyBoard(10, 20);
    const piece: ActivePiece = { kind: 'T', rotation: 0, position: { x: 3, y: 0 } };
    const rotated = tryRotate(board, piece, 'cw');
    expect(rotated?.rotation).toBe(1);
  });

  it('rejects rotation when the rotated shape would collide', () => {
    // Horizontal I at (3, 4) occupies row 5 cols 3..6. Rotating CW pivots into
    // a vertical I at col 5 rows 4..7. We pre-lock an O across (5, 7..8) so the
    // bottom of the rotated I collides with locked cells.
    let board = createEmptyBoard(10, 10);
    board = lockPiece(board, { kind: 'O', rotation: 0, position: { x: 4, y: 6 } });
    const piece: ActivePiece = { kind: 'I', rotation: 0, position: { x: 3, y: 4 } };
    expect(tryRotate(board, piece, 'cw')).toBe(null);
  });

  it('does not change the piece reference on rejection', () => {
    let board = createEmptyBoard(10, 10);
    board = lockPiece(board, { kind: 'O', rotation: 0, position: { x: 4, y: 6 } });
    const piece: ActivePiece = { kind: 'I', rotation: 0, position: { x: 3, y: 4 } };
    expect(tryRotate(board, piece, 'cw')).toBe(null);
    expect(piece.rotation).toBe(0); // unchanged
  });
});
