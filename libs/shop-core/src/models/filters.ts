/**
 * Subset of facets every shop demos exposes. Domain-specific shops
 * extend this base with their own union members (e.g. tire seasons,
 * book genres).
 */
export interface BaseFilters {
  readonly brands: ReadonlySet<string>;
  readonly categories: ReadonlySet<string>;
  readonly minPriceCents: number | null;
  readonly maxPriceCents: number | null;
  readonly inStockOnly: boolean;
  readonly query: string;
}

export const EMPTY_BASE_FILTERS: BaseFilters = {
  brands: new Set(),
  categories: new Set(),
  minPriceCents: null,
  maxPriceCents: null,
  inStockOnly: false,
  query: '',
};

/** Standard sort options every shop offers. */
export type BaseSortKey = 'popularity' | 'price-asc' | 'price-desc' | 'rating-desc' | 'name-asc';

export const BASE_SORT_KEYS: readonly BaseSortKey[] = [
  'popularity',
  'price-asc',
  'price-desc',
  'rating-desc',
  'name-asc',
];
