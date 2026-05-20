/**
 * Unit tests — touch gesture detection.
 *
 * Pure functions — no DOM, no jsdom touch event polyfills.
 */
import { describe, expect, it } from 'vitest';

import { detectGesture, gestureToMove, type TouchPoint } from './touch-gestures.js';

function pt(x: number, y: number, t = 0): TouchPoint {
  return { x, y, t };
}

describe('detectGesture', () => {
  it('returns "tap" for tiny movement under 300 ms', () => {
    const gesture = detectGesture(pt(100, 100, 0), pt(105, 102, 80));
    expect(gesture?.type).toBe('tap');
  });

  it('returns null for tiny movement but over 300 ms (slow lingering touch)', () => {
    const gesture = detectGesture(pt(100, 100, 0), pt(102, 103, 500));
    expect(gesture).toBeNull();
  });

  it('returns "swipe-right" when horizontal delta dominates and points right', () => {
    expect(detectGesture(pt(50, 200, 0), pt(120, 210, 150))?.type).toBe('swipe-right');
  });

  it('returns "swipe-left" when horizontal delta dominates and points left', () => {
    expect(detectGesture(pt(200, 200, 0), pt(120, 205, 150))?.type).toBe('swipe-left');
  });

  it('returns "swipe-down" when vertical delta dominates and points down', () => {
    expect(detectGesture(pt(100, 50, 0), pt(105, 200, 200))?.type).toBe('swipe-down');
  });

  it('returns "swipe-up" when vertical delta dominates and points up (hard drop)', () => {
    expect(detectGesture(pt(100, 250, 0), pt(98, 50, 200))?.type).toBe('swipe-up');
  });

  it('returns null for slow drift that doesn’t pass either threshold', () => {
    // dx=25, dy=25 — over tap radius (20) so not a tap, under swipe min (30)
    // on both axes so not a swipe. The user lingered too long mid-screen.
    expect(detectGesture(pt(100, 100, 0), pt(125, 125, 600))).toBeNull();
  });
});

describe('gestureToMove', () => {
  it('maps tap to rotate-cw — most discoverable touch primitive', () => {
    expect(gestureToMove({ type: 'tap' })).toBe('rotate-cw');
  });

  it('maps horizontal swipes to left / right moves', () => {
    expect(gestureToMove({ type: 'swipe-left' })).toBe('left');
    expect(gestureToMove({ type: 'swipe-right' })).toBe('right');
  });

  it('maps swipe-down to soft-drop and swipe-up to hard-drop', () => {
    expect(gestureToMove({ type: 'swipe-down' })).toBe('soft-drop');
    expect(gestureToMove({ type: 'swipe-up' })).toBe('hard-drop');
  });
});
