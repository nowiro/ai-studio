import { describe, expect, it } from 'vitest';

import { isValidPlPhone } from './phone.js';

describe('isValidPlPhone', () => {
  it('accepts 9-digit numbers with or without separators', () => {
    expect(isValidPlPhone('123456789')).toBe(true);
    expect(isValidPlPhone('123 456 789')).toBe(true);
    expect(isValidPlPhone('123-456-789')).toBe(true);
  });

  it('accepts +48 prefixed numbers', () => {
    expect(isValidPlPhone('+48 123 456 789')).toBe(true);
    expect(isValidPlPhone('+48123456789')).toBe(true);
  });

  it('rejects malformed input', () => {
    expect(isValidPlPhone('12345')).toBe(false);
    expect(isValidPlPhone('+48 12 345')).toBe(false);
    expect(isValidPlPhone('abc')).toBe(false);
  });
});
