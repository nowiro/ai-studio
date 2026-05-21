/**
 * i18n.providers.spec.ts — smoke tests for provideI18n() shape.
 *
 * We don't bootstrap a full TestBed here (heavy + brittle); we assert that:
 *   1. `provideI18n()` returns a non-empty provider array
 *   2. `I18N_BASE_PATH` token defaults to `/assets/i18n/` when omitted
 *   3. Custom `assetsBasePath` is honoured
 *
 * Real consumer testing happens in app integration tests.
 */
import { describe, expect, it } from 'vitest';

import { I18N_BASE_PATH, provideI18n } from './i18n.providers.js';

interface ValueProvider {
  provide: unknown;
  useValue: string;
}

function findBasePathProvider(providers: readonly unknown[]): ValueProvider | undefined {
  return providers.find(
    (p): p is ValueProvider => typeof p === 'object' && p !== null && 'provide' in p && p.provide === I18N_BASE_PATH,
  );
}

describe('provideI18n', () => {
  it('returns a non-empty provider array', () => {
    const providers = provideI18n({ defaultLang: 'pl', availableLangs: ['pl', 'en'] });
    expect(providers.length).toBeGreaterThan(0);
  });

  it('uses default base path when assetsBasePath is omitted', () => {
    const providers = provideI18n({ defaultLang: 'pl', availableLangs: ['pl'] });
    const basePathProvider = findBasePathProvider(providers);
    expect(basePathProvider?.useValue).toBe('/assets/i18n/');
  });

  it('honours custom assetsBasePath', () => {
    const providers = provideI18n({
      defaultLang: 'pl',
      availableLangs: ['pl'],
      assetsBasePath: '/custom/i18n/',
    });
    const basePathProvider = findBasePathProvider(providers);
    expect(basePathProvider?.useValue).toBe('/custom/i18n/');
  });
});
