import { describe, expect, it } from 'vitest';

import type { Rotation, TetrominoKind } from '../types.js';
import { ALL_KINDS, shapeCells, spawnPosition, TETROMINOES } from './tetrominoes.js';

describe('TETROMINOES table', () => {
  it('declares every kind with 4 rotations of 4×4 matrices', () => {
    for (const kind of ALL_KINDS) {
      const rotations = TETROMINOES[kind];
      expect(rotations).toHaveLength(4);
      for (const matrix of rotations) {
        expect(matrix).toHaveLength(4);
        for (const row of matrix) {
          expect(row).toHaveLength(4);
        }
      }
    }
  });

  it('every piece has exactly 4 filled cells per rotation', () => {
    for (const kind of ALL_KINDS) {
      for (let r = 0; r < 4; r++) {
        const cells = shapeCells(kind, r as Rotation);
        expect(cells).toHaveLength(4);
      }
    }
  });

  it('O-piece does not visually change across rotations', () => {
    const r0 = shapeCells('O', 0);
    for (let r = 1; r < 4; r++) {
      const cells = shapeCells('O', r as Rotation);
      const a = r0.map((c) => `${c.x},${c.y}`).sort((x, y) => x.localeCompare(y));
      const b = cells.map((c) => `${c.x},${c.y}`).sort((x, y) => x.localeCompare(y));
      expect(a).toEqual(b);
    }
  });
});

describe('spawnPosition', () => {
  it('centres on a 10-wide board', () => {
    expect(spawnPosition(10)).toEqual({ x: 4, y: -2 });
  });

  it('centres on a 12-wide board', () => {
    expect(spawnPosition(12)).toEqual({ x: 5, y: -2 });
  });
});

// Use the type imports to keep them non-elided.
type _Kind = TetrominoKind;
