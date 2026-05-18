import { describe, expect, it } from 'vitest';

import { msPerRow } from './gravity.js';

describe('msPerRow', () => {
  it('returns ~1000 ms at level 0', () => {
    expect(msPerRow(0)).toBe(1000);
  });

  it('falls monotonically as level rises', () => {
    let prev = msPerRow(0);
    for (let lvl = 1; lvl <= 20; lvl++) {
      const cur = msPerRow(lvl);
      expect(cur).toBeLessThanOrEqual(prev);
      prev = cur;
    }
  });

  it('never goes below 16 ms (one 60 fps frame)', () => {
    for (let lvl = 0; lvl < 50; lvl++) {
      expect(msPerRow(lvl)).toBeGreaterThanOrEqual(16);
    }
  });

  it('treats negative levels as level 0', () => {
    expect(msPerRow(-5)).toBe(1000);
  });
});
