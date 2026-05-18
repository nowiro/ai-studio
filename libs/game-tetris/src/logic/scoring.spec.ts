import { describe, expect, it } from 'vitest';

import { applyHardDrop, applyLineClear, applySoftDrop, initialScore } from './scoring.js';

describe('initialScore', () => {
  it('starts at zero by default but preserves high-score', () => {
    expect(initialScore()).toEqual({ score: 0, lines: 0, level: 0, highScore: 0 });
    expect(initialScore(500).highScore).toBe(500);
  });
});

describe('applyLineClear', () => {
  it('awards 100·(level+1) for a single', () => {
    const next = applyLineClear(initialScore(), 1, 10);
    expect(next.score).toBe(100);
    expect(next.lines).toBe(1);
    expect(next.level).toBe(0);
  });

  it('awards 800·(level+1) for a tetris and tracks high-score', () => {
    const next = applyLineClear(initialScore(), 4, 10);
    expect(next.score).toBe(800);
    expect(next.lines).toBe(4);
    expect(next.highScore).toBe(800);
  });

  it('levels up after `linesPerLevel` cleared lines', () => {
    let s = initialScore();
    // Clear 10 singles at level 0 → 1000 points, advances to level 1.
    for (let i = 0; i < 10; i++) s = applyLineClear(s, 1, 10);
    expect(s.lines).toBe(10);
    expect(s.level).toBe(1);
    // Next single at L1 awards 200.
    const next = applyLineClear(s, 1, 10);
    expect(next.score - s.score).toBe(200);
  });

  it('uses the post-clear level for the next bonus', () => {
    let s: ReturnType<typeof initialScore> = { score: 0, lines: 8, level: 0, highScore: 0 };
    // Clearing 4 at L0 awards 800 and bumps to L1.
    s = applyLineClear(s, 4, 10);
    expect(s.level).toBe(1);
    expect(s.score).toBe(800);
  });
});

describe('applySoftDrop / applyHardDrop', () => {
  it('soft-drop adds 1 per cell', () => {
    const s = applySoftDrop(initialScore(), 5);
    expect(s.score).toBe(5);
  });

  it('hard-drop adds 2 per cell', () => {
    const s = applyHardDrop(initialScore(), 5);
    expect(s.score).toBe(10);
  });

  it('high-score never decreases', () => {
    const base = { score: 500, lines: 0, level: 0, highScore: 1000 };
    const s = applySoftDrop(base, 1);
    expect(s.highScore).toBe(1000);
  });
});
