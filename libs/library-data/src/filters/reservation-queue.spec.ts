import { describe, expect, it } from 'vitest';

import type { Reservation } from '../models/loan.js';
import { queueForBook, reservationPosition } from './reservation-queue.js';

const RESERVATIONS: readonly Reservation[] = [
  { id: 'r1', bookId: 'a', memberId: 'm1', placedAt: '2026-05-01', active: true },
  { id: 'r2', bookId: 'a', memberId: 'm2', placedAt: '2026-05-02', active: true },
  { id: 'r3', bookId: 'a', memberId: 'm3', placedAt: '2026-05-03', active: false },
  { id: 'r4', bookId: 'b', memberId: 'm1', placedAt: '2026-05-01', active: true },
];

describe('reservationPosition', () => {
  it('returns 0 if the member has no active reservation for this book', () => {
    expect(reservationPosition('a', 'mX', RESERVATIONS)).toBe(0);
  });

  it('returns 1-based FIFO position', () => {
    expect(reservationPosition('a', 'm1', RESERVATIONS)).toBe(1);
    expect(reservationPosition('a', 'm2', RESERVATIONS)).toBe(2);
  });

  it('ignores inactive reservations', () => {
    expect(reservationPosition('a', 'm3', RESERVATIONS)).toBe(0);
  });
});

describe('queueForBook', () => {
  it('returns only active reservations for the book, FIFO ordered', () => {
    const queue = queueForBook('a', RESERVATIONS);
    expect(queue.map((r) => r.id)).toEqual(['r1', 'r2']);
  });

  it('returns empty for unknown books', () => {
    expect(queueForBook('ghost', RESERVATIONS)).toEqual([]);
  });
});
