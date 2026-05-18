import type { Tire } from '../models/tire.js';

/**
 * Aggregated facet counts derived from a list of tires. The catalogue panel
 * uses these to show "Continental (12)" next to each checkbox.
 */
export interface FacetSummary {
  readonly brandCounts: ReadonlyMap<string, number>;
  readonly seasonCounts: ReadonlyMap<string, number>;
  readonly widthOptions: readonly number[];
  readonly profileOptions: readonly number[];
  readonly diameterOptions: readonly number[];
  readonly priceRange: { readonly minCents: number; readonly maxCents: number };
}

const EMPTY_RANGE = { minCents: 0, maxCents: 0 } as const;

/** Build a facet summary from a list of tires. Pure: same input → same output. */
export function summariseFacets(tires: readonly Tire[]): FacetSummary {
  const brands = new Map<string, number>();
  const seasons = new Map<string, number>();
  const widths = new Set<number>();
  const profiles = new Set<number>();
  const diameters = new Set<number>();

  if (tires.length === 0) {
    return {
      brandCounts: brands,
      seasonCounts: seasons,
      widthOptions: [],
      profileOptions: [],
      diameterOptions: [],
      priceRange: EMPTY_RANGE,
    };
  }

  let minCents = Number.POSITIVE_INFINITY;
  let maxCents = Number.NEGATIVE_INFINITY;

  for (const tire of tires) {
    brands.set(tire.brand, (brands.get(tire.brand) ?? 0) + 1);
    seasons.set(tire.season, (seasons.get(tire.season) ?? 0) + 1);
    widths.add(tire.size.width);
    profiles.add(tire.size.profile);
    diameters.add(tire.size.diameter);
    if (tire.priceCents < minCents) {
      minCents = tire.priceCents;
    }
    if (tire.priceCents > maxCents) {
      maxCents = tire.priceCents;
    }
  }

  return {
    brandCounts: brands,
    seasonCounts: seasons,
    widthOptions: [...widths].sort((a, b) => a - b),
    profileOptions: [...profiles].sort((a, b) => a - b),
    diameterOptions: [...diameters].sort((a, b) => a - b),
    priceRange: { minCents, maxCents },
  };
}
