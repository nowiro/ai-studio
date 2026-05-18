import type { BookGenre, BookLanguage } from './book.js';

/** Active facet selection for the catalogue. */
export interface BookFilters {
  readonly genres: ReadonlySet<BookGenre>;
  readonly languages: ReadonlySet<BookLanguage>;
  readonly minYear: number | null;
  readonly maxYear: number | null;
  readonly availableOnly: boolean;
  readonly query: string;
}

export const EMPTY_FILTERS: BookFilters = {
  genres: new Set(),
  languages: new Set(),
  minYear: null,
  maxYear: null,
  availableOnly: false,
  query: '',
};

export type BookSortKey = 'title-asc' | 'title-desc' | 'author-asc' | 'year-desc' | 'year-asc';

export const BOOK_SORT_KEYS: readonly BookSortKey[] = [
  'title-asc',
  'title-desc',
  'author-asc',
  'year-desc',
  'year-asc',
];
