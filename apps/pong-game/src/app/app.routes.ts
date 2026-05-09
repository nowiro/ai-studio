/**
 * Routes for the Pong game app. The `/` route is gated by the `PONG_ENABLED`
 * build-time env var — when `"false"`, the user is sent to the not-found view
 * and the Phaser bundle is never loaded (lazy import lives behind the guard).
 * @see docs/analytical/specs/2026-05-08-pong-game/spec.md AC-10
 */
import type { Routes } from '@angular/router';

/** Build-time flag — declared for type safety; injected by the bundler. */
declare const PONG_ENABLED: string | undefined;

const enabled =
  typeof PONG_ENABLED === 'string'
    ? PONG_ENABLED !== 'false'
    : (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env?.['PONG_ENABLED'] !==
      'false';

export const APP_ROUTES: Routes = enabled
  ? [
      {
        path: '',
        loadComponent: async () => import('./pong-host.component.js').then((m) => m.PongHostComponent),
      },
      {
        path: '**',
        loadComponent: async () => import('./not-found.component.js').then((m) => m.NotFoundComponent),
      },
    ]
  : [
      {
        path: '**',
        loadComponent: async () => import('./not-found.component.js').then((m) => m.NotFoundComponent),
      },
    ];
