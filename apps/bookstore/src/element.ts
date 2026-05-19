/**
 * Web Component entry — exposes the bookstore as `<ais-bookstore>`.
 * Wires the bookstore catalogue + cart storage key into the shared `ShopCartService`.
 * Build: `pnpm nx run bookstore:build-element` → `dist/apps/bookstore-element/main.js`.
 * Pattern documented in `docs/adr/0012-app-dual-mode-web-components.md`.
 */
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { BookstoreCatalogueService } from '@ai-studio/bookstore-data';
import { bootstrapAsElement } from '@ai-studio/shared-app-shell';
import { CART_STORAGE_KEY, PRODUCT_LOOKUP } from '@ai-studio/shop-core';

import { AppComponent } from './app/app.component.js';
import { APP_ROUTES } from './app/app.routes.js';

void bootstrapAsElement(AppComponent, 'ais-bookstore', {
  providers: [
    provideRouter(APP_ROUTES, withComponentInputBinding()),
    provideHttpClient(withFetch()),
    { provide: PRODUCT_LOOKUP, useExisting: BookstoreCatalogueService },
    { provide: CART_STORAGE_KEY, useValue: 'ais.bookstore.cart.v1' },
  ],
});
