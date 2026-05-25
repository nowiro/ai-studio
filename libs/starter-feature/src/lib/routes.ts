import type { Route } from '@angular/router';

/**
 * Routes exposed by `starter-feature`. Mounted by `apps/starter` at the
 * application root.
 */
export const STARTER_FEATURE_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () => import('./home/home.component').then((m) => m.HomeComponent),
    title: 'Starter · AI Studio',
  },
];
