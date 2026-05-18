import { computed, Injectable, signal } from '@angular/core';

import { applyFilters } from '../filters/search.js';
import { sortBooks } from '../filters/sorting.js';
import type { Book } from '../models/book.js';
import { BOOK_SORT_KEYS, type BookFilters, type BookSortKey, EMPTY_FILTERS } from '../models/filters.js';
import { BOOK_CATALOGUE } from '../seed/seed.js';

/** Exposes the book catalogue + filter / sort state as signals. */
@Injectable({ providedIn: 'root' })
export class CatalogueService {
  private readonly booksSignal = signal<readonly Book[]>(BOOK_CATALOGUE);
  private readonly filtersSignal = signal<BookFilters>(EMPTY_FILTERS);
  private readonly sortSignal = signal<BookSortKey>('title-asc');

  readonly sortKeys = BOOK_SORT_KEYS;

  readonly books = this.booksSignal.asReadonly();
  readonly filters = this.filtersSignal.asReadonly();
  readonly sort = this.sortSignal.asReadonly();

  readonly availabilityProbe = signal<(bookId: string) => boolean>(() => true);

  readonly filtered = computed<readonly Book[]>(() => {
    const filtered = applyFilters(this.booksSignal(), this.filtersSignal(), this.availabilityProbe());
    return sortBooks(filtered, this.sortSignal(), this.filtersSignal().query);
  });

  patchFilters(patch: Partial<BookFilters>): void {
    this.filtersSignal.update((current) => ({ ...current, ...patch }));
  }

  resetFilters(): void {
    this.filtersSignal.set(EMPTY_FILTERS);
  }

  setSort(key: BookSortKey): void {
    this.sortSignal.set(key);
  }

  findById(bookId: string): Book | null {
    return this.booksSignal().find((b) => b.id === bookId) ?? null;
  }
}
