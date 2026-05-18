import { describe, expect, it } from 'vitest';

import type { BaseProduct } from '../models/product.js';
import { buildCartView, cartCount, cartTotal, mergeLines } from './cart-math.js';

function product(id: string, priceCents: number): BaseProduct {
  return {
    id,
    name: id,
    brand: 'B',
    priceCents,
    oldPriceCents: null,
    imageUrl: '',
    description: '',
    stock: 1,
    rating: 4,
    reviewCount: 1,
    category: 'foo',
    tags: [],
  };
}

describe('buildCartView', () => {
  it('joins lines with products and computes subtotals', () => {
    const catalogue = new Map<string, BaseProduct>([
      ['a', product('a', 10000)],
      ['b', product('b', 20000)],
    ]);
    const lookup = (id: string): BaseProduct | null => catalogue.get(id) ?? null;
    const lines = [
      { productId: 'a', quantity: 2 },
      { productId: 'b', quantity: 1 },
    ];
    const views = buildCartView(lines, lookup);
    expect(views).toHaveLength(2);
    expect(views[0].subtotalCents).toBe(20000);
    expect(views[1].subtotalCents).toBe(20000);
  });

  it('skips lines whose product lookup returns null', () => {
    expect(buildCartView([{ productId: 'ghost', quantity: 1 }], () => null)).toEqual([]);
  });
});

describe('cartTotal', () => {
  it('sums subtotals; 0 for empty', () => {
    expect(cartTotal([])).toBe(0);
    expect(
      cartTotal([
        { line: { productId: 'a', quantity: 2 }, product: product('a', 10000), subtotalCents: 20000 },
        { line: { productId: 'b', quantity: 1 }, product: product('b', 5500), subtotalCents: 5500 },
      ]),
    ).toBe(25500);
  });
});

describe('cartCount', () => {
  it('sums quantities', () => {
    expect(
      cartCount([
        { productId: 'a', quantity: 2 },
        { productId: 'b', quantity: 3 },
      ]),
    ).toBe(5);
  });
});

describe('mergeLines', () => {
  it('sums quantities of overlapping ids', () => {
    expect(
      mergeLines(
        [{ productId: 'a', quantity: 1 }],
        [
          { productId: 'a', quantity: 2 },
          { productId: 'b', quantity: 1 },
        ],
      ),
    ).toEqual([
      { productId: 'a', quantity: 3 },
      { productId: 'b', quantity: 1 },
    ]);
  });

  it('drops entries with non-positive quantity', () => {
    expect(mergeLines([{ productId: 'a', quantity: 1 }], [{ productId: 'a', quantity: -1 }])).toEqual([]);
  });
});
