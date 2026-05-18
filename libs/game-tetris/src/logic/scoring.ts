/**
 * Scoring rules — Tetris Guideline.
 *
 * Line clears: `{1: 100, 2: 300, 3: 500, 4: 800}` × `(level + 1)`.
 * Soft drop: `+1` per cell.
 * Hard drop: `+2` per cell.
 *
 * Levels advance every `linesPerLevel` (default 10) cleared lines.
 */
import type { TetrisScore } from '../types.js';

const LINE_POINTS: Readonly<Record<1 | 2 | 3 | 4, number>> = {
  1: 100,
  2: 300,
  3: 500,
  4: 800,
};

/** Compute next score after clearing `count` lines (1..4) at the given level. */
export function applyLineClear(score: TetrisScore, count: 1 | 2 | 3 | 4, linesPerLevel: number): TetrisScore {
  const points = LINE_POINTS[count] * (score.level + 1);
  const lines = score.lines + count;
  const level = Math.floor(lines / linesPerLevel);
  const totalScore = score.score + points;
  return {
    score: totalScore,
    lines,
    level,
    highScore: Math.max(score.highScore, totalScore),
  };
}

/** Add soft-drop bonus (1 point per cell). */
export function applySoftDrop(score: TetrisScore, cells: number): TetrisScore {
  const totalScore = score.score + cells;
  return { ...score, score: totalScore, highScore: Math.max(score.highScore, totalScore) };
}

/** Add hard-drop bonus (2 points per cell). */
export function applyHardDrop(score: TetrisScore, cells: number): TetrisScore {
  const totalScore = score.score + cells * 2;
  return { ...score, score: totalScore, highScore: Math.max(score.highScore, totalScore) };
}

/** Initial score line — preserves a previous `highScore` across rounds. */
export function initialScore(highScore = 0): TetrisScore {
  return { score: 0, lines: 0, level: 0, highScore };
}
