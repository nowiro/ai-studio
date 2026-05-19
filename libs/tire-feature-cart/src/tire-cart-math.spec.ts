import { describe, expect, it } from 'vitest';

// Type-only import — does not trigger Angular DI evaluation at runtime, so we
// can use the proper Nx barrel without breaking pure-Node vitest.
import type { Tire } from '@ai-studio/tire-data';

import {
  buildTireCartView,
  BULK_DISCOUNT_RATE,
  freeMountingEligible,
  mergeTireLines,
  MOUNTING_FEE_PER_TIRE_CENTS,
  mountingSavings,
  SET_SIZE,
  tireBulkDiscount,
  tireCartCount,
  tireCartTotal,
  tireCartTotalAfterDiscount,
  tireSetsOfFour,
} from './tire-cart-math.js';

function tire(id: string, priceCents: number): Tire {
  return {
    id,
    brand: 'Continental',
    model: id.toUpperCase(),
    size: { width: 205, profile: 55, diameter: 16 },
    season: 'summer',
    speedIndex: 'V',
    loadIndex: 91,
    euLabel: { fuel: 'B', wet: 'A', noiseDb: 70 },
    priceCents,
    oldPriceCents: null,
    stock: 24,
    rating: 4.5,
    reviewCount: 100,
    imageUrl: '',
    description: '',
  };
}

describe('tireCartCount', () => {
  it('sums quantities across every line', () => {
    expect(
      tireCartCount([
        { tireId: 'a', quantity: 2 },
        { tireId: 'b', quantity: 3 },
      ]),
    ).toBe(5);
  });

  it('returns 0 for an empty cart', () => {
    expect(tireCartCount([])).toBe(0);
  });
});

describe('tireSetsOfFour', () => {
  it('counts full same-SKU sets only', () => {
    // 8 / 4 = 2 sets of A; 5 / 4 = 1 set of B (+ 1 loose tire ignored).
    expect(
      tireSetsOfFour([
        { tireId: 'a', quantity: 8 },
        { tireId: 'b', quantity: 5 },
      ]),
    ).toBe(3);
  });

  it('does not combine partial sets across SKUs', () => {
    // 2 + 2 of different SKUs is 0 full same-SKU sets, even though count is 4.
    expect(
      tireSetsOfFour([
        { tireId: 'a', quantity: 2 },
        { tireId: 'b', quantity: 2 },
      ]),
    ).toBe(0);
  });
});

describe('buildTireCartView', () => {
  it('joins lines with their tire and computes subtotals', () => {
    const tires = [tire('a', 10000), tire('b', 20000)];
    const lines = [
      { tireId: 'a', quantity: 2 },
      { tireId: 'b', quantity: 1 },
    ];
    const views = buildTireCartView(lines, tires);
    expect(views).toHaveLength(2);
    expect(views[0].subtotalCents).toBe(20000);
    expect(views[1].subtotalCents).toBe(20000);
  });

  it('silently drops lines whose tire is no longer in the catalogue', () => {
    expect(buildTireCartView([{ tireId: 'ghost', quantity: 1 }], [tire('a', 10000)])).toEqual([]);
  });
});

describe('tireBulkDiscount', () => {
  it('returns zero when no SKU reaches a full set of four', () => {
    const views = buildTireCartView(
      [
        { tireId: 'a', quantity: 3 },
        { tireId: 'b', quantity: 2 },
      ],
      [tire('a', 10000), tire('b', 20000)],
    );
    expect(tireBulkDiscount(views)).toBe(0);
  });

  it('applies 5 % off to every tire belonging to a full same-SKU set of four', () => {
    // 4 × 10000 grosze × 0.05 = 2000 grosze (20 zł).
    const views = buildTireCartView([{ tireId: 'a', quantity: 4 }], [tire('a', 10000)]);
    expect(tireBulkDiscount(views)).toBe(Math.round(10000 * 4 * BULK_DISCOUNT_RATE));
    expect(tireBulkDiscount(views)).toBe(2000);
  });

  it('only discounts tires inside full sets — loose tires pay full price', () => {
    // 5 tires of A @ 10000: only 4 are in a full set → 4 × 10000 × 0.05 = 2000.
    const views = buildTireCartView([{ tireId: 'a', quantity: 5 }], [tire('a', 10000)]);
    expect(tireBulkDiscount(views)).toBe(2000);
  });
});

describe('freeMountingEligible & mountingSavings', () => {
  it('is eligible once the total quantity reaches the set size', () => {
    expect(freeMountingEligible([{ tireId: 'a', quantity: SET_SIZE }])).toBe(true);
    expect(
      freeMountingEligible([
        { tireId: 'a', quantity: 2 },
        { tireId: 'b', quantity: 2 },
      ]),
    ).toBe(true);
  });

  it('is not eligible below the set size', () => {
    expect(freeMountingEligible([{ tireId: 'a', quantity: 3 }])).toBe(false);
  });

  it('reports the savings as the per-tire mounting fee × total quantity once eligible', () => {
    expect(mountingSavings([{ tireId: 'a', quantity: SET_SIZE }])).toBe(MOUNTING_FEE_PER_TIRE_CENTS * SET_SIZE);
    expect(mountingSavings([{ tireId: 'a', quantity: 3 }])).toBe(0);
  });
});

describe('tireCartTotal & tireCartTotalAfterDiscount', () => {
  it('sums per-line subtotals into the gross total', () => {
    const views = buildTireCartView(
      [
        { tireId: 'a', quantity: 2 },
        { tireId: 'b', quantity: 1 },
      ],
      [tire('a', 10000), tire('b', 5500)],
    );
    expect(tireCartTotal(views)).toBe(25500);
  });

  it('subtracts the bulk discount from the gross total and clamps to zero', () => {
    // 4 × 10000 = 40000 gross. Discount = 2000. After-discount = 38000.
    const views = buildTireCartView([{ tireId: 'a', quantity: 4 }], [tire('a', 10000)]);
    expect(tireCartTotalAfterDiscount(views)).toBe(38000);
  });
});

describe('mergeTireLines', () => {
  it('tops up existing SKUs by summing quantities', () => {
    expect(
      mergeTireLines(
        [{ tireId: 'a', quantity: 1 }],
        [
          { tireId: 'a', quantity: 2 },
          { tireId: 'b', quantity: 1 },
        ],
      ),
    ).toEqual([
      { tireId: 'a', quantity: 3 },
      { tireId: 'b', quantity: 1 },
    ]);
  });

  it('drops a line when the merged total is zero or negative', () => {
    expect(mergeTireLines([{ tireId: 'a', quantity: 1 }], [{ tireId: 'a', quantity: -2 }])).toEqual([]);
  });

  it('treats removal followed by re-add as a new line', () => {
    const afterRemove = mergeTireLines([{ tireId: 'a', quantity: 1 }], [{ tireId: 'a', quantity: -1 }]);
    expect(afterRemove).toEqual([]);
    expect(mergeTireLines(afterRemove, [{ tireId: 'a', quantity: 4 }])).toEqual([{ tireId: 'a', quantity: 4 }]);
  });
});
