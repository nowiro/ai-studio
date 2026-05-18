import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { bootstrapApp } from '@ai-studio/shared-app-shell';
import { CART_STORAGE_KEY, PRODUCT_LOOKUP } from '@ai-studio/shop-core';
import { ToyShopCatalogueService } from '@ai-studio/toy-shop-data';

import { AppComponent } from './app/app.component.js';
import { APP_ROUTES } from './app/app.routes.js';

bootstrapApp(AppComponent, {
  providers: [
    provideRouter(APP_ROUTES, withComponentInputBinding()),
    provideHttpClient(withFetch()),
    { provide: PRODUCT_LOOKUP, useExisting: ToyShopCatalogueService },
    { provide: CART_STORAGE_KEY, useValue: 'ais.toy-shop.cart.v1' },
  ],
});
