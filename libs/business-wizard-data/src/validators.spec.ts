import { describe, expect, it } from 'vitest';

import {
  isValidKrs,
  isValidRegon,
  isValidWebsiteUrl,
  krsValidator,
  regonValidator,
  websiteUrlValidator,
} from './validators.js';

// REGON test fixtures — computed against the GUS algorithm in validators.ts.
//
// REGON-9 "123456785":
//   sum = 1·8 + 2·9 + 3·2 + 4·3 + 5·4 + 6·5 + 7·6 + 8·7 = 192
//   192 % 11 = 5 ⇒ check digit = 5  ✓
//
// REGON-14 "12345678512347":
//   weights = [2,4,8,5,0,9,7,3,6,1,2,4,8]
//   sum     = 1·2 + 2·4 + 3·8 + 4·5 + 5·0 + 6·9 + 7·7 + 8·3 + 5·6 + 1·1 + 2·2 + 3·4 + 4·8 = 260
//   260 % 11 = 7 ⇒ check digit = 7  ✓
describe('isValidRegon', () => {
  it.each([
    ['012345678', false], // wrong checksum
    ['123456785', true], // valid REGON-9 (computed above)
    ['12345678512347', true], // valid REGON-14
    ['12345678512340', false], // REGON-14 with wrong 14th digit
    ['12345', false], // too short
    ['abcdefghi', false], // non-digits
    ['', false],
  ])('isValidRegon(%j) → %s', (input, expected) => {
    expect(isValidRegon(input)).toBe(expected);
  });
});

describe('regonValidator', () => {
  it('returns null for empty value (combine with required)', () => {
    expect(regonValidator()({ value: '' } as never)).toBeNull();
  });

  it('flags malformed REGON', () => {
    expect(regonValidator()({ value: '12345' } as never)).toEqual({ regon: true });
  });

  it('passes a valid REGON-9', () => {
    expect(regonValidator()({ value: '123456785' } as never)).toBeNull();
  });
});

describe('isValidKrs', () => {
  it.each([
    ['0000000001', true],
    ['1234567890', true],
    ['12345', false],
    ['abcdefghij', false],
    ['', false],
  ])('isValidKrs(%j) → %s', (input, expected) => {
    expect(isValidKrs(input)).toBe(expected);
  });
});

describe('krsValidator', () => {
  it('returns null for empty value', () => {
    expect(krsValidator()({ value: '' } as never)).toBeNull();
  });

  it('flags short KRS', () => {
    expect(krsValidator()({ value: '123' } as never)).toEqual({ krs: true });
  });
});

describe('isValidWebsiteUrl', () => {
  it.each([
    ['', true],
    ['https://example.com', true],
    ['http://localhost:8080/path', true],
    ['ftp://example.com', false],
    ['not-a-url', false],
    ['javascript:alert(1)', false],
  ])('isValidWebsiteUrl(%j) → %s', (input, expected) => {
    expect(isValidWebsiteUrl(input)).toBe(expected);
  });
});

describe('websiteUrlValidator', () => {
  it('passes blank', () => {
    expect(websiteUrlValidator()({ value: '' } as never)).toBeNull();
  });

  it('passes valid URL', () => {
    expect(websiteUrlValidator()({ value: 'https://acme.com' } as never)).toBeNull();
  });

  it('flags invalid URL', () => {
    expect(websiteUrlValidator()({ value: 'not-a-url' } as never)).toEqual({ url: true });
  });
});
