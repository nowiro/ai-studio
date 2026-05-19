/**
 * Web Component entry — exposes the library demo as `<ais-library>`.
 *
 * The library uses role-based UI gated by `AUTH_CONTEXT`. The custom element
 * embeds the mock `AuthService` by default; production deployments swap this
 * for `provideKeycloak()` per ADR-0013.
 *
 * Build: `pnpm nx run library:build-element` → `dist/apps/library-element/main.js`.
 * Pattern documented in `docs/adr/0012-app-dual-mode-web-components.md`.
 */
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { AuthService } from '@ai-studio/library-data';
import { AUTH_CONTEXT, bootstrapAsElement } from '@ai-studio/shared-app-shell';

import { AppComponent } from './app/app.component.js';
import { APP_ROUTES } from './app/app.routes.js';

void bootstrapAsElement(AppComponent, 'ais-library', {
  providers: [
    provideRouter(APP_ROUTES, withComponentInputBinding()),
    provideHttpClient(withFetch()),
    { provide: AUTH_CONTEXT, useExisting: AuthService },
  ],
});
