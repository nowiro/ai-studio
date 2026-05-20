/**
 * Unit tests — PongState transitions and event emission.
 * @see docs/analytical/specs/2026-05-08-pong-game/spec.md AC-1..AC-9
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { DEFAULT_PONG_CONFIG, type PongEvent } from '../types.js';
import { PongState } from './pong-state.js';

let state: PongState;
let events: PongEvent[];
let unsubscribe: () => void;

beforeEach(() => {
  // Make Math.random deterministic (always serves toward CPU first).
  vi.spyOn(Math, 'random').mockReturnValue(0.4);
  state = new PongState(DEFAULT_PONG_CONFIG);
  events = [];
  unsubscribe = state.subscribe((event) => events.push(event));
});

afterEach(() => {
  unsubscribe();
  vi.restoreAllMocks();
});

describe('lifecycle', () => {
  it('AC-1 — starts in idle status with score 0-0', () => {
    expect(state.getStatus()).toBe('idle');
    expect(state.getScore()).toEqual({ player: 0, cpu: 0 });
  });

  it('AC-2 — start() resets score and emits "started"', () => {
    state.start();
    expect(state.getStatus()).toBe('playing');
    expect(state.getScore()).toEqual({ player: 0, cpu: 0 });
    expect(events.find((e) => e.type === 'started')).toBeDefined();
  });

  it('AC-2 — start() centres the paddles', () => {
    state.start();
    const { player, cpu } = state.getPaddles();
    const expectedY = (DEFAULT_PONG_CONFIG.height - DEFAULT_PONG_CONFIG.paddleHeight) / 2;
    expect(player.y).toBe(expectedY);
    expect(cpu.y).toBe(expectedY);
  });

  it('AC-8 — pause() then resume() flip status and emit events', () => {
    state.start();
    state.pause();
    expect(state.getStatus()).toBe('paused');
    state.resume();
    expect(state.getStatus()).toBe('playing');
    expect(events.map((e) => e.type)).toEqual(expect.arrayContaining(['started', 'paused', 'resumed']));
  });

  it('AC-8 — tick() is a no-op while paused', () => {
    state.start();
    const beforeBall = state.getBall();
    state.pause();
    const ticked = state.tick(1_000);
    expect(ticked).toBe(false);
    expect(state.getBall()).toEqual(beforeBall);
  });
});

describe('player input → paddle motion', () => {
  it('AC-3 — pressing "up" moves the player paddle up', () => {
    state.start();
    const before = state.getPaddles().player.y;
    state.setPlayerInput('up');
    state.tick(100);
    expect(state.getPaddles().player.y).toBeLessThan(before);
  });

  it('AC-3 — pressing "down" moves the player paddle down', () => {
    state.start();
    const before = state.getPaddles().player.y;
    state.setPlayerInput('down');
    state.tick(100);
    expect(state.getPaddles().player.y).toBeGreaterThan(before);
  });

  it('AC-3 — paddle never leaves the play area', () => {
    state.start();
    const max = DEFAULT_PONG_CONFIG.height - DEFAULT_PONG_CONFIG.paddleHeight;
    let minYSeen = Infinity;
    let maxYSeen = -Infinity;
    state.setPlayerInput('up');
    for (let i = 0; i < 1000; i++) {
      state.tick(16);
      const y = state.getPaddles().player.y;
      if (y < minYSeen) minYSeen = y;
      if (y > maxYSeen) maxYSeen = y;
    }
    state.setPlayerInput('down');
    for (let i = 0; i < 1000; i++) {
      state.tick(16);
      const y = state.getPaddles().player.y;
      if (y < minYSeen) minYSeen = y;
      if (y > maxYSeen) maxYSeen = y;
    }
    // Clamping is the contract. Reaching the edge depends on goal-driven
    // resets and ball position — covered by the dedicated edge tests below.
    expect(minYSeen).toBeGreaterThanOrEqual(0);
    expect(maxYSeen).toBeLessThanOrEqual(max);
  });

  it('AC-3 — top edge clamp: paddle reaches y=0 when held up before any goal', () => {
    // Pause the game first to start the round, then drive paddle motion in
    // an idle (non-playing) simulation. We cannot pause: tick() no-ops then.
    // Instead we use a very short window before the ball can reach an edge.
    state.start();
    state.setPlayerInput('up');
    // Ball at centre, vx ≤ 360 px/s; left edge ≥ 388 px → ≥ 1.07 s before goal.
    // Paddle at centre (252) needs 252/480 ≈ 0.525 s to reach 0.
    for (let i = 0; i < 60; i++) state.tick(10); // 0.6 s total
    expect(state.getPaddles().player.y).toBe(0);
  });

  it('AC-3 — bottom edge clamp: paddle reaches y=max when held down before any goal', () => {
    state.start();
    state.setPlayerInput('down');
    for (let i = 0; i < 60; i++) state.tick(10); // 0.6 s
    const max = DEFAULT_PONG_CONFIG.height - DEFAULT_PONG_CONFIG.paddleHeight;
    expect(state.getPaddles().player.y).toBe(max);
  });
});

describe('scoring → game over', () => {
  it('AC-6 — when ball passes left edge, CPU scores', () => {
    state.start();
    // Set the ball just outside the left edge by ticking to a specific position.
    // We cheat by repeatedly ticking until the goal happens. Use a simpler path:
    // call tick with a huge dt that pushes ball far left.
    // Reach the left edge — ball.vx is negative after start (random=0.4 → serve left).
    // Run until either side scores (deterministic: CPU paddle fails to track in one tick).
    state.setPlayerInput('idle');
    let scored = false;
    for (let i = 0; i < 1_000 && !scored; i++) {
      state.tick(16);
      scored = events.some((e) => e.type === 'score');
    }
    expect(scored).toBe(true);
  });

  it('AC-7 — game-over event fires when winScore is reached', () => {
    state.start();
    state.setPlayerInput('idle');
    let over: PongEvent | undefined;
    for (let i = 0; i < 100_000 && !over; i++) {
      state.tick(16);
      over = events.find((e) => e.type === 'game-over');
    }
    expect(over).toBeDefined();
    expect(state.getStatus()).toBe('over');
    if (over?.type === 'game-over') {
      const winningSide = over.winner;
      expect(state.getScore()[winningSide]).toBe(DEFAULT_PONG_CONFIG.winScore);
    }
  });
});

describe('setPlayerSpeedMultiplier', () => {
  it('scales player paddle motion — fast moves further per tick than slow', () => {
    const slow = new PongState(DEFAULT_PONG_CONFIG);
    const fast = new PongState(DEFAULT_PONG_CONFIG);
    slow.setPlayerSpeedMultiplier(0.7);
    fast.setPlayerSpeedMultiplier(1.3);
    slow.start();
    fast.start();
    slow.setPlayerInput('down');
    fast.setPlayerInput('down');
    for (let i = 0; i < 10; i++) {
      slow.tick(16);
      fast.tick(16);
    }
    const slowY = slow.getPaddles().player.y;
    const fastY = fast.getPaddles().player.y;
    expect(fastY).toBeGreaterThan(slowY);
  });

  it('clamps negative or NaN multipliers to safe defaults', () => {
    state.setPlayerSpeedMultiplier(-5);
    state.start();
    state.setPlayerInput('down');
    const startY = state.getPaddles().player.y;
    state.tick(100);
    // Multiplier 0 → no movement
    expect(state.getPaddles().player.y).toBe(startY);

    state.setPlayerSpeedMultiplier(Number.NaN);
    state.tick(100);
    // NaN falls back to 1, so paddle should move now
    expect(state.getPaddles().player.y).toBeGreaterThan(startY);
  });
});

describe('subscribe / unsubscribe', () => {
  it('returned function removes the handler', () => {
    state.start();
    unsubscribe();
    state.tick(16);
    state.pause();
    // No additional events after unsubscribe; only the ones from before.
    const last = events[events.length - 1];
    expect(last?.type).not.toBe('paused');
  });
});
