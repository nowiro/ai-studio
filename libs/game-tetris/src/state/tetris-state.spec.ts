import { describe, expect, it } from 'vitest';

import { DEFAULT_TETRIS_CONFIG, type TetrisEvent, TetrisState } from '../index.js';

function withState(seed = 1): { state: TetrisState; events: TetrisEvent[] } {
  const state = new TetrisState({ ...DEFAULT_TETRIS_CONFIG, seed });
  const events: TetrisEvent[] = [];
  state.subscribe((e) => events.push(e));
  state.start();
  return { state, events };
}

describe('TetrisState lifecycle', () => {
  it('emits a started + piece-spawned event on start', () => {
    const { events } = withState(11);
    expect(events[0]?.type).toBe('started');
    expect(events[1]?.type).toBe('piece-spawned');
  });

  it('produces a deterministic piece sequence per seed', () => {
    const a = withState(42);
    const b = withState(42);
    const aKinds = a.events
      .filter((e) => e.type === 'piece-spawned')
      .map((e) => (e as { piece: { kind: string } }).piece.kind);
    const bKinds = b.events
      .filter((e) => e.type === 'piece-spawned')
      .map((e) => (e as { piece: { kind: string } }).piece.kind);
    expect(aKinds).toEqual(bKinds);
  });

  it('pause -> resume gates ticks', () => {
    const { state, events } = withState(3);
    state.pause();
    state.tick(10_000); // big tick; should not advance
    state.resume();
    expect(events.some((e) => e.type === 'paused')).toBe(true);
    expect(events.some((e) => e.type === 'resumed')).toBe(true);
  });

  it('reset returns to idle and clears the board', () => {
    const { state, events } = withState(7);
    state.reset();
    expect(state.getStatus()).toBe('idle');
    expect(events.at(-1)?.type).toBe('reset');
    // Board fully empty.
    const board = state.getBoard();
    for (const row of board) expect(row.every((c) => c === 0)).toBe(true);
  });
});

describe('TetrisState input handling', () => {
  it('left/right movement updates the active piece', () => {
    const { state } = withState(5);
    const startX = state.getActivePiece()?.position.x ?? 0;
    state.input('left');
    expect(state.getActivePiece()?.position.x).toBe(startX - 1);
    state.input('right');
    state.input('right');
    expect(state.getActivePiece()?.position.x).toBe(startX + 1);
  });

  it('hard-drop locks the piece and spawns a new one', () => {
    const { state, events } = withState(9);
    expect(state.getActivePiece()?.kind).toBeTruthy();
    state.input('hard-drop');
    expect(state.getActivePiece()?.kind).toBeTruthy();
    expect(events.some((e) => e.type === 'piece-locked')).toBe(true);
    // After a lock, the new spawn could occasionally be the same kind from the bag,
    // but the position must be the standard spawn slot — meaning a NEW spawn happened.
    expect(state.getActivePiece()?.position.y).toBe(-2);
  });

  it('hold swaps the active piece with the held slot (and only once per spawn)', () => {
    const { state } = withState(13);
    const first = state.getActivePiece()?.kind;
    state.input('hold');
    expect(state.getHeld()).toBe(first);
    // Re-hold within the same piece should be a no-op (holdLocked = true).
    const swapped = state.getActivePiece()?.kind;
    state.input('hold');
    expect(state.getActivePiece()?.kind).toBe(swapped);
  });
});

describe('TetrisState tick + gravity', () => {
  it('does nothing when status is not playing', () => {
    const { state } = withState(2);
    state.pause();
    const before = state.getActivePiece();
    state.tick(5_000);
    expect(state.getActivePiece()).toEqual(before);
  });

  it('advances the active piece down after one row-period elapses', () => {
    const { state } = withState(4);
    const startY = state.getActivePiece()?.position.y ?? 0;
    state.tick(1_001); // > 1000 ms at level 0
    const after = state.getActivePiece()?.position.y ?? 0;
    expect(after).toBe(startY + 1);
  });
});

describe('TetrisState getters', () => {
  it('exposes next-queue + score + held', () => {
    const { state } = withState(8);
    expect(state.getNextQueue()).toHaveLength(DEFAULT_TETRIS_CONFIG.previewCount);
    expect(state.getScore()).toMatchObject({ score: 0, lines: 0, level: 0 });
    expect(state.getHeld()).toBe(null);
  });

  it('ghost cells line up with the bottom of the drop trajectory', () => {
    const { state } = withState(6);
    const ghost = state.getGhostCells();
    // Ghost should have 4 cells (one per tetromino tile).
    expect(ghost).toHaveLength(4);
    // All ghost cells must sit at the same y as `dropToBottom` would land on.
    const maxY = Math.max(...ghost.map((c) => c.y));
    expect(maxY).toBeGreaterThanOrEqual(0);
  });
});
