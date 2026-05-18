import { type LegalNoticeKey, normalizeLanguageCode, type SupportedLanguageCode } from '../i18n/i18n.types';
import { DEFAULT_COUNTRY, EU_COUNTRIES } from './eu-countries';

export interface CountryPreferences {
  readonly countryCode: string;
  readonly routeCode: string;
  readonly defaultLanguage: SupportedLanguageCode;
  readonly defaultLocale: string;
  readonly defaultCurrencyCode: string;
  readonly legalNoticeKey: LegalNoticeKey;
}

export const LANGUAGE_LOCALE_MAP: Readonly<Record<SupportedLanguageCode, string>> = {
  bg: 'bg-BG',
  cs: 'cs-CZ',
  da: 'da-DK',
  de: 'de-DE',
  el: 'el-GR',
  en: 'en-IE',
  es: 'es-ES',
  et: 'et-EE',
  fi: 'fi-FI',
  fr: 'fr-FR',
  ga: 'ga-IE',
  hr: 'hr-HR',
  hu: 'hu-HU',
  it: 'it-IT',
  lt: 'lt-LT',
  lv: 'lv-LV',
  mt: 'mt-MT',
  nl: 'nl-NL',
  pl: 'pl-PL',
  pt: 'pt-PT',
  ro: 'ro-RO',
  sk: 'sk-SK',
  sl: 'sl-SI',
  sv: 'sv-SE',
};

const COUNTRY_LOCALE_OVERRIDES: Readonly<Record<string, string>> = {
  BE: 'fr-BE',
  CY: 'el-CY',
  IE: 'en-IE',
  LU: 'fr-LU',
  MT: 'mt-MT',
};

const COUNTRY_PREFERENCES = Object.freeze(
  Object.fromEntries(
    EU_COUNTRIES.map((country) => {
      const defaultLanguage = normalizeLanguageCode(country.language);
      // Non-eurozone countries (those with a currency other than EUR) display
      // the currency-specific informational disclaimer; eurozone countries
      // display the generic country notice pending localisation.
      const legalNoticeKey: LegalNoticeKey =
        country.currencyCode !== 'EUR' ? 'currencyInformationalDisclaimer' : 'countryNoticePending';

      return [
        country.code,
        {
          countryCode: country.code,
          routeCode: country.routeCode,
          defaultLanguage,
          defaultLocale: COUNTRY_LOCALE_OVERRIDES[country.code] ?? LANGUAGE_LOCALE_MAP[defaultLanguage],
          defaultCurrencyCode: country.currencyCode,
          legalNoticeKey,
        } satisfies CountryPreferences,
      ];
    }),
  ) as Record<string, CountryPreferences>,
);

const FALLBACK_COUNTRY_PREFERENCES = COUNTRY_PREFERENCES[DEFAULT_COUNTRY.code];

export function getCountryPreferences(countryCode: string): CountryPreferences {
  return COUNTRY_PREFERENCES[countryCode] ?? FALLBACK_COUNTRY_PREFERENCES;
}

export function resolveLocaleId(languageCode: SupportedLanguageCode, preferences: CountryPreferences): string {
  return languageCode === preferences.defaultLanguage ? preferences.defaultLocale : LANGUAGE_LOCALE_MAP[languageCode];
}
