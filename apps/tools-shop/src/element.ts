/**
 * Web Component entry — exposes the tools-shop as `<ais-tools-shop>`.
 * Wires the tools catalogue + cart storage key into the shared `ShopCartService`.
 * Build: `pnpm nx run tools-shop:build-element` → `dist/apps/tools-shop-element/main.js`.
 * Pattern documented in `docs/adr/0012-app-dual-mode-web-components.md`.
 */
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { bootstrapAsElement } from '@ai-studio/shared-app-shell';
import { CART_STORAGE_KEY, PRODUCT_LOOKUP } from '@ai-studio/shop-core';
import { ToolsShopCatalogueService } from '@ai-studio/tools-shop-data';

import { AppComponent } from './app/app.component.js';
import { APP_ROUTES } from './app/app.routes.js';

void bootstrapAsElement(AppComponent, 'ais-tools-shop', {
  providers: [
    provideRouter(APP_ROUTES, withComponentInputBinding()),
    provideHttpClient(withFetch()),
    { provide: PRODUCT_LOOKUP, useExisting: ToolsShopCatalogueService },
    { provide: CART_STORAGE_KEY, useValue: 'ais.tools-shop.cart.v1' },
  ],
});
