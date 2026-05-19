/**
 * Web Component entry — exposes the toy-shop as `<ais-toy-shop>`.
 * Wires the toy catalogue + cart storage key into the shared `ShopCartService`.
 * Build: `pnpm nx run toy-shop:build-element` → `dist/apps/toy-shop-element/main.js`.
 * Pattern documented in `docs/adr/0012-app-dual-mode-web-components.md`.
 */
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { bootstrapAsElement } from '@ai-studio/shared-app-shell';
import { CART_STORAGE_KEY, PRODUCT_LOOKUP } from '@ai-studio/shop-core';
import { ToyShopCatalogueService } from '@ai-studio/toy-shop-data';

import { AppComponent } from './app/app.component.js';
import { APP_ROUTES } from './app/app.routes.js';

void bootstrapAsElement(AppComponent, 'ais-toy-shop', {
  providers: [
    provideRouter(APP_ROUTES, withComponentInputBinding()),
    provideHttpClient(withFetch()),
    { provide: PRODUCT_LOOKUP, useExisting: ToyShopCatalogueService },
    { provide: CART_STORAGE_KEY, useValue: 'ais.toy-shop.cart.v1' },
  ],
});
