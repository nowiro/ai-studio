import { describe, expect, it } from 'vitest';

import type { ActivePiece } from '../types.js';
import { createEmptyBoard, lockPiece } from './board.js';
import { dropDistance, dropToBottom, isValidPosition, tryMove } from './collision.js';

describe('isValidPosition', () => {
  it('accepts the standard spawn position on an empty board', () => {
    const board = createEmptyBoard(10, 20);
    const piece: ActivePiece = { kind: 'T', rotation: 0, position: { x: 3, y: -2 } };
    expect(isValidPosition(board, piece)).toBe(true);
  });

  it('rejects a piece outside the left wall', () => {
    const board = createEmptyBoard(10, 20);
    const piece: ActivePiece = { kind: 'O', rotation: 0, position: { x: -2, y: 0 } };
    expect(isValidPosition(board, piece)).toBe(false);
  });

  it('rejects a piece outside the right wall', () => {
    const board = createEmptyBoard(10, 20);
    const piece: ActivePiece = { kind: 'I', rotation: 0, position: { x: 8, y: 0 } };
    expect(isValidPosition(board, piece)).toBe(false);
  });

  it('rejects a piece below the floor', () => {
    const board = createEmptyBoard(10, 20);
    const piece: ActivePiece = { kind: 'I', rotation: 0, position: { x: 3, y: 22 } };
    expect(isValidPosition(board, piece)).toBe(false);
  });

  it('rejects a piece overlapping locked cells', () => {
    let board = createEmptyBoard(10, 5);
    // I at (0, 1) rotation 0 → filled row 1 of its 4x4 matrix shifted to board
    // y=2, cols 0..3. O placed at (0, 1) covers cols 1..2 on rows 1..2 → cells
    // (1, 2) and (2, 2) overlap with the locked I-row.
    board = lockPiece(board, { kind: 'I', rotation: 0, position: { x: 0, y: 1 } });
    const piece: ActivePiece = { kind: 'O', rotation: 0, position: { x: 0, y: 1 } };
    expect(isValidPosition(board, piece)).toBe(false);
  });
});

describe('tryMove', () => {
  it('returns a moved piece when valid', () => {
    const board = createEmptyBoard(10, 20);
    const piece: ActivePiece = { kind: 'T', rotation: 0, position: { x: 4, y: 0 } };
    const moved = tryMove(board, piece, 1, 0);
    expect(moved?.position).toEqual({ x: 5, y: 0 });
  });

  it('returns null when the move is invalid', () => {
    const board = createEmptyBoard(10, 20);
    const piece: ActivePiece = { kind: 'I', rotation: 0, position: { x: 6, y: 0 } };
    expect(tryMove(board, piece, 1, 0)).toBe(null);
  });
});

describe('dropToBottom / dropDistance', () => {
  it('lands at the floor on an empty board', () => {
    const board = createEmptyBoard(10, 20);
    const piece: ActivePiece = { kind: 'O', rotation: 0, position: { x: 4, y: 0 } };
    const landed = dropToBottom(board, piece);
    // O matrix-rows 0..1 carry the filled cells. Dropping from (4, 0) lands
    // the bottom row (matrix-row 1 → absolute y = position.y + 1) on row 19.
    // → position.y = 18.
    expect(landed.position.y).toBe(18);
    expect(dropDistance(board, piece)).toBe(18);
  });

  it('lands on top of stacked cells', () => {
    // Stack I horizontally at the bottom: its matrix-row 1 lands on board row 19.
    let board = createEmptyBoard(10, 20);
    const stacked: ActivePiece = { kind: 'I', rotation: 0, position: { x: 0, y: 18 } };
    board = lockPiece(board, stacked);
    // O matrix-rows 0..1 carry the filled cells. Dropping from (0, 0) lands the
    // bottom-filled row (matrix-row 1 → absolute y = position.y + 1) on row 18.
    // That puts position.y = 17.
    const piece: ActivePiece = { kind: 'O', rotation: 0, position: { x: 0, y: 0 } };
    const landed = dropToBottom(board, piece);
    expect(landed.position.y).toBe(17);
  });
});
