import type { BaseFilters, BaseProduct } from '@ai-studio/shop-core';

/** A book for sale. Extends the generic `BaseProduct` with bibliographic fields. */
export interface Book extends BaseProduct {
  readonly author: string;
  readonly isbn: string;
  readonly language: BookLanguage;
  readonly publishedYear: number;
  readonly pageCount: number;
  readonly format: BookFormat;
}

export type BookLanguage = 'pl' | 'en' | 'de' | 'fr' | 'es';
export const BOOK_LANGUAGES: readonly BookLanguage[] = ['pl', 'en', 'de', 'fr', 'es'];

export type BookFormat = 'hardcover' | 'paperback' | 'ebook' | 'audiobook';
export const BOOK_FORMATS: readonly BookFormat[] = ['hardcover', 'paperback', 'ebook', 'audiobook'];

export const BOOK_GENRES: readonly string[] = [
  'fiction',
  'non-fiction',
  'fantasy',
  'sci-fi',
  'mystery',
  'biography',
  'history',
  'science',
  'children',
  'poetry',
];

/** Extended facet set — adds bibliographic axes on top of the generic filters. */
export interface BookFilters extends BaseFilters {
  readonly languages: ReadonlySet<BookLanguage>;
  readonly formats: ReadonlySet<BookFormat>;
  readonly minYear: number | null;
  readonly maxYear: number | null;
}

export const EMPTY_BOOK_FILTERS: BookFilters = {
  brands: new Set(),
  categories: new Set(),
  minPriceCents: null,
  maxPriceCents: null,
  inStockOnly: false,
  query: '',
  languages: new Set(),
  formats: new Set(),
  minYear: null,
  maxYear: null,
};
