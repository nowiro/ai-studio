import { computed, Injectable, signal } from '@angular/core';

/**
 * Per-book user review record.
 * Stored in-memory by `BookstoreReviewStore` and persisted to localStorage
 * via `BookstoreReviewStorageService` (added in T002 of plan 2026-05-19-bookstore.md).
 */
export interface Review {
  id: string;
  bookId: string;
  user: string;
  stars: 1 | 2 | 3 | 4 | 5;
  text: string;
  createdAt: string; // ISO 8601
}

export interface ReviewAggregate {
  count: number;
  average: number; // 0..5, rounded to 1 decimal
}

const EMPTY_AGGREGATE: ReviewAggregate = { count: 0, average: 0 };

/**
 * Signal-based review store.
 *
 * - Read API:
 *   - `reviews()` — all reviews (sorted by `createdAt` desc).
 *   - `reviewsFor(bookId)` — reviews for one book (`computed` per call site).
 *   - `aggregateFor(bookId)` — `{ count, average }`.
 * - Write API:
 *   - `add({ bookId, user, stars, text })` — appends with generated id + timestamp.
 *   - `clear()` — resets state (used by tests).
 *
 * Implementation note: persistence is delegated to a separate service to keep
 * this store pure for unit testing.
 */
@Injectable({ providedIn: 'root' })
export class BookstoreReviewStore {
  readonly #reviews = signal<readonly Review[]>([]);

  /** Read-only view of all reviews sorted newest first. */
  readonly reviews = computed(() => [...this.#reviews()].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)));

  /** Returns reviews for a single book sorted newest first. */
  reviewsFor(bookId: string): Review[] {
    return this.reviews().filter((r) => r.bookId === bookId);
  }

  /** Returns aggregate `{ count, average }` rounded to 1 decimal. */
  aggregateFor(bookId: string): ReviewAggregate {
    const list = this.reviewsFor(bookId);
    if (list.length === 0) return EMPTY_AGGREGATE;
    const sum = list.reduce((acc, r) => acc + r.stars, 0);
    return {
      count: list.length,
      average: Math.round((sum / list.length) * 10) / 10,
    };
  }

  /** Add a new review. Returns the generated id. */
  add(input: Omit<Review, 'id' | 'createdAt'>): string {
    const review: Review = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    this.#reviews.update((prev) => [...prev, review]);
    return review.id;
  }

  /** Replace the entire review list (used by storage rehydration). */
  hydrate(reviews: readonly Review[]): void {
    this.#reviews.set([...reviews]);
  }

  /** Clear all reviews (tests). */
  clear(): void {
    this.#reviews.set([]);
  }
}
