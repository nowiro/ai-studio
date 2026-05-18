import type { BaseProduct } from '../models/product.js';

export interface BaseFacetSummary {
  readonly brandCounts: ReadonlyMap<string, number>;
  readonly categoryCounts: ReadonlyMap<string, number>;
  readonly priceRange: { readonly minCents: number; readonly maxCents: number };
}

const EMPTY_RANGE = { minCents: 0, maxCents: 0 } as const;

/** Build a facet summary (brand + category counts + price range). Pure. */
export function summariseBaseFacets<T extends BaseProduct>(products: readonly T[]): BaseFacetSummary {
  const brands = new Map<string, number>();
  const categories = new Map<string, number>();

  if (products.length === 0) {
    return { brandCounts: brands, categoryCounts: categories, priceRange: EMPTY_RANGE };
  }

  let minCents = Number.POSITIVE_INFINITY;
  let maxCents = Number.NEGATIVE_INFINITY;

  for (const product of products) {
    brands.set(product.brand, (brands.get(product.brand) ?? 0) + 1);
    categories.set(product.category, (categories.get(product.category) ?? 0) + 1);
    if (product.priceCents < minCents) {
      minCents = product.priceCents;
    }
    if (product.priceCents > maxCents) {
      maxCents = product.priceCents;
    }
  }
  return {
    brandCounts: brands,
    categoryCounts: categories,
    priceRange: { minCents, maxCents },
  };
}
