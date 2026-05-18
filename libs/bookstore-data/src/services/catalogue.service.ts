import { computed, Injectable, signal } from '@angular/core';

import {
  BASE_SORT_KEYS,
  type BaseSortKey,
  type ProductLookup,
  sortProducts,
  summariseBaseFacets,
} from '@ai-studio/shop-core';

import { applyBookFilters } from '../filters/matching.js';
import { type Book, type BookFilters, EMPTY_BOOK_FILTERS } from '../models/book.js';
import { BOOK_CATALOGUE } from '../seed/catalogue.js';

/**
 * Catalogue + facet + sort state for the bookstore. Implements `ProductLookup`
 * so the shared `ShopCartService` can join cart lines with their books via
 * the `PRODUCT_LOOKUP` DI token.
 */
@Injectable({ providedIn: 'root' })
export class BookstoreCatalogueService implements ProductLookup<Book> {
  private readonly booksSignal = signal<readonly Book[]>(BOOK_CATALOGUE);
  private readonly filtersSignal = signal<BookFilters>(EMPTY_BOOK_FILTERS);
  private readonly sortSignal = signal<BaseSortKey>('popularity');

  readonly sortKeys = BASE_SORT_KEYS;
  readonly products = this.booksSignal.asReadonly();
  readonly filters = this.filtersSignal.asReadonly();
  readonly sort = this.sortSignal.asReadonly();

  readonly filtered = computed<readonly Book[]>(() => {
    const passed = applyBookFilters(this.booksSignal(), this.filtersSignal());
    return sortProducts(passed, this.sortSignal());
  });

  readonly facets = computed(() => summariseBaseFacets(this.booksSignal()));

  patchFilters(patch: Partial<BookFilters>): void {
    this.filtersSignal.update((current) => ({ ...current, ...patch }));
  }

  resetFilters(): void {
    this.filtersSignal.set(EMPTY_BOOK_FILTERS);
  }

  setSort(next: BaseSortKey): void {
    this.sortSignal.set(next);
  }

  findById(id: string): Book | null {
    return this.booksSignal().find((book) => book.id === id) ?? null;
  }
}
