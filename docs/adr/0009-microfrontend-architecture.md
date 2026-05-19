# 0009 — Microfrontend architecture for the portal-of-apps

- Status: accepted (2026-05-19, after /clarify)
- Date: 2026-05-18
- Decision-makers: orchestrator, architect
- Consulted: frontend-developer, code-reviewer
- Informed: every app maintainer

## Context and problem statement

The repo grew from one app (`pong-game`) into 11 demos that solve
different shapes of frontend problem. We want to surface them under a
single navigable shell — `apps/portal` (port 4200) — while letting
each app keep running standalone on its own port (`pnpm start:<app>`).
The portal must lazy-load each app's bundle at runtime, share a few
DI singletons (cart, auth) across loaded sub-apps, and stay
buildable without a network round-trip during development.

Which microfrontend technique fits Angular 21 + Vite + the existing
Nx 22 build?

## Decision drivers

- Angular 21 ships with `@angular/build` (esbuild + Vite). Webpack
  Module Federation is incompatible with this builder.
- Sub-app independence — each MFE keeps its own `package.json` deps,
  test suite, ESLint scope.
- Shared singletons — the cart drawer and the auth context must stay
  identical across sub-apps loaded into the portal.
- Standalone parity — a developer running `pnpm start:tire-shop`
  should see the same UI as the same app loaded through the portal.
- Dev ergonomics — loading 12+ remote manifests from disk during
  `pnpm start:portal` must not balloon startup beyond ~10 s on a
  16 GB laptop.
- Bundle dedup — Angular Material's runtime should not ship 12 times.

## Considered options

1. **Native Federation** (`@angular-architects/native-federation`) —
   Angular 21 + Vite native, ESM-based, no Webpack. Each remote exposes
   modules via a `federation.config.ts` and a generated `remoteEntry`.
   Host resolves remotes lazily via `loadRemoteModule()`.
2. **Webpack Module Federation** — the original technique. Drops the
   `@angular/build` builder for the legacy Webpack builder.
3. **Web Components** as the cross-app boundary — every sub-app exports
   `<ais-<app>>` via `@angular/elements`; the portal loads each tag
   on demand via `<script type="module">`.
4. **iframes** — true sandboxing, but breaks shared cart + shared CSS.

## Decision outcome

Chosen option **1 — Native Federation**.

It is the only technique compatible with Angular 21's `@angular/build`
builder, and the `@angular-architects/native-federation` package is the
official-blessed path documented in [Angular's CLI esbuild
docs](https://angular.dev/tools/cli/esbuild#native-federation). Web
Components stay in the picture as a parallel concern — they're how a
non-Angular host page embeds one of our apps (see ADR-0012) — but the
portal-of-apps surface uses federation because it gives us:

- DI hoisting (portal-scope singletons reach every sub-app via the
  remote's injector chain).
- Per-remote routing (`/portal/tire-shop/product/tire-001`).
- Single Angular runtime when remotes share the same major.
- Vite-native dev server (`pnpm start:portal` boots in < 10 s).

### Consequences

- ➕ Each app keeps its existing `pnpm start:<app>` standalone target.
  The new `build:remote` target additionally emits a federation
  manifest. Standalone and federated modes share the same
  `AppComponent`.
- ➕ Shared singletons (`ShopCartService`, `AUTH_CONTEXT`) live at
  portal scope. Sub-apps that consume them via `inject()` see the
  portal's instance when loaded through the portal, and a local
  instance when running standalone — the seam is documented per app.
- ➕ Dashboard reads each shop's data lib **directly** (not via
  federation), because it's a parallel reader of the same seed data,
  not a downstream consumer of live cart state.
- ➖ Native Federation tooling is still maturing — sub-app build
  manifests may drift between Angular minor releases. We pin
  `@angular-architects/native-federation` and smoke-test the manifest
  per app in Phase 3.
- ➖ Cross-MFE cart state requires explicit DI plumbing. Apps that
  forget to consume the portal-scope `ShopCartService` will silently
  use their own instance — caught in code review (rule documented in
  this ADR § Shared state).

## Pros and cons of the options

### Option 1 — Native Federation (chosen)

- ➕ Angular 21 + `@angular/build` compatible.
- ➕ Vite-native dev server.
- ➕ Shared DI singletons via injector chain.
- ➕ Vendor library (`@angular-architects`) is the canonical path
  Angular itself points at.
- ➖ Tooling churn — minor-version manifest drift requires CI smoke
  tests.

### Option 2 — Webpack Module Federation

- ➕ Battle-tested.
- ➖ Forces every app off `@angular/build` back to the legacy Webpack
  builder. Loses 5–10× dev startup speed.
- ➖ Conflicts with Vite-only deps already in the repo.

### Option 3 — Web Components only

- ➕ Trivial host page integration.
- ➕ Works with non-Angular hosts.
- ➖ No DI hoisting — each WC creates a fresh Angular runtime + DI
  injector. Cart drawer would be 12 separate instances.
- ➖ Larger total bundle (Angular runtime not deduped across WCs).
- ➖ Per-tag custom routing is fiddly (the URL bar belongs to the host).

We adopt Web Components **in addition** for the "drop one app into a
non-Angular page" scenario (ADR-0012), but not as the portal's
embedding technique.

### Option 4 — iframes

- ➕ True sandbox.
- ➖ Breaks shared cart, shared CSS, shared fonts. Defeats the goal.

## Shared state contract

The portal owns these singletons. Sub-apps MUST consume them via
`inject(TOKEN)` and MUST NOT `providedIn: 'root'` them:

- `ShopCartService` — shared across every shop loaded through the
  portal. Standalone mode falls back to a per-app instance.
- `AUTH_CONTEXT` — single sign-in across library + school-journal +
  any future role-bearing app.
- (Future) `MatTheme` — Material design tokens hoisted to portal scope
  to avoid palette drift between sub-apps.

A custom ESLint rule (or code-review-only check) blocks sub-apps from
`providedIn: 'root'`-ing any of the above. See Phase 3 of the
consolidated roadmap plan for the enforcement work.

## Implementation plan

PR-sized bullets, mirroring Phase 3 of
`docs/ai-workflow/plans/2026-05-18-portal-elements-keycloak.md`.

- [ ] Install `@angular-architects/native-federation`; scaffold
      `apps/portal` (port 4200) + host config.
- [ ] Scaffold `libs/portal-shell` (toolbar + sidenav + nav + error
      boundary).
- [ ] `federation.config.ts` for every existing app exposing
      `AppComponent` + `APP_ROUTES`.
- [ ] Portal routing — register all 12 remotes, lazy-load via
      `loadRemoteModule()`.
- [ ] Hoist `ShopCartService` + `AUTH_CONTEXT` to portal scope.
- [ ] `start:portal` + extend `start:all` to include portal +
      dashboard.
- [ ] Playwright E2E — portal boots, opens 3 MFEs, asserts hallmark UI
      per remote.

## References

- plan: docs/ai-workflow/plans/2026-05-18-portal-elements-keycloak.md
- rules: .ai/rules/nx.md, .ai/rules/angular.md
- upstream: <https://angular.dev/tools/cli/esbuild#native-federation>
- upstream: <https://www.angulararchitects.io/en/blog/native-federation-with-angular/>
- related: docs/adr/0012-app-dual-mode-web-components.md (parallel
  embedding contract for non-Angular hosts)
