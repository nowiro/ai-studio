/**
 * Transloco bootstrap — exposed as `provideI18n()` so apps never import the
 * vendor SDK directly (ADR-0017 §wrap-before-consume).
 */
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { type EnvironmentProviders, inject, Injectable, InjectionToken, isDevMode, type Provider } from '@angular/core';

import { provideTransloco, type Translation, type TranslocoLoader } from '@jsverse/transloco';
import { type Observable } from 'rxjs';

export interface I18nConfig {
  /** Initial language code (ISO 639-1, e.g. 'pl', 'en'). */
  defaultLang: string;
  /** All supported language codes for this app. */
  availableLangs: readonly string[];
  /**
   * Production mode flag — disables missing-key warnings in console.
   * Defaults to `!isDevMode()` when omitted.
   */
  prodMode?: boolean;
  /**
   * Base path served by the app to load translations from.
   * Defaults to `/assets/i18n/` (Angular static asset convention).
   */
  assetsBasePath?: string;
}

/** Injection token carrying the runtime base path for translation JSON files. */
export const I18N_BASE_PATH = new InjectionToken<string>('I18N_BASE_PATH');

/**
 * HTTP-based Transloco loader. Fetches JSON dictionaries from
 * `{I18N_BASE_PATH}{lang}.json` (e.g. `/assets/i18n/pl.json`).
 *
 * Per-app namespaces (scopes) load from `{I18N_BASE_PATH}{namespace}/{lang}.json`
 * — Transloco handles the path composition when the scope is registered.
 */
@Injectable({ providedIn: 'root' })
export class HttpTranslationLoader implements TranslocoLoader {
  private readonly http = inject(HttpClient);
  private readonly basePath = inject(I18N_BASE_PATH);

  getTranslation(lang: string): Observable<Translation> {
    return this.http.get<Translation>(`${this.basePath}${lang}.json`);
  }
}

/**
 * Returns provider array for Transloco + HttpClient (required by the loader).
 *
 * NOTE: if your app already calls `provideHttpClient()` elsewhere, the
 * duplicate is idempotent (Angular DI dedupes by token), but prefer a single
 * `provideHttpClient()` in `app.config.ts`.
 */
export function provideI18n(config: I18nConfig): (Provider | EnvironmentProviders)[] {
  return [
    provideHttpClient(),
    { provide: I18N_BASE_PATH, useValue: config.assetsBasePath ?? '/assets/i18n/' },
    provideTransloco({
      config: {
        availableLangs: [...config.availableLangs],
        defaultLang: config.defaultLang,
        reRenderOnLangChange: true,
        prodMode: config.prodMode ?? !isDevMode(),
        fallbackLang: config.defaultLang,
        missingHandler: { allowEmpty: false, logMissingKey: !config.prodMode },
      },
      loader: HttpTranslationLoader,
    }),
  ];
}
