import type { ApplicationConfig } from '@angular/core';
import { provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { provideI18n } from '@ai-studio/shared-i18n';

import { appRoutes } from './app.routes';

/**
 * Nowiro application root config.
 *
 * I18n: this app currently uses a typed in-code dictionary at
 * `src/app/i18n/translations.ts` (legacy, pre-ADR-0017). We wire
 * `provideI18n()` here as the staged migration baseline — once a feature
 * needs runtime translations or a third locale, switch the relevant
 * template to the `t` pipe (re-exported from `@ai-studio/shared-i18n`) and
 * remove the matching keys from the legacy dictionary.
 *
 * Translations live at `apps/nowiro/public/assets/i18n/{pl,en}.json`.
 * See `docs/adr/0017-transloco-i18n.md` for the full rationale.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideI18n({
      defaultLang: 'pl',
      availableLangs: ['pl', 'en'],
    }),
    provideRouter(
      appRoutes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'disabled',
        anchorScrolling: 'disabled',
      }),
    ),
  ],
};
