import { describe, expect, it } from 'vitest';

import type { Grade } from '../models/index.js';
import { clampGradeValue, formatAverage, isPassing, subjectAverages } from './grades-average.js';

function grade(subjectId: string, value: number, weight: number): Grade {
  return {
    id: `g-${subjectId}-${value}-${weight}`,
    studentId: 's',
    subjectId,
    termId: 'T3',
    value: value as Grade['value'],
    weight,
    comment: '',
    issuedAt: '2026-05-01',
    teacherId: 't',
  };
}

describe('subjectAverages', () => {
  it('returns empty map for empty input', () => {
    expect(subjectAverages([]).size).toBe(0);
  });

  it('computes weighted average per subject', () => {
    const averages = subjectAverages([grade('mat', 4, 1), grade('mat', 5, 3), grade('pol', 3, 1)]);
    expect(averages.get('mat')).toBeCloseTo((4 + 15) / 4, 5);
    expect(averages.get('pol')).toBe(3);
  });

  it('returns null when total weight is zero', () => {
    const averages = subjectAverages([grade('mat', 4, 0)]);
    expect(averages.get('mat')).toBeNull();
  });
});

describe('formatAverage', () => {
  it('formats numbers with 2 decimals', () => {
    expect(formatAverage(4.566)).toBe('4.57');
  });
  it('returns em-dash for null', () => {
    expect(formatAverage(null)).toBe('—');
  });
});

describe('isPassing', () => {
  it('false when null', () => {
    expect(isPassing(null)).toBe(false);
  });
  it('false when below 2', () => {
    expect(isPassing(1.99)).toBe(false);
  });
  it('true when ≥ 2', () => {
    expect(isPassing(2)).toBe(true);
    expect(isPassing(5)).toBe(true);
  });
});

describe('clampGradeValue', () => {
  it('clamps below 1 → 1', () => {
    expect(clampGradeValue(0)).toBe(1);
  });
  it('clamps above 6 → 6', () => {
    expect(clampGradeValue(9)).toBe(6);
  });
  it('rounds and returns 1..6', () => {
    expect(clampGradeValue(3.4)).toBe(3);
    expect(clampGradeValue(3.6)).toBe(4);
  });
});
