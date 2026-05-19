import type { Routes } from '@angular/router';

import { PortalLandingComponent, RemoteHostComponent } from '@ai-studio/portal-shell';

/**
 * Portal routes:
 *
 *   `/`                      → redirect to `/portal`
 *   `/portal`                → landing page with cards for every remote
 *   `/portal/<slug>`         → renders `<ais-<slug>>` via `RemoteHostComponent`
 *   `/portal/<slug>/**`      → same component handles nested remote routes
 *                              (the remote's internal router operates within
 *                              the WC's virtual URL — see ADR-0009)
 *
 * `withComponentInputBinding()` (set in main.ts) delivers the `:slug`
 * segment into `RemoteHostComponent.slug` as a signal input.
 */
export const APP_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'portal' },
  { path: 'portal', pathMatch: 'full', component: PortalLandingComponent },
  { path: 'portal/:slug', component: RemoteHostComponent },
  // Catch nested remote routes so deep-links into a remote work; the WC
  // ignores the extra segments (its internal router uses a virtual URL).
  { path: 'portal/:slug/**', component: RemoteHostComponent },
  { path: '**', redirectTo: 'portal' },
];
