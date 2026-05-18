import { describe, expect, it } from 'vitest';

import type { Tire } from '../models/tire.js';
import { euLabelScore, popularityScore, sortTires } from './sorting.js';

function tire(id: string, overrides: Partial<Tire> = {}): Tire {
  return {
    id,
    brand: 'Brand',
    model: 'Model',
    size: { width: 205, profile: 55, diameter: 16 },
    season: 'summer',
    speedIndex: 'V',
    loadIndex: 91,
    euLabel: { fuel: 'B', wet: 'A', noiseDb: 70 },
    priceCents: 50000,
    oldPriceCents: null,
    stock: 10,
    rating: 4.5,
    reviewCount: 100,
    imageUrl: 'https://example.com',
    description: '',
    ...overrides,
  };
}

describe('sortTires', () => {
  const a = tire('a', { priceCents: 30000, rating: 4.5, reviewCount: 50 });
  const b = tire('b', { priceCents: 50000, rating: 4.8, reviewCount: 200 });
  const c = tire('c', { priceCents: 40000, rating: 4.2, reviewCount: 10 });
  const list = [a, b, c];

  it('does not mutate the input', () => {
    const before = [...list];
    sortTires(list, 'price-asc');
    expect(list).toEqual(before);
  });

  it('sorts by price ascending', () => {
    expect(sortTires(list, 'price-asc').map((t) => t.id)).toEqual(['a', 'c', 'b']);
  });

  it('sorts by price descending', () => {
    expect(sortTires(list, 'price-desc').map((t) => t.id)).toEqual(['b', 'c', 'a']);
  });

  it('sorts by rating descending', () => {
    expect(sortTires(list, 'rating-desc').map((t) => t.id)).toEqual(['b', 'a', 'c']);
  });

  it('sorts by popularity (rating × log(reviews+1))', () => {
    expect(sortTires(list, 'popularity').map((t) => t.id)).toEqual(['b', 'a', 'c']);
  });

  it('sorts by EU label composite score (lower is better)', () => {
    const lowest = tire('low', { euLabel: { fuel: 'A', wet: 'A', noiseDb: 65 } });
    const highest = tire('high', { euLabel: { fuel: 'D', wet: 'C', noiseDb: 75 } });
    expect(sortTires([highest, lowest], 'eu-label').map((t) => t.id)).toEqual(['low', 'high']);
  });

  it('breaks ties stably by id', () => {
    const x = tire('x', { priceCents: 40000 });
    const y = tire('y', { priceCents: 40000 });
    expect(sortTires([y, x], 'price-asc').map((t) => t.id)).toEqual(['x', 'y']);
  });
});

describe('euLabelScore', () => {
  it('returns a lower score for better grades', () => {
    const great = tire('g', { euLabel: { fuel: 'A', wet: 'A', noiseDb: 65 } });
    const poor = tire('p', { euLabel: { fuel: 'E', wet: 'E', noiseDb: 75 } });
    expect(euLabelScore(great)).toBeLessThan(euLabelScore(poor));
  });
});

describe('popularityScore', () => {
  it('returns 0 when there are no reviews', () => {
    expect(popularityScore(tire('z', { reviewCount: 0, rating: 5 }))).toBe(0);
  });

  it('grows with rating and review count', () => {
    const few = tire('f', { rating: 4, reviewCount: 5 });
    const many = tire('m', { rating: 4, reviewCount: 500 });
    expect(popularityScore(few)).toBeLessThan(popularityScore(many));
  });
});
