import { describe, expect, it } from 'vitest';

import { ageInYears, isAdult } from './age.js';

describe('ageInYears', () => {
  it('returns whole-year age', () => {
    const today = new Date(Date.UTC(2026, 4, 15));
    expect(ageInYears(new Date(Date.UTC(1990, 4, 15)), today)).toBe(36);
  });

  it('does not round up before the birthday this year', () => {
    const today = new Date(Date.UTC(2026, 4, 14));
    expect(ageInYears(new Date(Date.UTC(2000, 4, 15)), today)).toBe(25);
  });
});

describe('isAdult', () => {
  it('returns true on or after the 18th birthday', () => {
    const today = new Date(Date.UTC(2026, 4, 15));
    expect(isAdult(new Date(Date.UTC(2008, 4, 15)), today)).toBe(true);
    expect(isAdult(new Date(Date.UTC(2008, 4, 16)), today)).toBe(false);
  });
});
