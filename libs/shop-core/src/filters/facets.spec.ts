import { describe, expect, it } from 'vitest';

import type { BaseProduct } from '../models/product.js';
import { summariseBaseFacets } from './facets.js';

function product(id: string, overrides: Partial<BaseProduct> = {}): BaseProduct {
  return {
    id,
    name: id,
    brand: 'Acme',
    priceCents: 5000,
    oldPriceCents: null,
    imageUrl: '',
    description: '',
    stock: 1,
    rating: 4,
    reviewCount: 10,
    category: 'foo',
    tags: [],
    ...overrides,
  };
}

describe('summariseBaseFacets', () => {
  it('returns empty maps + zero range for empty input', () => {
    const summary = summariseBaseFacets([]);
    expect(summary.brandCounts.size).toBe(0);
    expect(summary.categoryCounts.size).toBe(0);
    expect(summary.priceRange).toEqual({ minCents: 0, maxCents: 0 });
  });

  it('counts brands and categories', () => {
    const summary = summariseBaseFacets([
      product('1'),
      product('2'),
      product('3', { brand: 'Other', category: 'bar' }),
    ]);
    expect(summary.brandCounts.get('Acme')).toBe(2);
    expect(summary.brandCounts.get('Other')).toBe(1);
    expect(summary.categoryCounts.get('foo')).toBe(2);
    expect(summary.categoryCounts.get('bar')).toBe(1);
  });

  it('computes the price range', () => {
    const summary = summariseBaseFacets([
      product('1', { priceCents: 3000 }),
      product('2', { priceCents: 8000 }),
      product('3', { priceCents: 5000 }),
    ]);
    expect(summary.priceRange).toEqual({ minCents: 3000, maxCents: 8000 });
  });
});
