import { describe, expect, it } from 'vitest';

import type { Book } from '../models/book.js';
import { type BookFilters, EMPTY_FILTERS } from '../models/filters.js';
import { applyFilters, matchesFilters, searchRank } from './search.js';

const A: Book = {
  id: 'book-001',
  title: 'Pan Tadeusz',
  author: 'Adam Mickiewicz',
  isbn: '978-83-00001',
  genre: 'poetry',
  language: 'pl',
  publishedYear: 1834,
  coverUrl: '',
  blurb: '',
  totalCopies: 4,
};

const B: Book = {
  id: 'book-002',
  title: 'Solaris',
  author: 'Stanisław Lem',
  isbn: '978-83-00002',
  genre: 'sci-fi',
  language: 'pl',
  publishedYear: 1961,
  coverUrl: '',
  blurb: '',
  totalCopies: 5,
};

function filters(patch: Partial<BookFilters>): BookFilters {
  return { ...EMPTY_FILTERS, ...patch };
}

const ALL_AVAILABLE = (): boolean => true;
const NONE_AVAILABLE = (): boolean => false;

describe('matchesFilters', () => {
  it('returns true with empty filters', () => {
    expect(matchesFilters(A, EMPTY_FILTERS, ALL_AVAILABLE)).toBe(true);
  });

  it('matches genre', () => {
    expect(matchesFilters(A, filters({ genres: new Set(['poetry']) }), ALL_AVAILABLE)).toBe(true);
    expect(matchesFilters(A, filters({ genres: new Set(['sci-fi']) }), ALL_AVAILABLE)).toBe(false);
  });

  it('matches language', () => {
    expect(matchesFilters(A, filters({ languages: new Set(['pl']) }), ALL_AVAILABLE)).toBe(true);
    expect(matchesFilters(A, filters({ languages: new Set(['en']) }), ALL_AVAILABLE)).toBe(false);
  });

  it('matches year bounds', () => {
    expect(matchesFilters(A, filters({ minYear: 1830 }), ALL_AVAILABLE)).toBe(true);
    expect(matchesFilters(A, filters({ minYear: 1900 }), ALL_AVAILABLE)).toBe(false);
    expect(matchesFilters(A, filters({ maxYear: 1900 }), ALL_AVAILABLE)).toBe(true);
    expect(matchesFilters(A, filters({ maxYear: 1800 }), ALL_AVAILABLE)).toBe(false);
  });

  it('matches availability', () => {
    expect(matchesFilters(A, filters({ availableOnly: true }), ALL_AVAILABLE)).toBe(true);
    expect(matchesFilters(A, filters({ availableOnly: true }), NONE_AVAILABLE)).toBe(false);
  });

  it('matches free-text query', () => {
    expect(matchesFilters(A, filters({ query: 'mick' }), ALL_AVAILABLE)).toBe(true);
    expect(matchesFilters(A, filters({ query: 'PAN' }), ALL_AVAILABLE)).toBe(true);
    expect(matchesFilters(A, filters({ query: 'lem' }), ALL_AVAILABLE)).toBe(false);
    expect(matchesFilters(A, filters({ query: '   ' }), ALL_AVAILABLE)).toBe(true);
  });
});

describe('applyFilters', () => {
  it('returns the intersection', () => {
    expect(applyFilters([A, B], filters({ genres: new Set(['sci-fi']) }), ALL_AVAILABLE)).toEqual([B]);
  });
  it('returns empty when no candidate passes', () => {
    expect(applyFilters([A, B], filters({ languages: new Set(['fr']) }), ALL_AVAILABLE)).toEqual([]);
  });
});

describe('searchRank', () => {
  it('returns 0 for an empty query', () => {
    expect(searchRank(A, '')).toBe(0);
  });
  it('ranks exact ISBN match highest', () => {
    expect(searchRank(A, '978-83-00001')).toBe(1000);
  });
  it('ranks title-prefix above title-substring', () => {
    expect(searchRank(A, 'pan')).toBeGreaterThan(searchRank(A, 'tadeusz'));
  });
  it('ranks author-prefix above author-substring', () => {
    expect(searchRank(A, 'adam')).toBeGreaterThan(searchRank(A, 'mickiewicz'));
  });
  it('returns 0 for non-matching query', () => {
    expect(searchRank(A, 'zzz')).toBe(0);
  });
});
