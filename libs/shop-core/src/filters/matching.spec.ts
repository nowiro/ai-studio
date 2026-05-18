import { describe, expect, it } from 'vitest';

import { type BaseFilters, EMPTY_BASE_FILTERS } from '../models/filters.js';
import type { BaseProduct } from '../models/product.js';
import { applyBaseFilters, matchesBaseFilters } from './matching.js';

const SAMPLE: BaseProduct = {
  id: 'p-001',
  name: 'Sample Product',
  brand: 'Acme',
  priceCents: 5000,
  oldPriceCents: 6000,
  imageUrl: '',
  description: '',
  stock: 5,
  rating: 4.5,
  reviewCount: 12,
  category: 'foo',
  tags: ['blue', 'large'],
};

function filters(patch: Partial<BaseFilters>): BaseFilters {
  return { ...EMPTY_BASE_FILTERS, ...patch };
}

describe('matchesBaseFilters', () => {
  it('returns true with empty filters', () => {
    expect(matchesBaseFilters(SAMPLE, EMPTY_BASE_FILTERS)).toBe(true);
  });

  it('matches brand', () => {
    expect(matchesBaseFilters(SAMPLE, filters({ brands: new Set(['Acme']) }))).toBe(true);
    expect(matchesBaseFilters(SAMPLE, filters({ brands: new Set(['Other']) }))).toBe(false);
  });

  it('matches category', () => {
    expect(matchesBaseFilters(SAMPLE, filters({ categories: new Set(['foo']) }))).toBe(true);
    expect(matchesBaseFilters(SAMPLE, filters({ categories: new Set(['bar']) }))).toBe(false);
  });

  it('matches price range', () => {
    expect(matchesBaseFilters(SAMPLE, filters({ minPriceCents: 4000 }))).toBe(true);
    expect(matchesBaseFilters(SAMPLE, filters({ minPriceCents: 6000 }))).toBe(false);
    expect(matchesBaseFilters(SAMPLE, filters({ maxPriceCents: 6000 }))).toBe(true);
    expect(matchesBaseFilters(SAMPLE, filters({ maxPriceCents: 4000 }))).toBe(false);
  });

  it('honours in-stock filter', () => {
    expect(matchesBaseFilters(SAMPLE, filters({ inStockOnly: true }))).toBe(true);
    expect(matchesBaseFilters({ ...SAMPLE, stock: 0 }, filters({ inStockOnly: true }))).toBe(false);
  });

  it('matches query against name + brand + tags', () => {
    expect(matchesBaseFilters(SAMPLE, filters({ query: 'sample' }))).toBe(true);
    expect(matchesBaseFilters(SAMPLE, filters({ query: 'acme' }))).toBe(true);
    expect(matchesBaseFilters(SAMPLE, filters({ query: 'blue' }))).toBe(true);
    expect(matchesBaseFilters(SAMPLE, filters({ query: 'missing' }))).toBe(false);
    expect(matchesBaseFilters(SAMPLE, filters({ query: '   ' }))).toBe(true);
  });
});

describe('applyBaseFilters', () => {
  it('returns the intersection', () => {
    const products = [SAMPLE, { ...SAMPLE, id: 'p-002', brand: 'Other' }, { ...SAMPLE, id: 'p-003', category: 'bar' }];
    expect(applyBaseFilters(products, filters({ brands: new Set(['Acme']) }))).toHaveLength(2);
  });

  it('returns empty when no candidate passes', () => {
    expect(applyBaseFilters([SAMPLE], filters({ brands: new Set(['ZZZ']) }))).toEqual([]);
  });
});
