/**
 * Gravity table — milliseconds per row at each level. Approximates the
 * official Tetris Guideline curve: starts at ~1000 ms at level 0, halves
 * every few levels, asymptotes around 16 ms (one frame at 60 fps) at L20+.
 *
 * Source approximation: `(0.8 - level * 0.007)^level * 1000` clamped to
 * a minimum of 16 ms.
 */

/** Milliseconds per row at the given level (clamped to [16, 1000]). */
export function msPerRow(level: number): number {
  const lvl = Math.max(0, level);
  const t = Math.pow(0.8 - lvl * 0.007, lvl) * 1000;
  return Math.max(16, Math.min(1000, t));
}
