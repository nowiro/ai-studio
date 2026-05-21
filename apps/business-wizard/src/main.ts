/**
 * Standalone SPA entry point — boots the business-wizard at its dedicated
 * port (4212) via `pnpm start:business-wizard`.
 *
 * The Web Component entry lives in `./element.ts` — see ADR-0012 for the
 * dual-mode embedding contract.
 */
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { BusinessFormFillStrategy } from '@ai-studio/business-wizard-data';
import { bootstrapApp } from '@ai-studio/shared-app-shell';
import { FORM_FILL_STRATEGY } from '@ai-studio/wizard-form-fill';

import { AppComponent } from './app/app.component.js';
import { APP_ROUTES } from './app/app.routes.js';

// FORM_FILL_STRATEGY wires the dev-tools FAB (from `@ai-studio/wizard-form-fill`)
// into the business-wizard's form shape — see ADR-0011 §wrap before consume.
bootstrapApp(AppComponent, {
  providers: [
    provideRouter(APP_ROUTES, withComponentInputBinding()),
    provideHttpClient(withFetch()),
    { provide: FORM_FILL_STRATEGY, useExisting: BusinessFormFillStrategy },
  ],
});
