import type { TireSortKey } from '../models/filters.js';
import type { EuLabelGrade, Tire } from '../models/tire.js';
import { EU_LABEL_GRADES } from '../models/tire.js';

/** Lower number = better grade. Returns 5 for unknown for graceful sort. */
function gradeRank(grade: EuLabelGrade): number {
  const index = EU_LABEL_GRADES.indexOf(grade);
  return index === -1 ? EU_LABEL_GRADES.length : index;
}

/** Composite EU label score: fuel + wet + noise/10. Lower = better. */
export function euLabelScore(tire: Tire): number {
  return gradeRank(tire.euLabel.fuel) + gradeRank(tire.euLabel.wet) + tire.euLabel.noiseDb / 10;
}

/** Popularity = rating * log(reviewCount + 1). Higher = better. */
export function popularityScore(tire: Tire): number {
  return tire.rating * Math.log(tire.reviewCount + 1);
}

/**
 * Pure sort: returns a new array sorted by the chosen key. Stable across runs
 * because we never mutate the input and we break ties on `id`.
 */
export function sortTires(tires: readonly Tire[], sort: TireSortKey): readonly Tire[] {
  const copy = [...tires];
  switch (sort) {
    case 'price-asc': {
      copy.sort((a, b) => a.priceCents - b.priceCents || a.id.localeCompare(b.id));
      return copy;
    }
    case 'price-desc': {
      copy.sort((a, b) => b.priceCents - a.priceCents || a.id.localeCompare(b.id));
      return copy;
    }
    case 'eu-label': {
      copy.sort((a, b) => euLabelScore(a) - euLabelScore(b) || a.id.localeCompare(b.id));
      return copy;
    }
    case 'rating-desc': {
      copy.sort((a, b) => b.rating - a.rating || a.id.localeCompare(b.id));
      return copy;
    }
    case 'popularity':
    default: {
      copy.sort((a, b) => popularityScore(b) - popularityScore(a) || a.id.localeCompare(b.id));
      return copy;
    }
  }
}
