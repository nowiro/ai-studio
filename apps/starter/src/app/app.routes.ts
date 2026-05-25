import type { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadChildren: () => import('@ai-studio/starter-feature').then((m) => m.STARTER_FEATURE_ROUTES),
  },
];
