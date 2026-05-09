/**
 * Pure collision math. No DOM, no Phaser, no side effects.
 *
 * Coordinate system: origin top-left, +x right, +y down. Velocities are px/s.
 * @see docs/analytical/specs/2026-05-08-pong-game/spec.md AC-5
 */

/** Axis-aligned rectangle representing a paddle. */
export interface Paddle {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

/** Ball state. Velocity is px/s. */
export interface Ball {
  readonly x: number;
  readonly y: number;
  readonly vx: number;
  readonly vy: number;
  readonly size: number;
}

/**
 * If the ball intersects the paddle on its leading edge, reflect the horizontal
 * velocity and inject a small vertical offset based on where the ball hit
 * (top/bottom of the paddle bends the trajectory upward/downward).
 *
 * Returns the same ball if no collision; the AABB check is intentionally cheap.
 * @param ball
 * @param paddle
 * @param maxBend
 */
export function reflectBallOnPaddle(ball: Ball, paddle: Paddle, maxBend = 0.6): Ball {
  if (!aabbIntersects(ball, paddle)) {
    return ball;
  }
  // Hit position normalised to [-1, 1]: -1 = paddle top, 1 = paddle bottom.
  const paddleCentre = paddle.y + paddle.height / 2;
  const hitOffset = (ball.y - paddleCentre) / (paddle.height / 2);
  const clamped = Math.max(-1, Math.min(1, hitOffset));

  const speed = Math.hypot(ball.vx, ball.vy) || 1;
  const newVx = -Math.sign(ball.vx) * Math.abs(ball.vx);
  const bendY = clamped * maxBend * speed;

  return {
    ...ball,
    vx: newVx,
    vy: bendY,
    // Push the ball out of the paddle so it cannot stick to the surface.
    x: ball.vx > 0 ? paddle.x - ball.size : paddle.x + paddle.width,
  };
}

/**
 * If the ball is at or past the top/bottom wall, invert vertical velocity.
 * Horizontal velocity unchanged.
 * @param ball
 * @param height
 */
export function reflectBallOnWall(ball: Ball, height: number): { ball: Ball; hit: 'top' | 'bottom' | null } {
  if (ball.y <= 0 && ball.vy < 0) {
    return { ball: { ...ball, y: 0, vy: -ball.vy }, hit: 'top' };
  }
  if (ball.y + ball.size >= height && ball.vy > 0) {
    return { ball: { ...ball, y: height - ball.size, vy: -ball.vy }, hit: 'bottom' };
  }
  return { ball, hit: null };
}

/**
 * AABB intersection test.
 * @param ball
 * @param paddle
 */
function aabbIntersects(ball: Ball, paddle: Paddle): boolean {
  return (
    ball.x < paddle.x + paddle.width &&
    ball.x + ball.size > paddle.x &&
    ball.y < paddle.y + paddle.height &&
    ball.y + ball.size > paddle.y
  );
}
