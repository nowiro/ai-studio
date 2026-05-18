/**
 * Colour palette for the 7 standard tetrominoes — Tetris Guideline approved.
 * UI-only; the logic lib stores piece kinds, not colours.
 */
import type { TetrominoKind } from '@ai-studio/game-tetris';

export const PIECE_COLOURS: Readonly<Record<TetrominoKind, string>> = {
  I: '#00f0f0', // cyan
  O: '#f0f000', // yellow
  T: '#a000f0', // purple
  S: '#00f000', // green
  Z: '#f00000', // red
  J: '#0000f0', // blue
  L: '#f0a000', // orange
};

/** Subtle outline used to separate stacked blocks of the same colour. */
export const BLOCK_OUTLINE = 'rgba(0, 0, 0, 0.35)';

/** Ghost-piece overlay (translucent target landing zone). */
export const GHOST_FILL = 'rgba(255, 255, 255, 0.18)';
export const GHOST_OUTLINE = 'rgba(255, 255, 255, 0.6)';
