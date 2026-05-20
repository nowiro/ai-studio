import type { Routes } from '@angular/router';

import { NotFoundComponent } from '@ai-studio/shared-app-shell';

/**
 * Routes for the Tetris app. `/` lazy-loads `TetrisHostComponent` so the
 * Tetris UI bundle doesn't bloat the main chunk; `/leaderboard` is its
 * own lazy chunk.
 */
export const APP_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: async () => import('@ai-studio/game-tetris-ui').then((m) => m.TetrisHostComponent),
  },
  {
    path: 'leaderboard',
    loadComponent: async () => import('@ai-studio/game-tetris-ui').then((m) => m.TetrisLeaderboardPageComponent),
  },
  { path: '**', component: NotFoundComponent },
];
