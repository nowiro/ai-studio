import type { TireFilters } from '../models/filters.js';
import type { Tire } from '../models/tire.js';

/**
 * Decide whether a tire passes all active facets. Empty sets / nullable
 * dimensions mean "no constraint on this axis". Free-text `query` is matched
 * case-insensitively against brand + model + raw size string.
 *
 * The implementation delegates each facet to a small predicate so the
 * cognitive-complexity budget stays under the lint threshold.
 */
export function matchesFilters(tire: Tire, filters: TireFilters): boolean {
  return (
    matchesSetFacet(filters.brands, tire.brand) &&
    matchesSetFacet(filters.seasons, tire.season) &&
    matchesSetFacet(filters.euFuel, tire.euLabel.fuel) &&
    matchesSetFacet(filters.euWet, tire.euLabel.wet) &&
    matchesSetFacet(filters.speedIndices, tire.speedIndex) &&
    matchesDimension(filters.width, tire.size.width) &&
    matchesDimension(filters.profile, tire.size.profile) &&
    matchesDimension(filters.diameter, tire.size.diameter) &&
    matchesPriceFloor(filters.minPriceCents, tire.priceCents) &&
    matchesPriceCeiling(filters.maxPriceCents, tire.priceCents) &&
    matchesStock(filters.inStockOnly, tire.stock) &&
    matchesQuery(tire, filters.query)
  );
}

function matchesSetFacet<T>(set: ReadonlySet<T>, value: T): boolean {
  return set.size === 0 || set.has(value);
}

function matchesDimension(expected: number | null, actual: number): boolean {
  return expected === null || expected === actual;
}

function matchesPriceFloor(min: number | null, price: number): boolean {
  return min === null || price >= min;
}

function matchesPriceCeiling(max: number | null, price: number): boolean {
  return max === null || price <= max;
}

function matchesStock(inStockOnly: boolean, stock: number): boolean {
  return !inStockOnly || stock > 0;
}

/** True if any of brand / model / "WWW/PP RDD" stringification contains the query. */
function matchesQuery(tire: Tire, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (needle.length === 0) {
    return true;
  }
  const haystack =
    `${tire.brand} ${tire.model} ${tire.size.width}/${tire.size.profile} R${tire.size.diameter}`.toLowerCase();
  return haystack.includes(needle);
}

/** Apply a filter to a list and return a new array (immutable in / immutable out). */
export function applyFilters(tires: readonly Tire[], filters: TireFilters): readonly Tire[] {
  return tires.filter((tire) => matchesFilters(tire, filters));
}
