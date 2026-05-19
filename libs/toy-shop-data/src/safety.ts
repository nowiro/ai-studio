/**
 * Toy safety domain — discriminated `SafetyBadge` union, age-gate logic and
 * pure helpers. Labels surfaced to humans are in Polish; identifiers, kinds
 * and code are in English.
 *
 * @packageDocumentation
 */

/** Coarse age range printed on packaging and used to pre-bucket products. */
export type AgeRange = '0-3' | '3-6' | '6-12' | '12+';

/** Discriminated union of safety markings a toy can carry. */
export type SafetyBadge =
  | { readonly kind: 'small_parts'; readonly minAge: number }
  | { readonly kind: 'magnets'; readonly minAge: number }
  | {
      readonly kind: 'battery_required';
      readonly type: 'AA' | 'AAA' | '9V' | 'button';
      readonly count: number;
    }
  | { readonly kind: 'sharp_edges' }
  | { readonly kind: 'flammable_material' }
  | { readonly kind: 'allergy_risk'; readonly allergen: string };

/** A toy item enriched with its safety badges. */
export interface ToyProduct {
  readonly id: string;
  readonly name: string;
  readonly priceGrosze: number;
  readonly ageRange: AgeRange;
  readonly badges: readonly SafetyBadge[];
}

/** Outcome of {@link requiresAgeGate}. */
export interface AgeGateDecision {
  readonly gated: boolean;
  readonly reasons: readonly string[];
}

/** Minimum recommended age (in years) implied by an {@link AgeRange}. */
export function ageRangeMinYears(range: AgeRange): number {
  switch (range) {
    case '0-3':
      return 0;
    case '3-6':
      return 3;
    case '6-12':
      return 6;
    case '12+':
      return 12;
  }
}

/**
 * Polish, human-readable label for a {@link SafetyBadge}.
 *
 * @example
 * formatBadgeLabel({ kind: 'small_parts', minAge: 3 }); // "Małe części (3+)"
 */
export function formatBadgeLabel(badge: SafetyBadge): string {
  switch (badge.kind) {
    case 'small_parts':
      return `Małe części (${badge.minAge}+)`;
    case 'magnets':
      return `Magnesy (${badge.minAge}+)`;
    case 'battery_required':
      return `Wymaga baterii ${badge.count}x ${batteryLabel(badge.type)}`;
    case 'sharp_edges':
      return 'Ostre krawędzie';
    case 'flammable_material':
      return 'Materiał łatwopalny';
    case 'allergy_risk':
      return `Ryzyko alergii: ${badge.allergen}`;
  }
}

function batteryLabel(type: 'AA' | 'AAA' | '9V' | 'button'): string {
  return type === 'button' ? 'guzikowych' : type;
}

/**
 * Decide whether a sale requires an age-gate dialog.
 *
 * Returns `gated: true` when:
 * - the customer age is unknown (`null`) and any badge carries an age threshold, or
 * - the customer age is below any badge's `minAge`.
 *
 * Reasons are Polish, badge-label friendly strings.
 */
export function requiresAgeGate(product: ToyProduct, customerAge: number | null): AgeGateDecision {
  const reasons: string[] = [];

  for (const badge of product.badges) {
    const minAge = badgeMinAge(badge);
    if (minAge === null) continue;

    if (customerAge === null) {
      reasons.push(`${formatBadgeLabel(badge)} — wymagany wiek ${minAge}+`);
      continue;
    }
    if (customerAge < minAge) {
      reasons.push(`${formatBadgeLabel(badge)} — wymagany wiek ${minAge}+, klient ma ${customerAge}`);
    }
  }

  return { gated: reasons.length > 0, reasons };
}

/** Extracts the minimum-age threshold a badge enforces, if any. */
function badgeMinAge(badge: SafetyBadge): number | null {
  switch (badge.kind) {
    case 'small_parts':
    case 'magnets':
      return badge.minAge;
    case 'battery_required':
    case 'sharp_edges':
    case 'flammable_material':
    case 'allergy_risk':
      return null;
  }
}

/**
 * Sort comparator placing safer products first.
 *
 * A product is considered safer when it carries fewer safety badges. Ties
 * fall back to the lower minimum age implied by `ageRange`, so younger-friendly
 * items come first when the badge counts are equal.
 */
export function compareSafety(a: ToyProduct, b: ToyProduct): -1 | 0 | 1 {
  if (a.badges.length < b.badges.length) return -1;
  if (a.badges.length > b.badges.length) return 1;

  const aMin = ageRangeMinYears(a.ageRange);
  const bMin = ageRangeMinYears(b.ageRange);
  if (aMin < bMin) return -1;
  if (aMin > bMin) return 1;
  return 0;
}
