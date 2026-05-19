/**
 * Standalone SPA entry point — boots the business-wizard at its dedicated
 * port (4212) via `pnpm start:business-wizard`.
 *
 * The Web Component entry lives in `./element.ts` — see ADR-0012 for the
 * dual-mode embedding contract.
 */
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { bootstrapApp } from '@ai-studio/shared-app-shell';

import { AppComponent } from './app/app.component.js';
import { APP_ROUTES } from './app/app.routes.js';

bootstrapApp(AppComponent, {
  providers: [provideRouter(APP_ROUTES, withComponentInputBinding()), provideHttpClient(withFetch())],
});
