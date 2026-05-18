import type { Routes } from '@angular/router';

import { NotFoundComponent } from '@ai-studio/shared-app-shell';

/**
 * Routes for the Tetris app. `/` lazy-loads `TetrisHostComponent` so the
 * Tetris UI bundle doesn't bloat the main chunk.
 */
export const APP_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: async () => import('@ai-studio/game-tetris-ui').then((m) => m.TetrisHostComponent),
  },
  { path: '**', component: NotFoundComponent },
];
