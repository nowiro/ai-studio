import type { BaseSortKey } from '../models/filters.js';
import type { BaseProduct } from '../models/product.js';

/** Popularity = rating × log(reviewCount + 1). Higher = better. */
export function popularityScore(product: BaseProduct): number {
  return product.rating * Math.log(product.reviewCount + 1);
}

/**
 * Stable sort by base sort key. Returns a new array; ties break on `id`
 * with `localeCompare` so output is deterministic.
 */
export function sortProducts<T extends BaseProduct>(products: readonly T[], sort: BaseSortKey): readonly T[] {
  const copy = [...products];
  switch (sort) {
    case 'price-asc': {
      copy.sort((a, b) => a.priceCents - b.priceCents || a.id.localeCompare(b.id));
      return copy;
    }
    case 'price-desc': {
      copy.sort((a, b) => b.priceCents - a.priceCents || a.id.localeCompare(b.id));
      return copy;
    }
    case 'rating-desc': {
      copy.sort((a, b) => b.rating - a.rating || a.id.localeCompare(b.id));
      return copy;
    }
    case 'name-asc': {
      copy.sort((a, b) => a.name.localeCompare(b.name) || a.id.localeCompare(b.id));
      return copy;
    }
    case 'popularity':
    default: {
      copy.sort((a, b) => popularityScore(b) - popularityScore(a) || a.id.localeCompare(b.id));
      return copy;
    }
  }
}
