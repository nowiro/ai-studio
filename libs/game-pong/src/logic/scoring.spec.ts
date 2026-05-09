/**
 * Unit tests — scoring.
 * @see docs/analytical/specs/2026-05-08-pong-game/spec.md AC-6, AC-7
 */
import { describe, expect, it } from 'vitest';

import { applyScore, isWinningScore, serveDirection } from './scoring.js';

describe('applyScore', () => {
  it('AC-6 — increments player when player scored', () => {
    expect(applyScore({ player: 0, cpu: 0 }, 'player')).toEqual({ player: 1, cpu: 0 });
  });

  it('AC-6 — increments cpu when cpu scored', () => {
    expect(applyScore({ player: 2, cpu: 3 }, 'cpu')).toEqual({ player: 2, cpu: 4 });
  });

  it('AC-6 — returns a new object (immutable)', () => {
    const before = { player: 0, cpu: 0 };
    const after = applyScore(before, 'player');
    expect(after).not.toBe(before);
    expect(before).toEqual({ player: 0, cpu: 0 });
  });
});

describe('isWinningScore', () => {
  it('AC-7 — returns null below the threshold', () => {
    expect(isWinningScore({ player: 4, cpu: 4 }, 5)).toBeNull();
  });

  it('AC-7 — returns "player" when player reaches the threshold', () => {
    expect(isWinningScore({ player: 5, cpu: 3 }, 5)).toBe('player');
  });

  it('AC-7 — returns "cpu" when cpu reaches the threshold', () => {
    expect(isWinningScore({ player: 1, cpu: 5 }, 5)).toBe('cpu');
  });

  it('AC-7 — handles overshoot (defensive)', () => {
    expect(isWinningScore({ player: 7, cpu: 0 }, 5)).toBe('player');
  });
});

describe('serveDirection', () => {
  it('AC-6 — serves toward the player when the player just scored (CPU was scored on)', () => {
    expect(serveDirection('player')).toBe(1);
  });

  it('AC-6 — serves toward the CPU when the CPU just scored', () => {
    expect(serveDirection('cpu')).toBe(-1);
  });
});
