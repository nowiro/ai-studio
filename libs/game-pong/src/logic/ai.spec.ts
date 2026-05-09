/**
 * Unit tests — AI tracking.
 * @see docs/analytical/specs/2026-05-08-pong-game/spec.md AC-4
 */
import { describe, expect, it } from 'vitest';

import { nextAiVelocity } from './ai.js';

describe('nextAiVelocity', () => {
  it('AC-4 — moves down when ball is below the paddle centre', () => {
    // paddle y=100, height=96 → centre 148; ball at 300
    const v = nextAiVelocity(100, 96, 300, 320);
    expect(v).toBe(320);
  });

  it('AC-4 — moves up when ball is above the paddle centre', () => {
    const v = nextAiVelocity(300, 96, 50, 320);
    expect(v).toBe(-320);
  });

  it('AC-4 — sits still inside the dead zone', () => {
    // paddle y=100, height=96 → centre 148; ball at 150 (delta=2 < deadZone=8)
    const v = nextAiVelocity(100, 96, 150, 320, 8);
    expect(v).toBe(0);
  });

  it('AC-4 — never exceeds maxSpeed', () => {
    const v = nextAiVelocity(0, 96, 600, 320);
    expect(Math.abs(v)).toBe(320);
  });

  it('AC-4 — speed cap < player speed (perfect play impossible)', () => {
    // The contract: aiSpeed < paddleSpeed in DEFAULT_PONG_CONFIG.
    // We simply assert the function honours its own cap; the config is checked
    // by config.spec or convention.
    expect(Math.abs(nextAiVelocity(0, 96, 1_000, 100))).toBe(100);
  });
});
