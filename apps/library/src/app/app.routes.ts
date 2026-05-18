import type { Routes } from '@angular/router';

import { NotFoundComponent, roleGuard } from '@ai-studio/shared-app-shell';

/**
 * Routes for the library demo app. Librarian routes are role-gated via
 * the shared `roleGuard()` factory; the active role is read from the
 * library's `AuthService` (wired through `AUTH_CONTEXT` in `main.ts`).
 */
export const APP_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: async () => import('@ai-studio/library-feature-catalogue').then((m) => m.CataloguePageComponent),
  },
  {
    path: 'book/:id',
    loadComponent: async () => import('@ai-studio/library-feature-catalogue').then((m) => m.BookDetailComponent),
  },
  {
    path: 'account',
    loadComponent: async () => import('@ai-studio/library-feature-account').then((m) => m.AccountPageComponent),
  },
  {
    path: 'librarian',
    canMatch: [roleGuard(['librarian'], '/account')],
    loadComponent: async () => import('@ai-studio/library-feature-librarian').then((m) => m.LibrarianPageComponent),
  },
  { path: '**', component: NotFoundComponent },
];
