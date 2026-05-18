import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { BookstoreCatalogueService } from '@ai-studio/bookstore-data';
import { bootstrapApp } from '@ai-studio/shared-app-shell';
import { CART_STORAGE_KEY, PRODUCT_LOOKUP } from '@ai-studio/shop-core';

import { AppComponent } from './app/app.component.js';
import { APP_ROUTES } from './app/app.routes.js';

bootstrapApp(AppComponent, {
  providers: [
    provideRouter(APP_ROUTES, withComponentInputBinding()),
    provideHttpClient(withFetch()),
    // Plug the bookstore's catalogue into the shared `ShopCartService`.
    { provide: PRODUCT_LOOKUP, useExisting: BookstoreCatalogueService },
    { provide: CART_STORAGE_KEY, useValue: 'ais.bookstore.cart.v1' },
  ],
});
