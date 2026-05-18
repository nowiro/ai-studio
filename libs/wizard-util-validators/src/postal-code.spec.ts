import { describe, expect, it } from 'vitest';

import { autoFormatPostalCode, isValidPlPostalCode } from './postal-code.js';

describe('isValidPlPostalCode', () => {
  it('accepts NN-NNN', () => {
    expect(isValidPlPostalCode('00-001')).toBe(true);
    expect(isValidPlPostalCode('80-180')).toBe(true);
  });

  it('rejects malformed strings', () => {
    expect(isValidPlPostalCode('00001')).toBe(false);
    expect(isValidPlPostalCode('00-1')).toBe(false);
    expect(isValidPlPostalCode('00-AAA')).toBe(false);
  });
});

describe('autoFormatPostalCode', () => {
  it('inserts the hyphen when 5 raw digits are typed', () => {
    expect(autoFormatPostalCode('80180')).toBe('80-180');
  });

  it('returns the input unchanged for any other shape', () => {
    expect(autoFormatPostalCode('80-180')).toBe('80-180');
    expect(autoFormatPostalCode('12')).toBe('12');
  });
});
