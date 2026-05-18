import { describe, expect, it } from 'vitest';

import { SevenBag } from './bag.js';
import { ALL_KINDS } from './tetrominoes.js';

describe('SevenBag', () => {
  it('exhausts every kind exactly once per 7 spawns', () => {
    const bag = new SevenBag(42);
    const first7 = new Set([bag.next(), bag.next(), bag.next(), bag.next(), bag.next(), bag.next(), bag.next()]);
    expect(first7.size).toBe(7);
    for (const k of ALL_KINDS) expect(first7.has(k)).toBe(true);
  });

  it('produces a reproducible sequence for the same seed', () => {
    const a = new SevenBag(42);
    const b = new SevenBag(42);
    for (let i = 0; i < 21; i++) expect(a.next()).toBe(b.next());
  });

  it('produces different sequences for different seeds', () => {
    const a = new SevenBag(1);
    const b = new SevenBag(2);
    const seqA: string[] = [];
    const seqB: string[] = [];
    for (let i = 0; i < 7; i++) {
      seqA.push(a.next());
      seqB.push(b.next());
    }
    expect(seqA.join('')).not.toBe(seqB.join(''));
  });

  it('peek does not consume the queue', () => {
    const bag = new SevenBag(7);
    const previewA = bag.peek(3);
    const previewB = bag.peek(3);
    expect(previewA).toEqual(previewB);
    expect(bag.next()).toBe(previewA[0]);
  });

  it('peek refills the queue if it is too short', () => {
    const bag = new SevenBag(99);
    const preview = bag.peek(15);
    expect(preview).toHaveLength(15);
    // Every consecutive window of 7 should contain all 7 distinct kinds.
    expect(new Set(preview.slice(0, 7)).size).toBe(7);
    expect(new Set(preview.slice(7, 14)).size).toBe(7);
  });
});
