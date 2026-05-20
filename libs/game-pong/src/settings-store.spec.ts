/**
 * Unit tests — PongSettingsStore.
 *
 * Direct instantiation (mirrors `leaderboard-store.spec.ts`): signals are
 * standalone primitives and don't need TestBed to function.
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { paddleSpeedMultiplier, PongSettingsStore } from './settings-store.js';

const STORAGE_KEY = 'ais.pong.settings.v1';

describe('PongSettingsStore', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('returns sensible defaults when localStorage is empty', () => {
    const store = new PongSettingsStore();
    expect(store.settings().volume).toBeCloseTo(0.7);
    expect(store.settings().paddleSpeed).toBe('normal');
  });

  it('clamps volume into [0, 1] and persists', () => {
    const store = new PongSettingsStore();
    store.setVolume(1.5);
    expect(store.settings().volume).toBe(1);
    store.setVolume(-0.2);
    expect(store.settings().volume).toBe(0);
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') as { volume?: number };
    expect(stored.volume).toBe(0);
  });

  it('persists paddle speed preset and reads it back across instances', () => {
    const a = new PongSettingsStore();
    a.setPaddleSpeed('fast');
    const b = new PongSettingsStore();
    expect(b.settings().paddleSpeed).toBe('fast');
  });

  it('reset() restores defaults and overwrites stored value', () => {
    const store = new PongSettingsStore();
    store.setVolume(0.1);
    store.setPaddleSpeed('slow');
    store.reset();
    expect(store.settings()).toEqual({ volume: 0.7, paddleSpeed: 'normal' });
  });

  it('ignores malformed JSON in storage and uses defaults', () => {
    localStorage.setItem(STORAGE_KEY, 'not-json');
    const store = new PongSettingsStore();
    expect(store.settings().volume).toBeCloseTo(0.7);
  });

  it('paddleSpeedMultiplier maps presets to runtime scalars', () => {
    expect(paddleSpeedMultiplier('slow')).toBe(0.7);
    expect(paddleSpeedMultiplier('normal')).toBe(1);
    expect(paddleSpeedMultiplier('fast')).toBe(1.3);
  });
});
