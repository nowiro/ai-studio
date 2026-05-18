import { describe, expect, it } from 'vitest';

import type { Term } from '../models/index.js';
import { isInTerm, termFromDate, termLabel } from './term-from-date.js';

const TERMS: readonly Term[] = [
  { id: 'T1', label: 'Trymestr 1', startDate: '2025-09-01', endDate: '2025-11-30' },
  { id: 'T2', label: 'Trymestr 2', startDate: '2025-12-01', endDate: '2026-02-28' },
  { id: 'T3', label: 'Trymestr 3', startDate: '2026-03-01', endDate: '2026-06-25' },
];

describe('termFromDate', () => {
  it('returns the term containing the date', () => {
    expect(termFromDate(TERMS, '2025-10-15')?.id).toBe('T1');
    expect(termFromDate(TERMS, '2026-01-15')?.id).toBe('T2');
    expect(termFromDate(TERMS, '2026-05-18')?.id).toBe('T3');
  });

  it('handles edge dates', () => {
    expect(termFromDate(TERMS, '2025-09-01')?.id).toBe('T1');
    expect(termFromDate(TERMS, '2025-11-30')?.id).toBe('T1');
  });

  it('returns null outside all ranges', () => {
    expect(termFromDate(TERMS, '2024-01-01')).toBeNull();
    expect(termFromDate(TERMS, '2030-01-01')).toBeNull();
  });
});

describe('isInTerm', () => {
  it('returns the expected boolean', () => {
    expect(isInTerm(TERMS[0], '2025-10-01')).toBe(true);
    expect(isInTerm(TERMS[0], '2025-12-15')).toBe(false);
  });
});

describe('termLabel', () => {
  it('returns the Polish label per term id', () => {
    expect(termLabel('T1')).toBe('Trymestr 1');
    expect(termLabel('T2')).toBe('Trymestr 2');
    expect(termLabel('T3')).toBe('Trymestr 3');
  });
});
