import { describe, expect, it } from 'vitest';

import { applyBulkPricing, type BulkPricingScheme, formatPricingBadge, validateScheme } from './bulk-pricing.js';

/** Reusable scheme — base 100,00 PLN (10000 grosze) with three tiers. */
const SAMPLE_SCHEME: BulkPricingScheme = {
  basePriceGrosze: 10000,
  tiers: [
    { minQty: 10, unitPriceGrosze: 9500 }, // 5% off
    { minQty: 50, unitPriceGrosze: 9000 }, // 10% off
    { minQty: 100, unitPriceGrosze: 8000 }, // 20% off
  ],
};

describe('applyBulkPricing', () => {
  it('uses the base price when qty=1 (below first tier threshold)', () => {
    const result = applyBulkPricing(SAMPLE_SCHEME, 1);
    expect(result).toEqual({
      unitPriceGrosze: 10000,
      totalGrosze: 10000,
      tierApplied: null,
      savingsGrosze: 0,
    });
  });

  it('uses the base price when qty is just below first tier', () => {
    const result = applyBulkPricing(SAMPLE_SCHEME, 9);
    expect(result.unitPriceGrosze).toBe(10000);
    expect(result.tierApplied).toBeNull();
    expect(result.totalGrosze).toBe(90000);
  });

  it('applies the first tier when qty=10 (exactly at minQty)', () => {
    const result = applyBulkPricing(SAMPLE_SCHEME, 10);
    expect(result.unitPriceGrosze).toBe(9500);
    expect(result.tierApplied).toBe(0);
    expect(result.totalGrosze).toBe(95000);
    expect(result.savingsGrosze).toBe(5000); // (10000 - 9500) * 10
  });

  it('applies the highest applicable tier when qty=100', () => {
    const result = applyBulkPricing(SAMPLE_SCHEME, 100);
    expect(result.unitPriceGrosze).toBe(8000);
    expect(result.tierApplied).toBe(2);
    expect(result.totalGrosze).toBe(800000);
    expect(result.savingsGrosze).toBe(200000); // (10000 - 8000) * 100
  });

  it('applies middle tier when qty falls between thresholds (qty=75 → 2nd tier)', () => {
    const result = applyBulkPricing(SAMPLE_SCHEME, 75);
    expect(result.unitPriceGrosze).toBe(9000);
    expect(result.tierApplied).toBe(1);
    expect(result.savingsGrosze).toBe(75000); // (10000 - 9000) * 75
  });

  it('computes savings as zero when no tier applies', () => {
    const result = applyBulkPricing(SAMPLE_SCHEME, 5);
    expect(result.savingsGrosze).toBe(0);
  });

  it('falls back to base price when the scheme has no tiers', () => {
    const flat: BulkPricingScheme = { basePriceGrosze: 4999, tiers: [] };
    const result = applyBulkPricing(flat, 100);
    expect(result).toEqual({
      unitPriceGrosze: 4999,
      totalGrosze: 499900,
      tierApplied: null,
      savingsGrosze: 0,
    });
  });

  it('returns zero total when qty=0', () => {
    const result = applyBulkPricing(SAMPLE_SCHEME, 0);
    expect(result.totalGrosze).toBe(0);
    expect(result.savingsGrosze).toBe(0);
    expect(result.tierApplied).toBeNull();
  });

  it('throws RangeError on negative qty', () => {
    expect(() => applyBulkPricing(SAMPLE_SCHEME, -1)).toThrow(RangeError);
  });

  it('throws RangeError on non-integer qty', () => {
    expect(() => applyBulkPricing(SAMPLE_SCHEME, 2.5)).toThrow(RangeError);
  });
});

describe('formatPricingBadge', () => {
  it('formats the first tier as "Od X szt. - Y% taniej"', () => {
    expect(formatPricingBadge(SAMPLE_SCHEME)).toBe('Od 10 szt. - 5% taniej');
  });

  it('rounds the percent to the nearest integer', () => {
    // Base 1000, first tier 933 → 6.7% off → rounds to 7%.
    const scheme: BulkPricingScheme = {
      basePriceGrosze: 1000,
      tiers: [{ minQty: 5, unitPriceGrosze: 933 }],
    };
    expect(formatPricingBadge(scheme)).toBe('Od 5 szt. - 7% taniej');
  });

  it('returns null when the scheme has no tiers', () => {
    expect(formatPricingBadge({ basePriceGrosze: 1000, tiers: [] })).toBeNull();
  });

  it('returns null when basePriceGrosze is zero (cannot derive percentage)', () => {
    const scheme: BulkPricingScheme = {
      basePriceGrosze: 0,
      tiers: [{ minQty: 10, unitPriceGrosze: 0 }],
    };
    expect(formatPricingBadge(scheme)).toBeNull();
  });
});

describe('validateScheme', () => {
  it('returns no errors for a well-formed scheme', () => {
    expect(validateScheme(SAMPLE_SCHEME)).toEqual([]);
  });

  it('accepts an empty tier list', () => {
    expect(validateScheme({ basePriceGrosze: 1000, tiers: [] })).toEqual([]);
  });

  it('rejects unsorted tiers (minQty not ascending)', () => {
    const bad: BulkPricingScheme = {
      basePriceGrosze: 10000,
      tiers: [
        { minQty: 50, unitPriceGrosze: 9000 },
        { minQty: 10, unitPriceGrosze: 9500 }, // Out of order.
      ],
    };
    const errors = validateScheme(bad);
    expect(errors.some((msg) => msg.includes('sorted ascending'))).toBe(true);
  });

  it('rejects tiers whose price is not strictly decreasing', () => {
    const bad: BulkPricingScheme = {
      basePriceGrosze: 10000,
      tiers: [
        { minQty: 10, unitPriceGrosze: 9500 },
        { minQty: 50, unitPriceGrosze: 9500 }, // Equal price — must be strictly less.
      ],
    };
    const errors = validateScheme(bad);
    expect(errors.some((msg) => msg.includes('monotonically decreasing'))).toBe(true);
  });

  it('rejects a first tier whose price is ≥ basePriceGrosze', () => {
    const bad: BulkPricingScheme = {
      basePriceGrosze: 10000,
      tiers: [{ minQty: 10, unitPriceGrosze: 10000 }],
    };
    const errors = validateScheme(bad);
    expect(errors.some((msg) => msg.includes('monotonically decreasing'))).toBe(true);
  });

  it('rejects a tier with minQty < 1', () => {
    const bad: BulkPricingScheme = {
      basePriceGrosze: 10000,
      tiers: [{ minQty: 0, unitPriceGrosze: 9500 }],
    };
    const errors = validateScheme(bad);
    expect(errors.some((msg) => msg.includes('minQty must be an integer ≥ 1'))).toBe(true);
  });

  it('rejects a negative basePriceGrosze', () => {
    const bad: BulkPricingScheme = { basePriceGrosze: -100, tiers: [] };
    const errors = validateScheme(bad);
    expect(errors.some((msg) => msg.includes('basePriceGrosze'))).toBe(true);
  });

  it('rejects a non-integer unitPriceGrosze', () => {
    const bad: BulkPricingScheme = {
      basePriceGrosze: 10000,
      tiers: [{ minQty: 10, unitPriceGrosze: 9500.5 }],
    };
    const errors = validateScheme(bad);
    expect(errors.some((msg) => msg.includes('unitPriceGrosze'))).toBe(true);
  });
});
