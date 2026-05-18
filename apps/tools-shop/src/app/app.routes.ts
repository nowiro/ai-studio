import type { Routes } from '@angular/router';

import { NotFoundComponent } from '@ai-studio/shared-app-shell';
import { CartPageComponent, CheckoutComponent } from '@ai-studio/shop-ui';

export const APP_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: async () => import('@ai-studio/tools-shop-feature-catalogue').then((m) => m.CataloguePageComponent),
  },
  {
    path: 'tool/:id',
    loadComponent: async () => import('@ai-studio/tools-shop-feature-catalogue').then((m) => m.ToolDetailComponent),
  },
  { path: 'cart', component: CartPageComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: '**', component: NotFoundComponent },
];
