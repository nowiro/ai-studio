import { describe, expect, it } from 'vitest';

import { mergeTranslationResource, SUPPORTED_LANGUAGE_CODES, type TranslationResource } from './i18n.types';
import { DEFAULT_TRANSLATION, TRANSLATION_LOADERS } from './translation-loaders';
import enTranslation from './translations/en.translation';

const EMPTY_BASE: TranslationResource = {
  meta: DEFAULT_TRANSLATION.meta,
  languageSwitcher: { ariaLabel: '', menuTitle: '', selectedTooltip: '' },
  header: {
    brandAriaLabel: '',
    navigationAriaLabel: '',
    mobileMenuAriaLabel: '',
    mobileCountryLabel: '',
    navContact: '',
    navBanks: '',
    navCurrencies: '',
    navRealEstate: '',
    navDiscover: '',
  },
  footer: { rightsReserved: '', lastUpdatedLabel: '' },
  home: {
    heroSubtitle: '',
    heroDescription: '',
    currentCountryLabel: '',
    modulesTitle: '',
    modules: {
      statusAvailable: '',
      banksTitle: '',
      banksDescription: '',
      banksAction: '',
      currenciesTitle: '',
      currenciesDescription: '',
      currenciesAction: '',
      realEstateTitle: '',
      realEstateDescription: '',
      realEstateAction: '',
    },
    features: { languages: '', countries: '', cadence: '', compliance: '', maps: '', sources: '' },
    info: {
      complianceTitle: '',
      complianceDescription: '',
      sourcesTitle: '',
      sourcesDescription: '',
      aiTitle: '',
      aiDescription: '',
    },
    exploreTitle: '',
    exploreDescription: '',
  },
  discover: {
    badge: '',
    title: '',
    description: '',
    searchLabel: '',
    stats: { tools: '', countries: '', datasets: '' },
    tabs: {
      calculators: emptySection(),
      alerts: emptySection(),
      rankings: emptySection(),
      comparators: emptySection(),
      lawsTaxes: emptySection(),
      investorZone: emptySection(),
    },
  },
  errors: {
    notFoundBadge: '',
    notFoundTitle: '',
    notFoundDescription: '',
    serverErrorBadge: '',
    serverErrorTitle: '',
    serverErrorDescription: '',
    homeAction: '',
    contactAction: '',
    banksAction: '',
    currenciesAction: '',
  },
  legal: { disclaimerTitle: '', currencyInformationalDisclaimer: '', countryNoticePending: '' },
};

function emptySection() {
  return {
    label: '',
    title: '',
    description: '',
    searchPlaceholder: '',
    emptyTitle: '',
    emptyDescription: '',
    cards: [] as { title: string; description: string; metric: string; actionLabel: string }[],
  };
}

function flattenStrings(obj: unknown, prefix = ''): Record<string, string> {
  if (typeof obj === 'string') return { [prefix]: obj };
  if (Array.isArray(obj)) {
    return obj.reduce(
      (acc, item, i) => ({ ...acc, ...flattenStrings(item, `${prefix}[${i}]`) }),
      {} as Record<string, string>,
    );
  }
  if (obj && typeof obj === 'object') {
    return Object.entries(obj).reduce(
      (acc, [key, val]) => ({
        ...acc,
        ...flattenStrings(val, prefix ? `${prefix}.${key}` : key),
      }),
      {} as Record<string, string>,
    );
  }
  return {};
}

const EN_STRINGS = flattenStrings(enTranslation.overrides);

describe('Translation completeness — all 24 EU languages', () => {
  it('SUPPORTED_LANGUAGE_CODES contains all 24 EU languages', () => {
    expect(SUPPORTED_LANGUAGE_CODES).toHaveLength(24);
    expect(SUPPORTED_LANGUAGE_CODES).toContain('pl');
    expect(SUPPORTED_LANGUAGE_CODES).toContain('en');
  });

  it('TRANSLATION_LOADERS contains a loader for every supported language', () => {
    for (const code of SUPPORTED_LANGUAGE_CODES) {
      expect(TRANSLATION_LOADERS[code]).toBeTypeOf('function');
    }
  });

  for (const code of SUPPORTED_LANGUAGE_CODES) {
    describe(`[${code}]`, () => {
      it('loads without errors and has correct language code', async () => {
        const module = await TRANSLATION_LOADERS[code]();
        expect(module.meta.code).toBe(code);
      });

      it('status is "ready"', async () => {
        const module = await TRANSLATION_LOADERS[code]();
        expect(module.meta.status).toBe('ready');
      });

      it('merges cleanly against the empty base', async () => {
        const module = await TRANSLATION_LOADERS[code]();
        const merged = mergeTranslationResource(EMPTY_BASE, module);
        expect(merged.meta.code).toBe(code);
      });

      it('has all top-level sections', async () => {
        const module = await TRANSLATION_LOADERS[code]();
        const merged = mergeTranslationResource(EMPTY_BASE, module);
        expect(merged.languageSwitcher).toBeDefined();
        expect(merged.header).toBeDefined();
        expect(merged.footer).toBeDefined();
        expect(merged.home).toBeDefined();
        expect(merged.discover).toBeDefined();
        expect(merged.errors).toBeDefined();
        expect(merged.legal).toBeDefined();
      });

      it('discover tabs have 6 sections each with 3 cards', async () => {
        const module = await TRANSLATION_LOADERS[code]();
        const merged = mergeTranslationResource(EMPTY_BASE, module);
        const tabs = merged.discover.tabs;
        for (const tabKey of Object.keys(tabs) as (keyof typeof tabs)[]) {
          expect(tabs[tabKey].cards.length, `${code}: discover.tabs.${tabKey}.cards should have 3 entries`).toBe(3);
        }
      });

      it('has no empty string values after merge', async () => {
        const module = await TRANSLATION_LOADERS[code]();
        const merged = mergeTranslationResource(EMPTY_BASE, module);
        const strings = flattenStrings(merged);
        for (const [key, value] of Object.entries(strings)) {
          if (key.includes('meta.')) continue;
          expect(value, `${code}: key "${key}" must not be empty`).not.toBe('');
        }
      });

      if (code !== 'pl' && code !== 'en') {
        it('overrides contain all keys from English reference', async () => {
          const module = await TRANSLATION_LOADERS[code]();
          const overrideStrings = flattenStrings(module.overrides);
          const missingKeys = Object.keys(EN_STRINGS).filter((key) => !(key in overrideStrings));
          expect(missingKeys, `${code}: missing keys compared to English reference`).toHaveLength(0);
        });
      }
    });
  }
});
