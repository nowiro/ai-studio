import { computed, effect, inject, Injectable, signal } from '@angular/core';

import { getCountryPreferences, resolveLocaleId } from '../data/country-preferences';
import type { EuCountry } from '../data/eu-countries';
import {
  mergeTranslationResource,
  normalizeLanguageCode,
  type SupportedLanguageCode,
  type TranslationInterpolation,
  type TranslationKey,
  type TranslationResource,
} from '../i18n/i18n.types';
import { DEFAULT_TRANSLATION, TRANSLATION_LOADERS } from '../i18n/translation-loaders';
import { CountryService } from './country.service';

const DEFAULT_RESOURCE = mergeTranslationResource(
  {
    meta: DEFAULT_TRANSLATION.meta,
    languageSwitcher: {
      ariaLabel: '',
      menuTitle: '',
      selectedTooltip: '',
    },
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
    footer: {
      rightsReserved: '',
      lastUpdatedLabel: '',
    },
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
      features: {
        languages: '',
        countries: '',
        cadence: '',
        compliance: '',
        maps: '',
        sources: '',
      },
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
      stats: {
        tools: '',
        countries: '',
        datasets: '',
      },
      tabs: {
        calculators: {
          label: '',
          title: '',
          description: '',
          searchPlaceholder: '',
          emptyTitle: '',
          emptyDescription: '',
          cards: [],
        },
        alerts: {
          label: '',
          title: '',
          description: '',
          searchPlaceholder: '',
          emptyTitle: '',
          emptyDescription: '',
          cards: [],
        },
        rankings: {
          label: '',
          title: '',
          description: '',
          searchPlaceholder: '',
          emptyTitle: '',
          emptyDescription: '',
          cards: [],
        },
        comparators: {
          label: '',
          title: '',
          description: '',
          searchPlaceholder: '',
          emptyTitle: '',
          emptyDescription: '',
          cards: [],
        },
        lawsTaxes: {
          label: '',
          title: '',
          description: '',
          searchPlaceholder: '',
          emptyTitle: '',
          emptyDescription: '',
          cards: [],
        },
        investorZone: {
          label: '',
          title: '',
          description: '',
          searchPlaceholder: '',
          emptyTitle: '',
          emptyDescription: '',
          cards: [],
        },
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
    legal: {
      disclaimerTitle: '',
      currencyInformationalDisclaimer: '',
      countryNoticePending: '',
    },
  },
  DEFAULT_TRANSLATION,
);

@Injectable({ providedIn: 'root' })
export class LocalizationService {
  private readonly countryService = inject(CountryService);
  private readonly currentResourceState = signal<TranslationResource>(DEFAULT_RESOURCE);
  private readonly resourceCache = new Map<SupportedLanguageCode, TranslationResource>([
    [DEFAULT_RESOURCE.meta.code, DEFAULT_RESOURCE],
  ]);

  readonly resource = computed(() => this.currentResourceState());

  readonly currentLanguage = computed(() => normalizeLanguageCode(this.countryService.selectedLanguage().code));

  readonly currentCountryPreferences = computed(() =>
    getCountryPreferences(this.countryService.selectedCountry().code),
  );

  readonly currentLocale = computed(() => resolveLocaleId(this.currentLanguage(), this.currentCountryPreferences()));

  readonly translationStatus = computed(() => this.currentResourceState().meta.status);

  readonly currentCountryLabel = computed(() => this.localizeCountryName(this.countryService.selectedCountry()));

  /**
   * Legal notice for the current country.
   * - Non-eurozone countries: shows the currency informational disclaimer
   *   (explains that exchange rates are for informational purposes).
   * - Eurozone countries: shows the generic country notice pending localisation.
   */
  readonly currentLegalNotice = computed(() => {
    const legalNoticeKey = this.currentCountryPreferences().legalNoticeKey;
    const country = this.currentCountryLabel();

    return {
      title: this.translate('legal.disclaimerTitle'),
      body: this.translate(`legal.${legalNoticeKey}`, { country }),
      status: this.translationStatus(),
      locale: this.currentLocale(),
    };
  });

  constructor() {
    effect(() => {
      void this.loadResource(this.currentLanguage());
    });
  }

  translate(key: TranslationKey, params: TranslationInterpolation = {}): string {
    const value = this.resolveTranslationValue(this.currentResourceState(), key);
    return Object.entries(params).reduce(
      (message, [paramKey, paramValue]) => message.replaceAll(`{${paramKey}}`, String(paramValue ?? '')),
      value,
    );
  }

  localizeCountryName(country: Pick<EuCountry, 'name' | 'nameEn'>): string {
    return this.currentLanguage() === 'pl' ? country.name : country.nameEn;
  }

  private async loadResource(languageCode: SupportedLanguageCode): Promise<void> {
    const cached = this.resourceCache.get(languageCode);

    if (cached) {
      this.currentResourceState.set(cached);
      return;
    }

    const module = await TRANSLATION_LOADERS[languageCode]();
    const mergedResource = mergeTranslationResource(DEFAULT_RESOURCE, module);
    this.resourceCache.set(languageCode, mergedResource);

    if (this.currentLanguage() === languageCode) {
      this.currentResourceState.set(mergedResource);
    }
  }

  private resolveTranslationValue(resource: TranslationResource, key: TranslationKey): string {
    const [section, entry] = key.split('.') as ['languageSwitcher' | 'legal', string];

    switch (section) {
      case 'languageSwitcher':
        return resource.languageSwitcher[entry as keyof TranslationResource['languageSwitcher']];
      case 'legal':
        return resource.legal[entry as keyof TranslationResource['legal']];
      default:
        return '';
    }
  }
}
