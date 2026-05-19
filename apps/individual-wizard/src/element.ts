/**
 * Web Component entry — exposes the individual-wizard as `<ais-individual-wizard>`.
 * Build: `pnpm nx run individual-wizard:build-element` → `dist/apps/individual-wizard-element/main.js`.
 * Sibling of `<ais-business-wizard>` (B2B variant). Pattern documented in
 * `docs/adr/0012-app-dual-mode-web-components.md`.
 */
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { bootstrapAsElement } from '@ai-studio/shared-app-shell';

import { AppComponent } from './app/app.component.js';
import { APP_ROUTES } from './app/app.routes.js';

void bootstrapAsElement(AppComponent, 'ais-individual-wizard', {
  providers: [provideRouter(APP_ROUTES, withComponentInputBinding())],
});
