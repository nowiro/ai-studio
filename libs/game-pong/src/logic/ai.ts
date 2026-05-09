/**
 * Pure AI tracking math. The CPU paddle approaches the ball's vertical
 * position at no more than `maxSpeed` pixels per second. Slower than the
 * player, so AC-4 (perfect play impossible) holds.
 * @see docs/analytical/specs/2026-05-08-pong-game/spec.md AC-4
 */

/**
 * Compute the AI paddle's vertical velocity for the next frame.
 * @param paddleY current top-left y of the AI paddle
 * @param paddleHeight paddle height in px
 * @param ballY current ball centre-y in px
 * @param maxSpeed cap on the absolute velocity (px/s)
 * @param deadZone band in px around the centre where the paddle does not move
 *                (avoids high-frequency jitter)
 * @returns velocity in px/s; positive = down, negative = up
 */
export function nextAiVelocity(
  paddleY: number,
  paddleHeight: number,
  ballY: number,
  maxSpeed: number,
  deadZone = 8,
): number {
  const paddleCentre = paddleY + paddleHeight / 2;
  const delta = ballY - paddleCentre;
  if (Math.abs(delta) < deadZone) return 0;
  return Math.sign(delta) * maxSpeed;
}
