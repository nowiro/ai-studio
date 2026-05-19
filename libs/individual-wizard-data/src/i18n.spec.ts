/**
 * `i18n.ts` is pure data + a 1-line lookup. The spec's job is to guarantee the
 * two locales stay in sync (same keys, no `undefined` slots) and that the
 * factory returns the right table for each input — beyond that there's no
 * behaviour to test.
 */
import { describe, expect, it } from 'vitest';

import { EN_MESSAGES, getMessages, type Locale, type Messages, MESSAGES_BY_LOCALE, PL_MESSAGES } from './i18n.js';

describe('i18n message tables', () => {
  it('PL and EN dictionaries expose the exact same key set', () => {
    const plKeys = Object.keys(PL_MESSAGES).sort((a, b) => a.localeCompare(b));
    const enKeys = Object.keys(EN_MESSAGES).sort((a, b) => a.localeCompare(b));
    expect(plKeys).toEqual(enKeys);
  });

  it('every key in both dictionaries is a non-empty string', () => {
    for (const [key, value] of Object.entries(PL_MESSAGES) as [string, string][]) {
      expect(typeof value, `PL_MESSAGES.${key}`).toBe('string');
      expect(value.length, `PL_MESSAGES.${key}`).toBeGreaterThan(0);
    }
    for (const [key, value] of Object.entries(EN_MESSAGES) as [string, string][]) {
      expect(typeof value, `EN_MESSAGES.${key}`).toBe('string');
      expect(value.length, `EN_MESSAGES.${key}`).toBeGreaterThan(0);
    }
  });

  it('PL and EN values differ for every key (no accidental copy-paste)', () => {
    // Translation parity check — catches the common bug where a contributor
    // copies the PL table into EN and forgets to translate a row.
    const plRecord = PL_MESSAGES as unknown as Record<string, string>;
    const enRecord = EN_MESSAGES as unknown as Record<string, string>;
    for (const key of Object.keys(plRecord)) {
      expect(enRecord[key], `EN_MESSAGES.${key} must differ from PL`).not.toBe(plRecord[key]);
    }
  });
});

describe('getMessages', () => {
  it('returns PL_MESSAGES for "pl"', () => {
    expect(getMessages('pl')).toBe(PL_MESSAGES);
  });

  it('returns EN_MESSAGES for "en"', () => {
    expect(getMessages('en')).toBe(EN_MESSAGES);
  });

  it('is exhaustive over the Locale union (compile-time + runtime)', () => {
    // If a third locale is ever added to the `Locale` union without a
    // corresponding entry in `MESSAGES_BY_LOCALE`, TypeScript fails the
    // `Record<Locale, Messages>` type — but a runtime check is also cheap.
    const locales: readonly Locale[] = ['pl', 'en'];
    for (const locale of locales) {
      const result: Messages = getMessages(locale);
      expect(result).toBe(MESSAGES_BY_LOCALE[locale]);
    }
  });
});
