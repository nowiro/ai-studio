import { describe, expect, it } from 'vitest';

import type { Tire } from '../models/tire.js';
import { buildCartView, cartCount, cartTotal, formatPln, mergeLines } from './cart-math.js';

function tire(id: string, priceCents: number): Tire {
  return {
    id,
    brand: 'B',
    model: 'M',
    size: { width: 205, profile: 55, diameter: 16 },
    season: 'summer',
    speedIndex: 'V',
    loadIndex: 91,
    euLabel: { fuel: 'B', wet: 'A', noiseDb: 70 },
    priceCents,
    oldPriceCents: null,
    stock: 10,
    rating: 4.5,
    reviewCount: 100,
    imageUrl: '',
    description: '',
  };
}

describe('buildCartView', () => {
  it('joins lines with tires and computes subtotals', () => {
    const tires = [tire('a', 10000), tire('b', 20000)];
    const lines = [
      { tireId: 'a', quantity: 2 },
      { tireId: 'b', quantity: 1 },
    ];
    expect(buildCartView(lines, tires)).toEqual([
      { line: lines[0], tire: tires[0], subtotalCents: 20000 },
      { line: lines[1], tire: tires[1], subtotalCents: 20000 },
    ]);
  });

  it('skips lines whose tireId is unknown', () => {
    expect(buildCartView([{ tireId: 'ghost', quantity: 1 }], [tire('a', 10000)])).toEqual([]);
  });
});

describe('cartTotal', () => {
  it('sums the subtotals', () => {
    const views = [
      { line: { tireId: 'a', quantity: 2 }, tire: tire('a', 10000), subtotalCents: 20000 },
      { line: { tireId: 'b', quantity: 1 }, tire: tire('b', 5500), subtotalCents: 5500 },
    ];
    expect(cartTotal(views)).toBe(25500);
  });

  it('returns 0 for empty input', () => {
    expect(cartTotal([])).toBe(0);
  });
});

describe('cartCount', () => {
  it('sums quantities', () => {
    expect(
      cartCount([
        { tireId: 'a', quantity: 2 },
        { tireId: 'b', quantity: 3 },
      ]),
    ).toBe(5);
  });
});

describe('mergeLines', () => {
  it('sums quantities of overlapping ids', () => {
    expect(
      mergeLines(
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

  it('drops entries with non-positive quantity', () => {
    expect(mergeLines([{ tireId: 'a', quantity: 1 }], [{ tireId: 'a', quantity: -1 }])).toEqual([]);
  });
});

describe('formatPln', () => {
  it('formats integer grosze as PLN with currency suffix', () => {
    const formatted = formatPln(123456);
    expect(formatted).toContain('1');
    expect(formatted).toContain('234,56');
    expect(formatted.toLowerCase()).toContain('zł');
  });

  it('handles zero', () => {
    expect(formatPln(0).toLowerCase()).toContain('zł');
  });
});
