import type { Routes } from '@angular/router';

import { NotFoundComponent } from '@ai-studio/shared-app-shell';
import { CartPageComponent, CheckoutComponent } from '@ai-studio/shop-ui';

/**
 * Bookstore routes. Catalogue + book detail are lazy-loaded; `/cart` and
 * `/checkout` are eager because the header-mounted cart drawer
 * statically imports their lib (avoids the "static-import-of-lazy-lib"
 * lint rule).
 */
export const APP_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: async () => import('@ai-studio/bookstore-feature-catalogue').then((m) => m.CataloguePageComponent),
  },
  {
    path: 'book/:id',
    loadComponent: async () => import('@ai-studio/bookstore-feature-catalogue').then((m) => m.BookDetailComponent),
  },
  { path: 'cart', component: CartPageComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: '**', component: NotFoundComponent },
];
