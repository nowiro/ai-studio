import type { EuLabelGrade, SpeedIndex, TireSeason } from './tire.js';

/**
 * Active facet selection. Empty sets mean "no constraint". Width / profile /
 * diameter are nullable rather than `0` so the user can leave one dimension blank.
 */
export interface TireFilters {
  readonly brands: ReadonlySet<string>;
  readonly seasons: ReadonlySet<TireSeason>;
  readonly euFuel: ReadonlySet<EuLabelGrade>;
  readonly euWet: ReadonlySet<EuLabelGrade>;
  readonly speedIndices: ReadonlySet<SpeedIndex>;
  readonly width: number | null;
  readonly profile: number | null;
  readonly diameter: number | null;
  readonly minPriceCents: number | null;
  readonly maxPriceCents: number | null;
  readonly inStockOnly: boolean;
  readonly query: string;
}

/** Initial / "no filter" baseline. */
export const EMPTY_FILTERS: TireFilters = {
  brands: new Set(),
  seasons: new Set(),
  euFuel: new Set(),
  euWet: new Set(),
  speedIndices: new Set(),
  width: null,
  profile: null,
  diameter: null,
  minPriceCents: null,
  maxPriceCents: null,
  inStockOnly: false,
  query: '',
};

/** Sort options exposed in the catalogue dropdown. */
export type TireSortKey = 'popularity' | 'price-asc' | 'price-desc' | 'eu-label' | 'rating-desc';

export const TIRE_SORT_KEYS: readonly TireSortKey[] = [
  'popularity',
  'price-asc',
  'price-desc',
  'eu-label',
  'rating-desc',
];
