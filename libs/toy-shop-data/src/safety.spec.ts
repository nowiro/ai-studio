import { describe, expect, it } from 'vitest';

import {
  ageRangeMinYears,
  compareSafety,
  formatBadgeLabel,
  requiresAgeGate,
  type SafetyBadge,
  type ToyProduct,
} from './safety.js';

function makeProduct(overrides: Partial<ToyProduct> = {}): ToyProduct {
  return {
    id: 'p-1',
    name: 'Test Toy',
    priceGrosze: 9999,
    ageRange: '3-6',
    badges: [],
    ...overrides,
  };
}

describe('ageRangeMinYears', () => {
  it.each([
    ['0-3', 0],
    ['3-6', 3],
    ['6-12', 6],
    ['12+', 12],
  ] as const)('maps %s to %d', (range, expected) => {
    expect(ageRangeMinYears(range)).toBe(expected);
  });
});

describe('formatBadgeLabel', () => {
  it('labels small_parts with the minimum age', () => {
    expect(formatBadgeLabel({ kind: 'small_parts', minAge: 3 })).toBe('Małe części (3+)');
  });

  it('labels magnets with the minimum age', () => {
    expect(formatBadgeLabel({ kind: 'magnets', minAge: 6 })).toBe('Magnesy (6+)');
  });

  it('labels battery_required with count and battery type', () => {
    expect(formatBadgeLabel({ kind: 'battery_required', type: 'AA', count: 2 })).toBe('Wymaga baterii 2x AA');
    expect(formatBadgeLabel({ kind: 'battery_required', type: 'AAA', count: 4 })).toBe('Wymaga baterii 4x AAA');
    expect(formatBadgeLabel({ kind: 'battery_required', type: '9V', count: 1 })).toBe('Wymaga baterii 1x 9V');
    expect(formatBadgeLabel({ kind: 'battery_required', type: 'button', count: 3 })).toBe(
      'Wymaga baterii 3x guzikowych',
    );
  });

  it('labels sharp_edges', () => {
    expect(formatBadgeLabel({ kind: 'sharp_edges' })).toBe('Ostre krawędzie');
  });

  it('labels flammable_material', () => {
    expect(formatBadgeLabel({ kind: 'flammable_material' })).toBe('Materiał łatwopalny');
  });

  it('labels allergy_risk with the allergen', () => {
    expect(formatBadgeLabel({ kind: 'allergy_risk', allergen: 'lateks' })).toBe('Ryzyko alergii: lateks');
  });
});

describe('requiresAgeGate', () => {
  it('returns not gated when there are no badges, even for unknown age', () => {
    const product = makeProduct({ badges: [] });
    expect(requiresAgeGate(product, null)).toEqual({ gated: false, reasons: [] });
    expect(requiresAgeGate(product, 0)).toEqual({ gated: false, reasons: [] });
  });

  it('returns not gated when only non-age badges are present and customer age is unknown', () => {
    const badges: readonly SafetyBadge[] = [
      { kind: 'battery_required', type: 'AA', count: 2 },
      { kind: 'sharp_edges' },
      { kind: 'flammable_material' },
      { kind: 'allergy_risk', allergen: 'orzechy' },
    ];
    const product = makeProduct({ badges });
    expect(requiresAgeGate(product, null)).toEqual({ gated: false, reasons: [] });
  });

  it('gates when customer age is unknown and an age-restricted badge is present', () => {
    const product = makeProduct({
      badges: [{ kind: 'small_parts', minAge: 3 }],
    });
    const decision = requiresAgeGate(product, null);
    expect(decision.gated).toBe(true);
    expect(decision.reasons).toHaveLength(1);
    expect(decision.reasons[0]).toContain('Małe części (3+)');
    expect(decision.reasons[0]).toContain('3+');
  });

  it('does not gate when customer age meets the threshold', () => {
    const product = makeProduct({
      badges: [
        { kind: 'small_parts', minAge: 3 },
        { kind: 'magnets', minAge: 6 },
      ],
    });
    expect(requiresAgeGate(product, 6)).toEqual({ gated: false, reasons: [] });
    expect(requiresAgeGate(product, 10)).toEqual({ gated: false, reasons: [] });
  });

  it('gates when customer age is below the threshold and surfaces the deficit', () => {
    const product = makeProduct({
      badges: [{ kind: 'magnets', minAge: 6 }],
    });
    const decision = requiresAgeGate(product, 4);
    expect(decision.gated).toBe(true);
    expect(decision.reasons).toHaveLength(1);
    expect(decision.reasons[0]).toContain('Magnesy (6+)');
    expect(decision.reasons[0]).toContain('klient ma 4');
  });

  it('collects multiple reasons across badges', () => {
    const product = makeProduct({
      badges: [
        { kind: 'small_parts', minAge: 3 },
        { kind: 'magnets', minAge: 6 },
        { kind: 'sharp_edges' }, // not age-restricted — must NOT contribute
      ],
    });
    const decision = requiresAgeGate(product, 2);
    expect(decision.gated).toBe(true);
    expect(decision.reasons).toHaveLength(2);
    expect(decision.reasons.some((r) => r.includes('Małe części (3+)'))).toBe(true);
    expect(decision.reasons.some((r) => r.includes('Magnesy (6+)'))).toBe(true);
    expect(decision.reasons.some((r) => r.includes('Ostre krawędzie'))).toBe(false);
  });

  it('fully gates a zero-year-old customer when age-restricted badges exist', () => {
    const product = makeProduct({
      badges: [
        { kind: 'small_parts', minAge: 3 },
        { kind: 'magnets', minAge: 6 },
      ],
    });
    const decision = requiresAgeGate(product, 0);
    expect(decision.gated).toBe(true);
    expect(decision.reasons).toHaveLength(2);
  });

  it('does not gate at the exact threshold boundary', () => {
    const product = makeProduct({
      badges: [{ kind: 'small_parts', minAge: 3 }],
    });
    expect(requiresAgeGate(product, 3).gated).toBe(false);
  });
});

describe('compareSafety', () => {
  it('places the product with fewer badges first', () => {
    const safer = makeProduct({ id: 'safer', badges: [] });
    const riskier = makeProduct({
      id: 'riskier',
      badges: [{ kind: 'sharp_edges' }, { kind: 'flammable_material' }],
    });
    expect(compareSafety(safer, riskier)).toBe(-1);
    expect(compareSafety(riskier, safer)).toBe(1);
  });

  it('breaks ties by lower ageRange minimum (younger-friendly first)', () => {
    const young = makeProduct({ id: 'young', ageRange: '0-3', badges: [] });
    const older = makeProduct({ id: 'older', ageRange: '12+', badges: [] });
    expect(compareSafety(young, older)).toBe(-1);
    expect(compareSafety(older, young)).toBe(1);
  });

  it('returns 0 for identical badge count and ageRange', () => {
    const a = makeProduct({ id: 'a', ageRange: '6-12', badges: [{ kind: 'sharp_edges' }] });
    const b = makeProduct({ id: 'b', ageRange: '6-12', badges: [{ kind: 'flammable_material' }] });
    expect(compareSafety(a, b)).toBe(0);
  });

  it('sorts a catalogue safest-first', () => {
    const items: readonly ToyProduct[] = [
      makeProduct({
        id: 'risky',
        badges: [{ kind: 'small_parts', minAge: 3 }, { kind: 'magnets', minAge: 6 }, { kind: 'sharp_edges' }],
      }),
      makeProduct({ id: 'safe', badges: [] }),
      makeProduct({ id: 'medium', badges: [{ kind: 'battery_required', type: 'AA', count: 2 }] }),
    ];
    const sorted = [...items].sort(compareSafety);
    expect(sorted.map((i) => i.id)).toEqual(['safe', 'medium', 'risky']);
  });
});
