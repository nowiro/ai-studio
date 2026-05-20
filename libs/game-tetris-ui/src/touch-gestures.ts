/**
 * Pure gesture detection for tetris touch input — extracted so the
 * mapping is unit-testable without jsdom touch event polyfills.
 *
 * The tetris host wires `touchstart` / `touchend` and feeds the resulting
 * {@link TouchPoint}s into {@link detectGesture}. The returned gesture is
 * then routed to a {@link PlayerMove} via {@link gestureToMove} and
 * dispatched into `TetrisState.input(...)`.
 */
import type { PlayerMove } from '@ai-studio/game-tetris';

/** Snapshot of a finger / pointer position with the originating timestamp. */
export interface TouchPoint {
  readonly x: number;
  readonly y: number;
  /** `performance.now()` timestamp in ms. */
  readonly t: number;
}

/** Symbolic gesture inferred from a start → end touch pair. */
export type TetrisGesture =
  | { readonly type: 'tap' }
  | { readonly type: 'swipe-left' }
  | { readonly type: 'swipe-right' }
  | { readonly type: 'swipe-down' }
  | { readonly type: 'swipe-up' };

/** Maximum pixel distance for a touch to count as a tap (not a swipe). */
const TAP_RADIUS_PX = 20;
/** Minimum pixel distance for a touch to count as a swipe. */
const SWIPE_MIN_PX = 30;
/** Maximum duration for a tap, in ms. Anything longer is a slow drag. */
const TAP_MAX_MS = 300;

/**
 * Classify a touch as either a tap, one of four cardinal swipes, or `null`
 * when the input is too short to be deliberate (no swipe direction beat
 * the {@link SWIPE_MIN_PX} threshold).
 */
export function detectGesture(start: TouchPoint, end: TouchPoint): TetrisGesture | null {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);
  const dt = end.t - start.t;

  if (absDx < TAP_RADIUS_PX && absDy < TAP_RADIUS_PX && dt < TAP_MAX_MS) {
    return { type: 'tap' };
  }
  if (absDx >= absDy && absDx >= SWIPE_MIN_PX) {
    return { type: dx > 0 ? 'swipe-right' : 'swipe-left' };
  }
  if (absDy > absDx && absDy >= SWIPE_MIN_PX) {
    return { type: dy > 0 ? 'swipe-down' : 'swipe-up' };
  }
  return null;
}

/**
 * Map a gesture onto a tetris `PlayerMove`. Tap rotates clockwise — the
 * most discoverable touch interaction; swipe up hard-drops because it
 * mirrors "throw the piece down" intuitively.
 */
export function gestureToMove(gesture: TetrisGesture): PlayerMove {
  switch (gesture.type) {
    case 'tap':
      return 'rotate-cw';
    case 'swipe-left':
      return 'left';
    case 'swipe-right':
      return 'right';
    case 'swipe-down':
      return 'soft-drop';
    case 'swipe-up':
      return 'hard-drop';
  }
}
