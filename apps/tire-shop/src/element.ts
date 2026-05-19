/**
 * Web Component entry — exposes the tire-shop demo as `<ais-tire-shop>`.
 * Build: `pnpm nx run tire-shop:build-element` → `dist/apps/tire-shop-element/main.js`.
 * Pattern documented in `docs/adr/0012-app-dual-mode-web-components.md`.
 */
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { bootstrapAsElement } from '@ai-studio/shared-app-shell';

import { AppComponent } from './app/app.component.js';
import { APP_ROUTES } from './app/app.routes.js';

void bootstrapAsElement(AppComponent, 'ais-tire-shop', {
  providers: [provideRouter(APP_ROUTES, withComponentInputBinding()), provideHttpClient(withFetch())],
});
