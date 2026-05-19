/**
 * Web Component entry — exposes the school-journal as `<ais-school-journal>`.
 *
 * Role-based UI is gated by `AUTH_CONTEXT` bound to the mock `SessionService`.
 * Production swaps to `provideKeycloak()` per ADR-0013.
 *
 * Build: `pnpm nx run school-journal:build-element` → `dist/apps/school-journal-element/main.js`.
 * Pattern documented in `docs/adr/0012-app-dual-mode-web-components.md`.
 */
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { SessionService } from '@ai-studio/journal-data';
import { AUTH_CONTEXT, bootstrapAsElement } from '@ai-studio/shared-app-shell';

import { AppComponent } from './app/app.component.js';
import { APP_ROUTES } from './app/app.routes.js';

void bootstrapAsElement(AppComponent, 'ais-school-journal', {
  providers: [
    provideRouter(APP_ROUTES, withComponentInputBinding()),
    provideHttpClient(withFetch()),
    { provide: AUTH_CONTEXT, useExisting: SessionService },
  ],
});
