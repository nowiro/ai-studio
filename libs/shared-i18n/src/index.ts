/**
 * Public API for the shared-i18n library — single seam for Transloco.
 *
 * Per ADR-0017 (Transloco for i18n), this lib is the ONLY place that imports
 * `@jsverse/transloco`. Apps consume `@ai-studio/shared-i18n` exclusively.
 *
 * Future swap (e.g. to native `@angular/localize` when lazy namespaces land)
 * is a one-file change inside this lib — consumers are unaffected.
 *
 * Usage in `app.config.ts`:
 *
 * ```ts
 * import { provideI18n } from '@ai-studio/shared-i18n';
 *
 * bootstrapApplication(AppComponent, {
 *   providers: [
 *     provideI18n({
 *       defaultLang: 'pl',
 *       availableLangs: ['pl', 'en'],
 *       prodMode: !isDevMode(),
 *     }),
 *   ],
 * });
 * ```
 *
 * Usage in templates:
 *
 * ```html
 * <h1>{{ 'home.welcome' | t }}</h1>
 * <mat-label>{{ 'form.email' | t }}</mat-label>
 * <button [attr.aria-label]="'actions.save' | t">{{ 'actions.save' | t }}</button>
 * ```
 *
 * @packageDocumentation
 */
export { provideI18n, type I18nConfig } from './lib/i18n.providers.js';
export { LocalizationApi } from './lib/localization.api.js';
export { TranslatePipe as TPipe } from './lib/translate.pipe.js';
