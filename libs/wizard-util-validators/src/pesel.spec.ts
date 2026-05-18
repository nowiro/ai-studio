import { describe, expect, it } from 'vitest';

import { isValidPeselChecksum, parsePesel } from './pesel.js';

describe('isValidPeselChecksum', () => {
  it('accepts a valid PESEL (1990-02-15, female)', () => {
    // body = 90 02 15 0102, check = 2 → 90021501022
    expect(isValidPeselChecksum('90021501022')).toBe(true);
  });

  it('rejects strings that are not 11 digits', () => {
    expect(isValidPeselChecksum('12345')).toBe(false);
    expect(isValidPeselChecksum('abcdefghijk')).toBe(false);
    expect(isValidPeselChecksum('900215010255')).toBe(false);
  });

  it('rejects strings with a wrong checksum', () => {
    expect(isValidPeselChecksum('90021501020')).toBe(false);
  });
});

describe('parsePesel', () => {
  it('extracts birth date and gender from a valid PESEL', () => {
    const info = parsePesel('90021501022');
    expect(info).not.toBeNull();
    expect(info?.birthDate.toISOString().slice(0, 10)).toBe('1990-02-15');
    expect(info?.gender).toBe('female');
  });

  it('returns null for invalid PESEL', () => {
    expect(parsePesel('00000000001')).toBeNull();
  });

  it('decodes 21st-century births (month offset +20)', () => {
    // 2005-03-12, male, serial 0031 → encoded month = 23, build computes check digit.
    const sample = buildPesel('05', '23', '12', '0031');
    const info = parsePesel(sample);
    expect(info).not.toBeNull();
    expect(info?.birthDate.toISOString().slice(0, 10)).toBe('2005-03-12');
    expect(info?.gender).toBe('male');
  });

  it('rejects PESEL with impossible day/month (29-Feb of non-leap year)', () => {
    const sample = buildPesel('01', '02', '29', '0000');
    expect(parsePesel(sample)).toBeNull();
  });
});

/**
 * Test helper — appends the correct check digit so we can vary date payloads without
 * hand-crafting checksums. `serial` is the 4-digit serial including the gender digit.
 */
function buildPesel(yy: string, mm: string, dd: string, serial: string): string {
  const weights = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];
  const body = `${yy}${mm}${dd}${serial}`;
  if (body.length !== 10) throw new Error(`buildPesel expects 10-digit body, got ${body.length}`);
  let sum = 0;
  for (let i = 0; i < 10; i++) sum += Number(body[i]) * weights[i];
  const check = (10 - (sum % 10)) % 10;
  return `${body}${check}`;
}
