// @vitest-environment jsdom
/**
 * Unit tests — TetrisSettingsStore. The store reads/writes localStorage,
 * which only exists under jsdom (the lib's default env is `node`); we opt
 * this spec into jsdom via the line-comment directive above (vitest reads
 * it before TypeScript stripping). Direct instantiation — signals are
 * standalone primitives, no TestBed.
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { TetrisSettingsStore } from './settings-store.js';

const STORAGE_KEY = 'ais.tetris.settings.v1';

describe('TetrisSettingsStore', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('returns defaults when storage is empty', () => {
    const store = new TetrisSettingsStore();
    expect(store.settings().volume).toBeCloseTo(0.7);
    expect(store.settings().showGhost).toBe(true);
  });

  it('clamps volume and persists', () => {
    const store = new TetrisSettingsStore();
    store.setVolume(2);
    expect(store.settings().volume).toBe(1);
    store.setVolume(-1);
    expect(store.settings().volume).toBe(0);
  });

  it('persists showGhost toggle across instances', () => {
    const a = new TetrisSettingsStore();
    a.setShowGhost(false);
    const b = new TetrisSettingsStore();
    expect(b.settings().showGhost).toBe(false);
  });

  it('reset() restores defaults', () => {
    const store = new TetrisSettingsStore();
    store.setVolume(0.2);
    store.setShowGhost(false);
    store.reset();
    expect(store.settings()).toEqual({ volume: 0.7, showGhost: true });
  });

  it('survives malformed storage payload', () => {
    localStorage.setItem(STORAGE_KEY, '{invalid');
    const store = new TetrisSettingsStore();
    expect(store.settings().volume).toBeCloseTo(0.7);
    expect(store.settings().showGhost).toBe(true);
  });
});
