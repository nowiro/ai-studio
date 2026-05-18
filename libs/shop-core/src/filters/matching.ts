import type { BaseFilters } from '../models/filters.js';
import type { BaseProduct } from '../models/product.js';

/**
 * Decide whether a product passes the base facet set. Each predicate is a
 * standalone function so the parent stays under the lint cognitive-
 * complexity budget; domain-specific shops compose this with their own
 * facets.
 */
export function matchesBaseFilters<T extends BaseProduct>(product: T, filters: BaseFilters): boolean {
  return (
    matchesSetFacet(filters.brands, product.brand) &&
    matchesSetFacet(filters.categories, product.category) &&
    matchesPriceFloor(filters.minPriceCents, product.priceCents) &&
    matchesPriceCeiling(filters.maxPriceCents, product.priceCents) &&
    matchesStock(filters.inStockOnly, product.stock) &&
    matchesQuery(product, filters.query)
  );
}

/** Empty set means "no constraint on this axis". */
export function matchesSetFacet<TValue>(set: ReadonlySet<TValue>, value: TValue): boolean {
  return set.size === 0 || set.has(value);
}

export function matchesDimension(expected: number | null, actual: number): boolean {
  return expected === null || expected === actual;
}

export function matchesPriceFloor(min: number | null, price: number): boolean {
  return min === null || price >= min;
}

export function matchesPriceCeiling(max: number | null, price: number): boolean {
  return max === null || price <= max;
}

export function matchesStock(inStockOnly: boolean, stock: number): boolean {
  return !inStockOnly || stock > 0;
}

/** Case-insensitive substring match against `name + brand + tags`. */
export function matchesQuery(product: BaseProduct, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (needle.length === 0) {
    return true;
  }
  const haystack = `${product.name} ${product.brand} ${product.tags.join(' ')}`.toLowerCase();
  return haystack.includes(needle);
}

/** Apply the base filters to a product list. Pure: immutable in, immutable out. */
export function applyBaseFilters<T extends BaseProduct>(products: readonly T[], filters: BaseFilters): readonly T[] {
  return products.filter((product) => matchesBaseFilters(product, filters));
}
