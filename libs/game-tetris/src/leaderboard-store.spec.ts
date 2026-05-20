// @vitest-environment jsdom
/**
 * Unit tests — TetrisLeaderboardStore. Needs jsdom for localStorage.
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { TETRIS_LEADERBOARD_LIMIT, TetrisLeaderboardStore } from './leaderboard-store.js';

const STORAGE_KEY = 'ais.tetris.leaderboard.v1';

describe('TetrisLeaderboardStore', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('starts empty when storage is fresh', () => {
    const store = new TetrisLeaderboardStore();
    expect(store.entries()).toEqual([]);
    expect(store.best()).toBeNull();
  });

  it('records a qualifying run and persists it', () => {
    const store = new TetrisLeaderboardStore();
    const entry = store.record({ score: 1000, lines: 12, level: 3 });
    expect(entry).not.toBeNull();
    expect(store.entries()).toHaveLength(1);
    expect(store.best()?.score).toBe(1000);
    const raw = localStorage.getItem(STORAGE_KEY);
    expect(raw).toBeTruthy();
  });

  it('keeps entries sorted by score descending', () => {
    const store = new TetrisLeaderboardStore();
    store.record({ score: 500, lines: 5, level: 1 });
    store.record({ score: 1500, lines: 15, level: 4 });
    store.record({ score: 900, lines: 9, level: 2 });
    expect(store.entries().map((e) => e.score)).toEqual([1500, 900, 500]);
  });

  it('caps the leaderboard at TETRIS_LEADERBOARD_LIMIT entries', () => {
    const store = new TetrisLeaderboardStore();
    for (let i = 0; i < TETRIS_LEADERBOARD_LIMIT + 5; i++) {
      store.record({ score: 100 + i * 10, lines: i, level: 1 });
    }
    expect(store.entries()).toHaveLength(TETRIS_LEADERBOARD_LIMIT);
    // Highest score (last inserted with highest value) should be on top.
    expect(store.entries()[0]?.score).toBe(100 + (TETRIS_LEADERBOARD_LIMIT + 4) * 10);
  });

  it('returns null and ignores runs with score <= 0', () => {
    const store = new TetrisLeaderboardStore();
    expect(store.record({ score: 0, lines: 0, level: 1 })).toBeNull();
    expect(store.record({ score: -5, lines: 0, level: 1 })).toBeNull();
    expect(store.entries()).toEqual([]);
  });

  it('returns null when a new entry does not beat any of the top 10', () => {
    const store = new TetrisLeaderboardStore();
    for (let i = 0; i < TETRIS_LEADERBOARD_LIMIT; i++) {
      store.record({ score: 1000 + i, lines: i, level: 1 });
    }
    const reject = store.record({ score: 5, lines: 0, level: 1 });
    expect(reject).toBeNull();
    expect(store.entries()).toHaveLength(TETRIS_LEADERBOARD_LIMIT);
  });

  it('breaks score ties with the more recent run first', () => {
    const store = new TetrisLeaderboardStore();
    store.record({ score: 500, lines: 5, level: 1 });
    store.record({ score: 500, lines: 5, level: 1 });
    const [top, runnerUp] = store.entries();
    expect(top?.score).toBe(500);
    expect(runnerUp?.score).toBe(500);
    expect(top?.playedAt).toBeGreaterThanOrEqual(runnerUp?.playedAt ?? 0);
  });

  it('clear() empties the leaderboard and wipes storage', () => {
    const store = new TetrisLeaderboardStore();
    store.record({ score: 500, lines: 5, level: 1 });
    store.clear();
    expect(store.entries()).toEqual([]);
    expect(localStorage.getItem(STORAGE_KEY)).toBe('[]');
  });

  it('survives a malformed storage payload', () => {
    localStorage.setItem(STORAGE_KEY, '{not-array}');
    const store = new TetrisLeaderboardStore();
    expect(store.entries()).toEqual([]);
  });

  it('reads entries persisted by a previous instance', () => {
    const a = new TetrisLeaderboardStore();
    a.record({ score: 2500, lines: 25, level: 5 });
    const b = new TetrisLeaderboardStore();
    expect(b.entries()).toHaveLength(1);
    expect(b.entries()[0]?.score).toBe(2500);
  });
});
