import { describe, expect, it } from 'vitest';

import type { Tire } from '../models/tire.js';
import { summariseFacets } from './facets.js';

function tire(id: string, overrides: Partial<Tire> = {}): Tire {
  return {
    id,
    brand: 'Continental',
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
    imageUrl: '',
    description: '',
    ...overrides,
  };
}

describe('summariseFacets', () => {
  it('returns empty maps + zero range for empty input', () => {
    const summary = summariseFacets([]);
    expect(summary.brandCounts.size).toBe(0);
    expect(summary.seasonCounts.size).toBe(0);
    expect(summary.widthOptions).toEqual([]);
    expect(summary.priceRange).toEqual({ minCents: 0, maxCents: 0 });
  });

  it('counts brands and seasons', () => {
    const list = [
      tire('1', { brand: 'Continental' }),
      tire('2', { brand: 'Continental' }),
      tire('3', { brand: 'Michelin', season: 'winter' }),
    ];
    const summary = summariseFacets(list);
    expect(summary.brandCounts.get('Continental')).toBe(2);
    expect(summary.brandCounts.get('Michelin')).toBe(1);
    expect(summary.seasonCounts.get('summer')).toBe(2);
    expect(summary.seasonCounts.get('winter')).toBe(1);
  });

  it('returns unique sorted size dimensions', () => {
    const list = [
      tire('1', { size: { width: 205, profile: 55, diameter: 16 } }),
      tire('2', { size: { width: 195, profile: 60, diameter: 15 } }),
      tire('3', { size: { width: 205, profile: 55, diameter: 17 } }),
    ];
    const summary = summariseFacets(list);
    expect(summary.widthOptions).toEqual([195, 205]);
    expect(summary.profileOptions).toEqual([55, 60]);
    expect(summary.diameterOptions).toEqual([15, 16, 17]);
  });

  it('computes the price range', () => {
    const list = [tire('1', { priceCents: 30000 }), tire('2', { priceCents: 80000 }), tire('3', { priceCents: 50000 })];
    expect(summariseFacets(list).priceRange).toEqual({ minCents: 30000, maxCents: 80000 });
  });
});
