import { describe, expect, it } from 'vitest';

import type { BaseProduct } from '../models/product.js';
import { popularityScore, sortProducts } from './sorting.js';

function product(id: string, overrides: Partial<BaseProduct> = {}): BaseProduct {
  return {
    id,
    name: id.toUpperCase(),
    brand: 'B',
    priceCents: 5000,
    oldPriceCents: null,
    imageUrl: '',
    description: '',
    stock: 5,
    rating: 4.5,
    reviewCount: 100,
    category: 'foo',
    tags: [],
    ...overrides,
  };
}

describe('sortProducts', () => {
  const a = product('a', { priceCents: 3000, rating: 4.5, reviewCount: 50, name: 'Alpha' });
  const b = product('b', { priceCents: 5000, rating: 4.8, reviewCount: 200, name: 'Beta' });
  const c = product('c', { priceCents: 4000, rating: 4.2, reviewCount: 10, name: 'Gamma' });
  const list = [a, b, c];

  it('does not mutate the input', () => {
    const before = [...list];
    sortProducts(list, 'price-asc');
    expect(list).toEqual(before);
  });

  it('sorts by price ascending', () => {
    expect(sortProducts(list, 'price-asc').map((p) => p.id)).toEqual(['a', 'c', 'b']);
  });

  it('sorts by price descending', () => {
    expect(sortProducts(list, 'price-desc').map((p) => p.id)).toEqual(['b', 'c', 'a']);
  });

  it('sorts by rating descending', () => {
    expect(sortProducts(list, 'rating-desc').map((p) => p.id)).toEqual(['b', 'a', 'c']);
  });

  it('sorts by name ascending', () => {
    expect(sortProducts(list, 'name-asc').map((p) => p.id)).toEqual(['a', 'b', 'c']);
  });

  it('sorts by popularity (rating × log(reviews + 1))', () => {
    expect(sortProducts(list, 'popularity').map((p) => p.id)).toEqual(['b', 'a', 'c']);
  });

  it('breaks ties stably by id', () => {
    const x = product('x', { priceCents: 4000 });
    const y = product('y', { priceCents: 4000 });
    expect(sortProducts([y, x], 'price-asc').map((p) => p.id)).toEqual(['x', 'y']);
  });
});

describe('popularityScore', () => {
  it('returns 0 when reviewCount is 0', () => {
    expect(popularityScore(product('z', { reviewCount: 0, rating: 5 }))).toBe(0);
  });
});
