import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

import { getCountryPreferences } from '../data/country-preferences';
import { DEFAULT_COUNTRY, EU_COUNTRIES, type EuCountry } from '../data/eu-countries';
import { DEFAULT_LANGUAGE, EU_LANGUAGES, type EuLanguage } from '../data/eu-languages';

const STORAGE_KEY_COUNTRY = 'uv_country';
const STORAGE_KEY_LANGUAGE = 'uv_language';
const STORAGE_KEY_LANGUAGE_PREFERENCES = 'uv_language_preferences';

@Injectable({ providedIn: 'root' })
export class CountryService {
  private readonly router = inject(Router);
  readonly countries = EU_COUNTRIES;
  readonly languages = EU_LANGUAGES;
  private readonly initialCountry = this.initCountry();
  private readonly _selectedCountry = signal<EuCountry>(this.initialCountry);
  readonly selectedCountry = this._selectedCountry.asReadonly();
  private readonly _selectedLanguage = signal<EuLanguage>(this.initLanguage(this.initialCountry));
  readonly selectedLanguage = this._selectedLanguage.asReadonly();

  selectCountry(country: EuCountry): void {
    this._selectedCountry.set(country);
    localStorage.setItem(STORAGE_KEY_COUNTRY, country.code);
    this.applyLanguagePreference(country);
    void this.router.navigate(['/', country.routeCode]);
  }

  syncCountryFromRoute(routeCode: string): void {
    const country = this.resolveCountryFromRoute(routeCode);
    this._selectedCountry.set(country);
    localStorage.setItem(STORAGE_KEY_COUNTRY, country.code);
    this.applyLanguagePreference(country);
  }

  selectLanguage(language: EuLanguage): void {
    this._selectedLanguage.set(language);
    this.persistLanguagePreference(this.selectedCountry().code, language.code);
    localStorage.setItem(STORAGE_KEY_LANGUAGE, language.code);
  }

  resolveCountryFromRoute(routeCode: string): EuCountry {
    return EU_COUNTRIES.find((c) => c.routeCode === routeCode) ?? DEFAULT_COUNTRY;
  }

  private initCountry(): EuCountry {
    const code = localStorage.getItem(STORAGE_KEY_COUNTRY);
    return (code ? EU_COUNTRIES.find((country) => country.code === code) : undefined) ?? DEFAULT_COUNTRY;
  }

  private initLanguage(country: EuCountry): EuLanguage {
    return this.resolvePreferredLanguage(country, true);
  }

  private applyLanguagePreference(country: EuCountry): void {
    this._selectedLanguage.set(this.resolvePreferredLanguage(country));
  }

  private resolvePreferredLanguage(country: EuCountry, includeLegacyLanguage = false): EuLanguage {
    const preferences = this.readStoredLanguagePreferences();
    const preferredLanguageCode =
      preferences[country.code] ??
      (includeLegacyLanguage ? localStorage.getItem(STORAGE_KEY_LANGUAGE) : null) ??
      getCountryPreferences(country.code).defaultLanguage;

    return (
      EU_LANGUAGES.find((language) => language.code === preferredLanguageCode) ??
      EU_LANGUAGES.find((language) => language.code === getCountryPreferences(country.code).defaultLanguage) ??
      DEFAULT_LANGUAGE
    );
  }

  private persistLanguagePreference(countryCode: string, languageCode: string): void {
    const preferences = this.readStoredLanguagePreferences();
    preferences[countryCode] = languageCode;
    localStorage.setItem(STORAGE_KEY_LANGUAGE_PREFERENCES, JSON.stringify(preferences));
  }

  private readStoredLanguagePreferences(): Record<string, string> {
    const rawValue = localStorage.getItem(STORAGE_KEY_LANGUAGE_PREFERENCES);

    if (!rawValue) {
      return {};
    }

    try {
      const parsed: unknown = JSON.parse(rawValue);
      return parsed && typeof parsed === 'object' ? (parsed as Record<string, string>) : {};
    } catch {
      return {};
    }
  }
}
