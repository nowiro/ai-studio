/**
 * 7-bag randomiser — every 7 spawns shuffle 7 unique pieces, so the player
 * never waits more than 12 spawns for any given kind. Seedable for tests.
 *
 * Uses a tiny LCG so we don't depend on `Math.random()` behaviour (which
 * varies across engines) and the bag is reproducible from a seed.
 */
import type { TetrominoKind } from '../types.js';
import { ALL_KINDS } from './tetrominoes.js';

/** Linear-congruential generator (Numerical Recipes parameters). */
function lcg(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1_664_525) + 1_013_904_223) >>> 0;
    return state / 0x1_00_00_00_00;
  };
}

/** Fisher–Yates shuffle of `ALL_KINDS` driven by an RNG. */
function shuffleBag(rng: () => number): TetrominoKind[] {
  const arr = [...ALL_KINDS];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const t = arr[i];
    const s = arr[j];
    if (!t || !s) continue;
    arr[i] = s;
    arr[j] = t;
  }
  return arr;
}

/**
 * Stateful 7-bag — call `next()` to pop the next piece, or `peek(n)` to read
 * the upcoming `n` without consuming.
 */
export class SevenBag {
  private queue: TetrominoKind[] = [];
  private readonly rng: () => number;

  constructor(seed?: number) {
    this.rng = lcg(seed ?? Date.now() & 0xff_ff_ff_ff);
    this.refill();
  }

  /** Pop the next kind. */
  next(): TetrominoKind {
    if (this.queue.length === 0) this.refill();
    const popped = this.queue.shift();
    if (!popped) {
      // Shouldn't happen — refill always restocks. Defensive recovery path:
      // refill once more and return; if the queue is *still* empty, the bag is
      // in an unrecoverable state (programmer error in shuffleBag).
      this.refill();
      const second = this.queue.shift();
      if (!second) throw new Error('SevenBag invariant violated: refill produced an empty queue.');
      return second;
    }
    if (this.queue.length < 7) this.refill();
    return popped;
  }

  /** Peek the next `count` kinds without consuming them. */
  peek(count: number): readonly TetrominoKind[] {
    while (this.queue.length < count) this.refill();
    return this.queue.slice(0, count);
  }

  private refill(): void {
    this.queue.push(...shuffleBag(this.rng));
  }
}
