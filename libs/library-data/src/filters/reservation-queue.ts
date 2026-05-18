import type { Reservation } from '../models/loan.js';

/**
 * Position of `memberId` in the reservation queue for `bookId`. Returns
 * 0 when the member has no active reservation for that book; otherwise
 * 1-based position ordered by `placedAt` (FIFO).
 */
export function reservationPosition(bookId: string, memberId: string, reservations: readonly Reservation[]): number {
  const queue = reservations
    .filter((r) => r.active && r.bookId === bookId)
    .sort((a, b) => a.placedAt.localeCompare(b.placedAt));
  const index = queue.findIndex((r) => r.memberId === memberId);
  return index === -1 ? 0 : index + 1;
}

/** All reservations for `bookId`, ordered by FIFO. */
export function queueForBook(bookId: string, reservations: readonly Reservation[]): readonly Reservation[] {
  return reservations
    .filter((r) => r.active && r.bookId === bookId)
    .sort((a, b) => a.placedAt.localeCompare(b.placedAt));
}
