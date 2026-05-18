import { describe, expect, it } from 'vitest';

import type { Book } from '../models/book.js';
import type { Loan, Reservation } from '../models/loan.js';
import { buildAvailability, hasFreeCopy } from './availability.js';

function book(id: string, total: number): Book {
  return {
    id,
    title: id,
    author: 'A',
    isbn: id,
    genre: 'fiction',
    language: 'en',
    publishedYear: 2000,
    coverUrl: '',
    blurb: '',
    totalCopies: total,
  };
}

function loan(id: string, bookId: string, status: Loan['status'] = 'active'): Loan {
  return {
    id,
    bookId,
    memberId: 'm',
    issuedAt: '2026-05-01',
    dueDate: '2026-05-15',
    returnedAt: null,
    status,
    renewals: 0,
  };
}

function res(id: string, bookId: string, active = true): Reservation {
  return { id, bookId, memberId: 'm', placedAt: '2026-05-01', active };
}

describe('buildAvailability', () => {
  it('computes free = total - activeLoans', () => {
    const map = buildAvailability(
      [book('a', 3), book('b', 1)],
      [loan('l1', 'a'), loan('l2', 'a'), loan('l3', 'b', 'returned')],
      [],
    );
    expect(map.get('a')).toEqual({ total: 3, onLoan: 2, reserved: 0, free: 1 });
    expect(map.get('b')).toEqual({ total: 1, onLoan: 0, reserved: 0, free: 1 });
  });

  it('counts reservations separately', () => {
    const map = buildAvailability([book('a', 2)], [], [res('r1', 'a'), res('r2', 'a', false)]);
    expect(map.get('a')).toEqual({ total: 2, onLoan: 0, reserved: 1, free: 2 });
  });

  it('clamps `free` to 0 if active loans exceed total copies', () => {
    const map = buildAvailability([book('a', 1)], [loan('l1', 'a'), loan('l2', 'a')], []);
    expect(map.get('a')?.free).toBe(0);
  });
});

describe('hasFreeCopy', () => {
  it('returns true when free > 0', () => {
    const map = buildAvailability([book('a', 2)], [loan('l1', 'a')], []);
    expect(hasFreeCopy('a', map)).toBe(true);
  });

  it('returns false when free === 0', () => {
    const map = buildAvailability([book('a', 1)], [loan('l1', 'a')], []);
    expect(hasFreeCopy('a', map)).toBe(false);
  });

  it('returns false for unknown books', () => {
    expect(hasFreeCopy('ghost', new Map())).toBe(false);
  });
});
