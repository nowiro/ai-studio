/**
 * Unit tests — collision math.
 * @see docs/analytical/specs/2026-05-08-pong-game/spec.md AC-5
 */
import { describe, expect, it } from 'vitest';

import { type Ball, type Paddle, reflectBallOnPaddle, reflectBallOnWall } from './collision.js';

const baseBall: Ball = { x: 100, y: 100, vx: 200, vy: 50, size: 10 };
const basePaddle: Paddle = { x: 100, y: 80, width: 12, height: 96 };

describe('reflectBallOnWall', () => {
  it('AC-5 — inverts vy when ball touches top wall', () => {
    const result = reflectBallOnWall({ ...baseBall, y: 0, vy: -100 }, 600);
    expect(result.hit).toBe('top');
    expect(result.ball.vy).toBeGreaterThan(0);
    expect(result.ball.vx).toBe(baseBall.vx);
  });

  it('AC-5 — inverts vy when ball touches bottom wall', () => {
    const result = reflectBallOnWall({ ...baseBall, y: 600 - 10, vy: 100 }, 600);
    expect(result.hit).toBe('bottom');
    expect(result.ball.vy).toBeLessThan(0);
  });

  it('AC-5 — no-op when ball is in the middle of the play area', () => {
    const result = reflectBallOnWall({ ...baseBall, y: 300, vy: 100 }, 600);
    expect(result.hit).toBeNull();
    expect(result.ball).toEqual({ ...baseBall, y: 300, vy: 100 });
  });
});

describe('reflectBallOnPaddle', () => {
  it('AC-5 — inverts vx when ball overlaps the paddle', () => {
    const ball: Ball = { ...baseBall, x: 105, y: 120, vx: -200, vy: 0 };
    const paddle: Paddle = { x: 100, y: 100, width: 12, height: 96 };
    const result = reflectBallOnPaddle(ball, paddle);
    expect(result.vx).toBeGreaterThan(0);
  });

  it('AC-5 — no-op when AABB does not intersect', () => {
    const ball: Ball = { ...baseBall, x: 0, y: 0 };
    const result = reflectBallOnPaddle(ball, basePaddle);
    expect(result).toBe(ball);
  });

  it('AC-5 — bends ball downward when struck near the bottom of the paddle', () => {
    const paddle: Paddle = { x: 100, y: 100, width: 12, height: 100 };
    // Hit at the very bottom of the paddle
    const ball: Ball = { ...baseBall, x: 105, y: 195, vx: -300, vy: 0 };
    const result = reflectBallOnPaddle(ball, paddle);
    expect(result.vy).toBeGreaterThan(0);
  });

  it('AC-5 — bends ball upward when struck near the top of the paddle', () => {
    const paddle: Paddle = { x: 100, y: 100, width: 12, height: 100 };
    // Hit at the very top of the paddle
    const ball: Ball = { ...baseBall, x: 105, y: 100, vx: -300, vy: 0 };
    const result = reflectBallOnPaddle(ball, paddle);
    expect(result.vy).toBeLessThan(0);
  });

  it('AC-5 — pushes the ball out of the paddle so it cannot stick', () => {
    const ball: Ball = { ...baseBall, x: 102, y: 120, vx: -300, vy: 0, size: 10 };
    const paddle: Paddle = { x: 100, y: 100, width: 12, height: 96 };
    const result = reflectBallOnPaddle(ball, paddle);
    // After reflection ball.x should be at paddle.x + paddle.width (ejected to the right)
    expect(result.x).toBe(paddle.x + paddle.width);
  });
});
