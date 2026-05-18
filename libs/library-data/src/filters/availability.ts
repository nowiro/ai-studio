import type { Book } from '../models/book.js';
import type { Loan, Reservation } from '../models/loan.js';

/** Per-book availability snapshot used by the catalogue + detail pages. */
export interface BookAvailability {
  readonly total: number;
  readonly onLoan: number;
  readonly reserved: number;
  readonly free: number;
}

/** Compute availability snapshots for every book. Pure. */
export function buildAvailability(
  books: readonly Book[],
  loans: readonly Loan[],
  reservations: readonly Reservation[],
): ReadonlyMap<string, BookAvailability> {
  const onLoanByBook = new Map<string, number>();
  for (const loan of loans) {
    if (loan.status === 'active') {
      onLoanByBook.set(loan.bookId, (onLoanByBook.get(loan.bookId) ?? 0) + 1);
    }
  }
  const reservedByBook = new Map<string, number>();
  for (const res of reservations) {
    if (res.active) {
      reservedByBook.set(res.bookId, (reservedByBook.get(res.bookId) ?? 0) + 1);
    }
  }
  const out = new Map<string, BookAvailability>();
  for (const book of books) {
    const onLoan = onLoanByBook.get(book.id) ?? 0;
    const reserved = reservedByBook.get(book.id) ?? 0;
    const free = Math.max(0, book.totalCopies - onLoan);
    out.set(book.id, { total: book.totalCopies, onLoan, reserved, free });
  }
  return out;
}

/** True iff `book` has at least one free copy. */
export function hasFreeCopy(bookId: string, availability: ReadonlyMap<string, BookAvailability>): boolean {
  return (availability.get(bookId)?.free ?? 0) > 0;
}
