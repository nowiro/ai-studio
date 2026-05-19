---
name: microfrontend-orchestration
description: |
  Native Federation microfrontend patterns for AI Studio. Use whenever you wire `apps/portal`
  to load remote apps, configure `federation.config.js` per remote, define the manifest, or
  set up cross-MFE communication via `BroadcastChannel`. Covers shell vs remote roles, lazy
  manifest loading, shared singleton dependencies (`@angular/core`, `rxjs`), eager bootstrap,
  and version-mismatch debugging. Linked to ADR-0009 (canonical decision).
---

# Microfrontend orchestration (AI Studio)

> Reach for this skill whenever you work on `apps/portal` (the shell) or any app that wants
> to be loaded as a remote. ADR-0009 chose **Native Federation** over Module Federation —
> Native Federation builds on the W3C Import Maps spec and works with `@angular/build`'s
> esbuild backend (Module Federation requires webpack).
>
> Stack: `@angular-architects/native-federation@^21`, `@angular/build`, runtime manifest at
> `assets/federation.manifest.json`, `BroadcastChannel` for cross-MFE messages.

## 1. Architecture — shell + remotes

```
apps/portal/          ← shell (host)
  ├── src/main.ts     ← initFederation() before bootstrap
  ├── src/app/        ← portal shell UI + routing to remotes
  └── assets/
      └── federation.manifest.json  ← maps remote name → URL

apps/dashboard/       ← remote (loaded by portal)
  ├── federation.config.js
  └── src/main.ts
apps/library/         ← remote
apps/tire-shop/       ← remote
... etc.
```

The portal owns the **route registry** that points to remotes. Each remote exposes one or more
**modules** (typically a route component or a feature lib).

## 2. Per-remote `federation.config.js`

```js
// apps/library/federation.config.js
const { withNativeFederation, shareAll } = require('@angular-architects/native-federation/config');

module.exports = withNativeFederation({
  name: 'library',
  exposes: {
    './Component': './apps/library/src/app/app.component.ts',
    './Routes': './apps/library/src/app/app.routes.ts',
  },
  shared: {
    ...shareAll({ singleton: true, strictVersion: false, requiredVersion: 'auto' }),
  },
  skip: ['rxjs/ajax', 'rxjs/fetch', 'rxjs/testing', 'rxjs/webSocket', '@angular/platform-server'],
});
```

| Key       | Why                                                                               |
| --------- | --------------------------------------------------------------------------------- |
| `name`    | Remote identifier — matches the manifest key                                      |
| `exposes` | Map of public modules — `./Component` is the convention for "the route component" |
| `shared`  | Singleton peers — `@angular/core`, `rxjs`, `@angular/router` MUST be singletons   |
| `skip`    | Modules that should not be federated (server-only, secondary entry points)        |

`strictVersion: false` lets minor mismatches load (warns in console). For production, lock all
remotes to the same Angular version.

## 3. Portal manifest

```jsonc
// apps/portal/src/assets/federation.manifest.json
{
  "dashboard": "http://localhost:4207/remoteEntry.json",
  "library": "http://localhost:4206/remoteEntry.json",
  "tire-shop": "http://localhost:4203/remoteEntry.json",
  "school-journal": "http://localhost:4208/remoteEntry.json",
  "bookstore": "http://localhost:4209/remoteEntry.json",
}
```

In production the URLs point to CDN paths (`https://cdn.example.com/library/remoteEntry.json`).
The manifest is fetched at runtime — no rebuild of the shell required when a remote ships a new
version.

## 4. Shell bootstrap — `initFederation` first

```ts
// apps/portal/src/main.ts
import { initFederation } from '@angular-architects/native-federation';

initFederation('assets/federation.manifest.json')
  .catch((err) => console.error('federation init failed', err))
  .then(() => import('./bootstrap'))
  .catch((err) => console.error('bootstrap failed', err));
```

```ts
// apps/portal/src/bootstrap.ts
import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig);
```

The two-file pattern (`main.ts` → `bootstrap.ts`) is **mandatory** — `initFederation` must run
before any Angular code executes, otherwise the import-map is missing when remotes try to load
shared singletons.

## 5. Lazy-loading a remote in routes

```ts
// apps/portal/src/app/app.routes.ts
import { Routes } from '@angular/router';

import { loadRemoteModule } from '@angular-architects/native-federation';

export const portalRoutes: Routes = [
  { path: '', loadComponent: () => import('./home/home.component').then((m) => m.HomeComponent) },
  {
    path: 'library',
    loadComponent: () =>
      loadRemoteModule({
        remoteName: 'library',
        exposedModule: './Component',
      }).then((m) => m.AppComponent),
  },
  {
    path: 'tire-shop',
    loadChildren: () =>
      loadRemoteModule({
        remoteName: 'tire-shop',
        exposedModule: './Routes',
      }).then((m) => m.appRoutes),
  },
];
```

Two variants:

- `loadComponent` + `./Component` — loads a single component (whole app screen).
- `loadChildren` + `./Routes` — loads a route tree (recommended for any non-trivial remote).

## 6. Cross-MFE communication — `BroadcastChannel`

Remotes are sandboxed by design — they don't share services across the federation boundary.
For cross-MFE events use the **`BroadcastChannel` API** (native, no library).

```ts
// libs/shared-mfe-bus/src/lib/portal-bus.ts
import { Injectable, signal } from '@angular/core';

interface PortalEvent {
  type: 'theme-change' | 'auth-token-refreshed' | 'navigate-to';
  payload: unknown;
}

@Injectable({ providedIn: 'root' })
export class PortalBus {
  private readonly channel = new BroadcastChannel('ai-studio-portal');
  readonly lastEvent = signal<PortalEvent | null>(null);

  constructor() {
    this.channel.addEventListener('message', (e: MessageEvent<PortalEvent>) => {
      this.lastEvent.set(e.data);
    });
  }

  emit(event: PortalEvent): void {
    this.channel.postMessage(event);
  }
}
```

Inject in shell and remotes alike — same code, same channel name, messages flow across MFEs.

## 7. Shared dependency strategy

Singletons (`{ singleton: true }`):

- `@angular/core`, `@angular/common`, `@angular/router`, `@angular/forms`
- `rxjs`
- `@ai-studio/keycloak-auth` (one auth provider per session)
- `@ai-studio/shared-app-shell` (one toolbar / one theme provider)

Non-singletons (one copy per remote, no `singleton: true`):

- Feature-specific UI kits.
- Test helpers (never federated; `skip` them).

Version mismatch behaviour:

| `strictVersion` | Outcome                                                            |
| --------------- | ------------------------------------------------------------------ |
| `true`          | Federation throws if any remote ships a different major            |
| `false` (dev)   | Warns; loads the first version that wins the import-map resolution |

Production: pin everyone to the same Angular minor; set `strictVersion: true`.

## 8. Build & serve

```bash
# Build all remotes + portal (dev)
pnpm nx run-many -t serve --projects=portal,library,tire-shop --parallel=4
# Open http://localhost:4200 — portal serves the manifest and routes to remotes
```

`pnpm start:portal-stack` is a shortcut for portal + dashboard.

Production build:

```bash
pnpm nx run-many -t build --projects=portal,library,tire-shop --parallel=4
# Deploy each app's dist/ to its own URL; portal references them via the manifest
```

## 9. Versioning & deploy

The portal's manifest is the **single source of versioning**:

```jsonc
// assets/federation.manifest.json (production)
{
  "library": "https://cdn.example.com/library/2026-05-20/remoteEntry.json",
  "tire-shop": "https://cdn.example.com/tire-shop/2026-05-15/remoteEntry.json",
}
```

Each remote deploys to a versioned path. The portal flips the manifest entry when a remote
is ready. Old versions stay live (cheap rollback).

## 10. Anti-patterns

- One mega-bundle that imports every remote eagerly. Defeats the purpose of MFE.
- Sharing application state (a SignalStore) across MFEs via federation. Use `BroadcastChannel`
  or a backend.
- Forgetting the `main.ts` → `bootstrap.ts` split. Federation never initialises.
- Singleton-marking everything. RxJS singleton is mandatory; lodash isn't.
- Hard-coding remote URLs in code (`loadRemoteModule({ remoteName: 'lib', url: '...' })`).
  Use the manifest.
- Federating `@angular/platform-server`. Server-side modules don't belong in a browser bundle.
- A remote that imports another remote at compile time. Communicate via routes / bus instead.
- Mixed Angular major versions across the portal+remotes — implicit upgrade trap.

## 11. Debugging tips

| Symptom                                                | Try                                                                                                                                                   |
| ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| "Shared module is not available for eager consumption" | Move imports out of top-level `main.ts` into `bootstrap.ts`                                                                                           |
| Two copies of `@angular/core` in the bundle            | Check `shared` config — both portal and remote must mark singleton                                                                                    |
| Manifest 404 in production                             | Build pipeline didn't ship `assets/federation.manifest.json`                                                                                          |
| Remote loads but `RouterLink` doesn't work             | Provide `provideRouter(...)` in the remote's own `main.ts` if loaded as a component, or have the portal own the router and pass routes via `./Routes` |
| TypeScript can't see federated types                   | Add a `.d.ts` shim: `declare module 'library/Component';`                                                                                             |

## 12. Quick MFE-author checklist

Before reporting done:

- [ ] Remote has `federation.config.js` with `name`, `exposes`, `shared`?
- [ ] Portal manifest entry points to the right URL?
- [ ] Portal `main.ts` calls `initFederation(...)` BEFORE dynamic `import('./bootstrap')`?
- [ ] Singletons declared for `@angular/*`, `rxjs`, shared shell lib?
- [ ] Routes use `loadRemoteModule({ remoteName, exposedModule })` (not URL)?
- [ ] Cross-MFE events flow through `BroadcastChannel`, not federation?
- [ ] All remotes ship the same Angular minor?
- [ ] Production manifest references versioned paths (rollback-friendly)?
- [ ] CI builds shell + every remote on every PR (Nx affected catches drift)?

---

_Reference: `apps/portal` is the shell. `apps/dashboard` is the first remote. ADR-0009 covers
the architectural decision. See [`web-component-build`](../web-component-build/SKILL.md) for
the alternative when the host is not Angular._
