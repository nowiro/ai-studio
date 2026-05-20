/**
 * Unit tests — ChartThemeBridge.
 *
 * Exercises the Material 3 → chart theme snapshot under jsdom (no actual
 * `--mat-sys-*` variables present) to lock in the fallback contract.
 */
import { describe, expect, it } from 'vitest';

import { ChartThemeBridge } from './theme.js';

describe('ChartThemeBridge', () => {
  it('returns a sensible light-mode snapshot when no CSS variables are set', () => {
    const bridge = new ChartThemeBridge();
    const snapshot = bridge.snapshot();
    expect(snapshot.mode).toBe('light');
    expect(snapshot.palette.length).toBe(6);
    expect(snapshot.background).toBeTruthy();
    expect(snapshot.foreground).toBeTruthy();
    expect(snapshot.fontFamily).toContain('sans-serif');
  });

  it('always returns 6 palette colours, even with no tokens', () => {
    const bridge = new ChartThemeBridge();
    const palette = bridge.snapshot().palette;
    for (const colour of palette) {
      expect(typeof colour).toBe('string');
      expect(colour.length).toBeGreaterThan(0);
    }
  });

  it('exposes a grid colour distinct from the background', () => {
    const bridge = new ChartThemeBridge();
    const snapshot = bridge.snapshot();
    expect(snapshot.grid).not.toBe(snapshot.background);
  });
});
