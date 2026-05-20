import type { Routes } from '@angular/router';

/**
 * Dashboard routes.
 *
 * - `/` → live dashboard (KPI strip + chart panels + low-stock table).
 * - `/charts/showcase` → lazy-loaded gallery of every chart wrapper with
 *   sample data; used by designers + incoming engineers as a living
 *   visual contract.
 */
export const ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('@ai-studio/dashboard-feature').then((m) => m.DashboardPageComponent),
  },
  {
    path: 'charts/showcase',
    loadComponent: () => import('@ai-studio/dashboard-feature').then((m) => m.ChartsShowcaseComponent),
  },
  { path: '**', redirectTo: '' },
];
