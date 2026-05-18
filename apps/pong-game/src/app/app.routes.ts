/**
 * Routes for the Pong game app. The `/` route is gated by the `PONG_ENABLED`
 * build-time env var — when `"false"`, the user is sent to the not-found view
 * and the Phaser bundle is never loaded (lazy import lives behind the guard).
 *
 * `NotFoundComponent` is imported statically because `main.ts` already pulls
 * in `@ai-studio/shared-app-shell` for `bootstrapApp` — Nx forbids mixing
 * static + lazy imports of the same lib (it defeats the lazy split). The
 * shared-app-shell chunk is therefore in the main bundle either way.
 * @see docs/analytical/specs/2026-05-08-pong-game/spec.md AC-10
 */
import type { Routes } from '@angular/router';

import { NotFoundComponent } from '@ai-studio/shared-app-shell';

import { PongPath } from './app-routes.js';

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
        path: PongPath.Game,
        loadComponent: async () => import('./pong-host.component.js').then((m) => m.PongHostComponent),
      },
      { path: PongPath.Wildcard, component: NotFoundComponent },
    ]
  : [{ path: PongPath.Wildcard, component: NotFoundComponent }];
