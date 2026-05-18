import { describe, expect, it } from 'vitest';

import { isValidNip, normaliseNip } from './nip.js';

describe('isValidNip', () => {
  it('accepts a real NIP (Microsoft Sp. z o.o.)', () => {
    expect(isValidNip('5270103391')).toBe(true);
  });

  it('accepts NIP with formatting separators', () => {
    expect(isValidNip('527-010-33-91')).toBe(true);
    expect(isValidNip('527 010 33 91')).toBe(true);
  });

  it('rejects strings that are not 10 digits after normalisation', () => {
    expect(isValidNip('12345')).toBe(false);
    expect(isValidNip('abcdefghij')).toBe(false);
    expect(isValidNip('52701033911')).toBe(false);
  });

  it('rejects a wrong checksum', () => {
    expect(isValidNip('5270103390')).toBe(false);
  });
});

describe('normaliseNip', () => {
  it('returns the canonical 10-digit form for valid input', () => {
    expect(normaliseNip('527-010-33-91')).toBe('5270103391');
  });

  it('returns null for invalid input', () => {
    expect(normaliseNip('5270103390')).toBeNull();
  });
});
