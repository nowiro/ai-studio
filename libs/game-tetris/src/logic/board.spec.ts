import { describe, expect, it } from 'vitest';

import type { ActivePiece, BoardSnapshot, CellValue } from '../types.js';
import {
  clearRows,
  countFilledCells,
  createEmptyBoard,
  distinctKindsOnBoard,
  findFullRows,
  lockPiece,
} from './board.js';

function row(filled: readonly CellValue[]): readonly CellValue[] {
  return filled;
}

describe('createEmptyBoard', () => {
  it('returns a board of the requested dimensions filled with zeros', () => {
    const board = createEmptyBoard(10, 20);
    expect(board).toHaveLength(20);
    for (const r of board) {
      expect(r).toHaveLength(10);
      expect(r.every((c) => c === 0)).toBe(true);
    }
  });
});

describe('lockPiece', () => {
  it('writes the piece kind into the correct board cells', () => {
    const board = createEmptyBoard(10, 4);
    const piece: ActivePiece = { kind: 'O', rotation: 0, position: { x: 4, y: 0 } };
    const locked = lockPiece(board, piece);
    // O at (x=4, y=0) with shape:
    //   . X X .
    //   . X X .
    // Filled cells (board coords) = (5,0),(6,0),(5,1),(6,1)
    expect(locked[0]?.[5]).toBe('O');
    expect(locked[0]?.[6]).toBe('O');
    expect(locked[1]?.[5]).toBe('O');
    expect(locked[1]?.[6]).toBe('O');
    expect(countFilledCells(locked)).toBe(4);
  });

  it('does not mutate the input board', () => {
    const board = createEmptyBoard(10, 20);
    const piece: ActivePiece = { kind: 'I', rotation: 0, position: { x: 3, y: 0 } };
    lockPiece(board, piece);
    expect(countFilledCells(board)).toBe(0);
  });
});

describe('findFullRows', () => {
  it('returns indices of fully-filled rows', () => {
    const board: BoardSnapshot = [
      row(Array.from({ length: 10 }, (): CellValue => 'T')),
      row(Array.from({ length: 10 }, (_, i): CellValue => (i < 9 ? 'T' : 0))),
      row(Array.from({ length: 10 }, (): CellValue => 'I')),
    ];
    expect(findFullRows(board)).toEqual([0, 2]);
  });

  it('returns an empty array when no row is full', () => {
    const board = createEmptyBoard(10, 5);
    expect(findFullRows(board)).toEqual([]);
  });
});

describe('clearRows', () => {
  it('removes the cleared rows and prepends empty ones', () => {
    const board: BoardSnapshot = [
      row(Array.from({ length: 4 }, (): CellValue => 'I')),
      row([0, 0, 0, 0]),
      row(Array.from({ length: 4 }, (): CellValue => 'O')),
      row([0, 0, 0, 0]),
    ];
    const cleared = clearRows(board, [0, 2]);
    expect(cleared).toHaveLength(4);
    expect(cleared[0]?.every((c) => c === 0)).toBe(true);
    expect(cleared[1]?.every((c) => c === 0)).toBe(true);
    expect(cleared[2]?.every((c) => c === 0)).toBe(true);
    expect(cleared[3]?.every((c) => c === 0)).toBe(true);
  });

  it('returns the same board if no rows to clear', () => {
    const board = createEmptyBoard(10, 5);
    expect(clearRows(board, [])).toBe(board);
  });
});

describe('countFilledCells / distinctKindsOnBoard', () => {
  it('counts filled cells and lists distinct piece kinds', () => {
    const board: BoardSnapshot = [
      row(['I', 'I', 'I', 'I', 0, 0, 0, 0, 0, 0]),
      row(['O', 'O', 0, 0, 0, 0, 0, 0, 0, 0]),
      row(['O', 'O', 0, 0, 0, 0, 0, 0, 0, 0]),
    ];
    expect(countFilledCells(board)).toBe(8);
    expect([...distinctKindsOnBoard(board)].sort((a, b) => a.localeCompare(b))).toEqual(['I', 'O']);
  });
});
