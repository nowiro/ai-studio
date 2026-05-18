export const SUPPORTED_LANGUAGE_CODES = [
  'bg',
  'cs',
  'da',
  'de',
  'el',
  'en',
  'es',
  'et',
  'fi',
  'fr',
  'ga',
  'hr',
  'hu',
  'it',
  'lt',
  'lv',
  'mt',
  'nl',
  'pl',
  'pt',
  'ro',
  'sk',
  'sl',
  'sv',
] as const;

export type SupportedLanguageCode = (typeof SUPPORTED_LANGUAGE_CODES)[number];

export type TranslationStatus = 'ready' | 'scaffold';

export type LegalNoticeKey = 'countryNoticePending' | 'currencyInformationalDisclaimer';

export interface TranslationInterpolation {
  readonly country?: string;
  readonly language?: string;
}

export interface DiscoverCardResource {
  readonly title: string;
  readonly description: string;
  readonly metric: string;
  readonly actionLabel: string;
}

export interface DiscoverSectionResource {
  readonly label: string;
  readonly title: string;
  readonly description: string;
  readonly searchPlaceholder: string;
  readonly emptyTitle: string;
  readonly emptyDescription: string;
  readonly cards: readonly DiscoverCardResource[];
}

export interface TranslationResource {
  readonly meta: {
    readonly code: SupportedLanguageCode;
    readonly status: TranslationStatus;
  };
  readonly languageSwitcher: {
    readonly ariaLabel: string;
    readonly menuTitle: string;
    readonly selectedTooltip: string;
  };
  readonly header: {
    readonly brandAriaLabel: string;
    readonly navigationAriaLabel: string;
    readonly mobileMenuAriaLabel: string;
    readonly mobileCountryLabel: string;
    readonly navContact: string;
    readonly navBanks: string;
    readonly navCurrencies: string;
    readonly navRealEstate: string;
    readonly navDiscover: string;
  };
  readonly footer: {
    readonly rightsReserved: string;
    readonly lastUpdatedLabel: string;
  };
  readonly home: {
    readonly heroSubtitle: string;
    readonly heroDescription: string;
    readonly currentCountryLabel: string;
    readonly modulesTitle: string;
    readonly modules: {
      readonly statusAvailable: string;
      readonly banksTitle: string;
      readonly banksDescription: string;
      readonly banksAction: string;
      readonly currenciesTitle: string;
      readonly currenciesDescription: string;
      readonly currenciesAction: string;
      readonly realEstateTitle: string;
      readonly realEstateDescription: string;
      readonly realEstateAction: string;
    };
    readonly features: {
      readonly languages: string;
      readonly countries: string;
      readonly cadence: string;
      readonly compliance: string;
      readonly maps: string;
      readonly sources: string;
    };
    readonly info: {
      readonly complianceTitle: string;
      readonly complianceDescription: string;
      readonly sourcesTitle: string;
      readonly sourcesDescription: string;
      readonly aiTitle: string;
      readonly aiDescription: string;
    };
    readonly exploreTitle: string;
    readonly exploreDescription: string;
  };
  readonly discover: {
    readonly badge: string;
    readonly title: string;
    readonly description: string;
    readonly searchLabel: string;
    readonly stats: {
      readonly tools: string;
      readonly countries: string;
      readonly datasets: string;
    };
    readonly tabs: {
      readonly calculators: DiscoverSectionResource;
      readonly alerts: DiscoverSectionResource;
      readonly rankings: DiscoverSectionResource;
      readonly comparators: DiscoverSectionResource;
      readonly lawsTaxes: DiscoverSectionResource;
      readonly investorZone: DiscoverSectionResource;
    };
  };
  readonly errors: {
    readonly notFoundBadge: string;
    readonly notFoundTitle: string;
    readonly notFoundDescription: string;
    readonly serverErrorBadge: string;
    readonly serverErrorTitle: string;
    readonly serverErrorDescription: string;
    readonly homeAction: string;
    readonly contactAction: string;
    readonly banksAction: string;
    readonly currenciesAction: string;
  };
  readonly legal: {
    readonly disclaimerTitle: string;
    readonly currencyInformationalDisclaimer: string;
    readonly countryNoticePending: string;
  };
}

type DeepPartial<T> = {
  readonly [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

export type TranslationResourceOverrides = DeepPartial<Omit<TranslationResource, 'meta'>>;

export type TranslationKey =
  | 'languageSwitcher.ariaLabel'
  | 'languageSwitcher.menuTitle'
  | 'languageSwitcher.selectedTooltip'
  | 'legal.disclaimerTitle'
  | 'legal.currencyInformationalDisclaimer'
  | 'legal.countryNoticePending';

export interface TranslationModule {
  readonly meta: TranslationResource['meta'];
  readonly overrides: TranslationResourceOverrides;
}

export function normalizeLanguageCode(languageCode: string): SupportedLanguageCode {
  return SUPPORTED_LANGUAGE_CODES.find((code) => code === languageCode) ?? 'pl';
}

export function defineTranslationResource(
  code: SupportedLanguageCode,
  overrides: TranslationResourceOverrides,
  status: TranslationStatus,
): TranslationModule {
  return {
    meta: {
      code,
      status,
    },
    overrides,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function deepMerge<T>(base: T, overrides?: DeepPartial<T>): T {
  if (!overrides) {
    return base;
  }

  const result: Record<string, unknown> = { ...(base as Record<string, unknown>) };

  for (const [key, value] of Object.entries(overrides)) {
    const currentValue = result[key];

    if (isRecord(currentValue) && isRecord(value)) {
      result[key] = deepMerge(currentValue, value);
      continue;
    }

    if (value !== undefined) {
      result[key] = value;
    }
  }

  return result as T;
}

export function mergeTranslationResource(base: TranslationResource, module: TranslationModule): TranslationResource {
  return {
    ...deepMerge(base, module.overrides),
    meta: module.meta,
  };
}
