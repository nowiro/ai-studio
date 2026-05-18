import { describe, expect, it } from 'vitest';

import { EMPTY_FILTERS, type TireFilters } from '../models/filters.js';
import type { Tire } from '../models/tire.js';
import { applyFilters, matchesFilters } from './matching.js';

const SAMPLE: Tire = {
  id: 'tire-001',
  brand: 'Continental',
  model: 'PremiumContact 7',
  size: { width: 205, profile: 55, diameter: 16 },
  season: 'summer',
  speedIndex: 'V',
  loadIndex: 91,
  euLabel: { fuel: 'B', wet: 'A', noiseDb: 70 },
  priceCents: 53900,
  oldPriceCents: 59900,
  stock: 24,
  rating: 4.7,
  reviewCount: 312,
  imageUrl: 'https://example.com/tire.jpg',
  description: 'Premium summer tire',
};

const SECOND: Tire = {
  ...SAMPLE,
  id: 'tire-002',
  brand: 'Michelin',
  model: 'Primacy 4',
  season: 'winter',
  speedIndex: 'H',
  euLabel: { fuel: 'C', wet: 'B', noiseDb: 71 },
  priceCents: 39900,
  stock: 0,
  oldPriceCents: null,
};

function filters(patch: Partial<TireFilters>): TireFilters {
  return { ...EMPTY_FILTERS, ...patch };
}

describe('matchesFilters', () => {
  it('returns true with empty filters', () => {
    expect(matchesFilters(SAMPLE, EMPTY_FILTERS)).toBe(true);
  });

  it('matches brand when set', () => {
    expect(matchesFilters(SAMPLE, filters({ brands: new Set(['Continental']) }))).toBe(true);
    expect(matchesFilters(SAMPLE, filters({ brands: new Set(['Michelin']) }))).toBe(false);
  });

  it('matches season', () => {
    expect(matchesFilters(SAMPLE, filters({ seasons: new Set(['summer']) }))).toBe(true);
    expect(matchesFilters(SAMPLE, filters({ seasons: new Set(['winter']) }))).toBe(false);
  });

  it('matches fuel grade', () => {
    expect(matchesFilters(SAMPLE, filters({ euFuel: new Set(['B']) }))).toBe(true);
    expect(matchesFilters(SAMPLE, filters({ euFuel: new Set(['A']) }))).toBe(false);
  });

  it('matches wet grade', () => {
    expect(matchesFilters(SAMPLE, filters({ euWet: new Set(['A']) }))).toBe(true);
    expect(matchesFilters(SAMPLE, filters({ euWet: new Set(['B']) }))).toBe(false);
  });

  it('matches speed index', () => {
    expect(matchesFilters(SAMPLE, filters({ speedIndices: new Set(['V']) }))).toBe(true);
    expect(matchesFilters(SAMPLE, filters({ speedIndices: new Set(['Y']) }))).toBe(false);
  });

  it('matches width/profile/diameter', () => {
    expect(matchesFilters(SAMPLE, filters({ width: 205 }))).toBe(true);
    expect(matchesFilters(SAMPLE, filters({ width: 225 }))).toBe(false);
    expect(matchesFilters(SAMPLE, filters({ profile: 55 }))).toBe(true);
    expect(matchesFilters(SAMPLE, filters({ profile: 60 }))).toBe(false);
    expect(matchesFilters(SAMPLE, filters({ diameter: 16 }))).toBe(true);
    expect(matchesFilters(SAMPLE, filters({ diameter: 17 }))).toBe(false);
  });

  it('matches price range', () => {
    expect(matchesFilters(SAMPLE, filters({ minPriceCents: 50000 }))).toBe(true);
    expect(matchesFilters(SAMPLE, filters({ minPriceCents: 60000 }))).toBe(false);
    expect(matchesFilters(SAMPLE, filters({ maxPriceCents: 60000 }))).toBe(true);
    expect(matchesFilters(SAMPLE, filters({ maxPriceCents: 40000 }))).toBe(false);
  });

  it('honours in-stock filter', () => {
    expect(matchesFilters(SAMPLE, filters({ inStockOnly: true }))).toBe(true);
    expect(matchesFilters(SECOND, filters({ inStockOnly: true }))).toBe(false);
  });

  it('matches text query case-insensitively', () => {
    expect(matchesFilters(SAMPLE, filters({ query: 'continental' }))).toBe(true);
    expect(matchesFilters(SAMPLE, filters({ query: '205/55' }))).toBe(true);
    expect(matchesFilters(SAMPLE, filters({ query: 'r16' }))).toBe(true);
    expect(matchesFilters(SAMPLE, filters({ query: 'bridgestone' }))).toBe(false);
    expect(matchesFilters(SAMPLE, filters({ query: '   ' }))).toBe(true);
  });
});

describe('applyFilters', () => {
  it('returns intersection across multiple facets', () => {
    const list = [SAMPLE, SECOND];
    expect(applyFilters(list, filters({ seasons: new Set(['summer']) }))).toEqual([SAMPLE]);
    expect(applyFilters(list, filters({ seasons: new Set(['winter']) }))).toEqual([SECOND]);
    expect(applyFilters(list, filters({ brands: new Set(['Continental', 'Michelin']) }))).toHaveLength(2);
  });

  it('returns an empty array when no candidate passes', () => {
    expect(applyFilters([SAMPLE, SECOND], filters({ brands: new Set(['Pirelli']) }))).toEqual([]);
  });
});
