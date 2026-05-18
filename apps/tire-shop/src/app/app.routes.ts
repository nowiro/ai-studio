import type { Routes } from '@angular/router';

import { NotFoundComponent } from '@ai-studio/shared-app-shell';
import { CartPageComponent, CheckoutComponent } from '@ai-studio/tire-feature-cart';

/**
 * Routes for the tire-shop app. The catalogue feature is lazy-loaded; the
 * cart pages live in the same chunk as the header-mounted drawer to keep
 * the bundle simple. The empty-route catalogue is still lazy so the home
 * page renders without pulling product-detail JS.
 */
export const APP_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: async () => import('@ai-studio/tire-feature-catalogue').then((m) => m.CataloguePageComponent),
  },
  {
    path: 'product/:id',
    loadComponent: async () => import('@ai-studio/tire-feature-catalogue').then((m) => m.ProductDetailComponent),
  },
  { path: 'cart', component: CartPageComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: '**', component: NotFoundComponent },
];
