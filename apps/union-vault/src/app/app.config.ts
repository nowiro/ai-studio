import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withFetch } from '@angular/common/http';
import localePl from '@angular/common/locales/pl';
import type { ApplicationConfig } from '@angular/core';
import { inject, LOCALE_ID, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';

import { APP_ROUTES } from './app.routes';

registerLocaleData(localePl);

// Angular 21 / Material 3 — `provideAnimationsAsync()` is deprecated (20.2). Material
// components no longer require a global animations provider. The new `animate.enter` /
// `animate.leave` directives cover one-off animation needs.
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(APP_ROUTES, withComponentInputBinding(), withViewTransitions()),
    // XSRF/CSRF (Angular best practices §14): the only HTTP calls in this app
    // are GETs to public APIs (Frankfurter, FloatRates) — XSRF tokens are not
    // required and Angular automatically suppresses them on cross-origin requests.
    // If a same-origin backend with mutating requests is added later, switch to:
    //   `provideHttpClient(withFetch(), withXsrfConfiguration({ cookieName: 'XSRF-TOKEN', headerName: 'X-XSRF-TOKEN' }))`.
    provideHttpClient(withFetch()),
    { provide: LOCALE_ID, useValue: 'pl' },
    provideAppInitializer(() => {
      inject(MatIconRegistry).setDefaultFontSetClass('material-symbols-outlined');
    }),
  ],
};
