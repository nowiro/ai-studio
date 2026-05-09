/**
 * Pure scoring logic.
 * @see docs/analytical/specs/2026-05-08-pong-game/spec.md AC-6, AC-7
 */
import type { PongScore, Side } from '../types.js';

/**
 * Increment the side that just scored; immutable.
 * @param score
 * @param scoredBy
 */
export function applyScore(score: PongScore, scoredBy: Side): PongScore {
  return scoredBy === 'player'
    ? { player: score.player + 1, cpu: score.cpu }
    : { player: score.player, cpu: score.cpu + 1 };
}

/**
 * True when either side has reached the configured win threshold.
 * @param score
 * @param threshold
 */
export function isWinningScore(score: PongScore, threshold: number): Side | null {
  if (score.player >= threshold) return 'player';
  if (score.cpu >= threshold) return 'cpu';
  return null;
}

/**
 * Serve direction after a goal: the ball heads toward the side that was scored on
 * (i.e. `scoredBy` won the point, so serve back at them).
 *
 * Returns +1 (toward CPU side, right) or -1 (toward player side, left).
 * @param scoredBy
 */
export function serveDirection(scoredBy: Side): 1 | -1 {
  return scoredBy === 'player' ? 1 : -1;
}
