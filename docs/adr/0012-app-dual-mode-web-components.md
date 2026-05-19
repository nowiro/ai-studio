# 0012 — App dual-mode embedding via Web Components

- Status: accepted (2026-05-19, after /clarify)
- Date: 2026-05-18
- Decision-makers: orchestrator, architect
- Consulted: frontend-developer
- Informed: every app maintainer

## Context and problem statement

Each app in the monorepo currently exists in two modes:

1. **Standalone SPA** — `pnpm start:<app>` serves the app on its
   dedicated port.
2. **Federated remote** — Phase 3 of the consolidated roadmap (ADR-0009)
   exposes each app as a Native Federation remote loaded by the portal.

A third use-case showed up during planning: a non-Angular host page
(WordPress, plain HTML, a React landing site) wants to embed one of
our demos. Native Federation assumes the host is also an Angular app
that can call `loadRemoteModule()` — that contract doesn't apply.

How do we let an arbitrary host page drop in a single app without
inheriting our build toolchain?

## Decision drivers

- **Single tag drop-in** — host page integrates with one line:
  `<ais-tire-shop></ais-tire-shop>` + `<script type="module">`.
- **No Angular toolchain in the host** — the host page can be plain
  HTML.
- **Independently versioned** — each app's WC bundle is its own
  shippable artefact.
- **Don't bloat standalone bundles** — apps that never call
  `bootstrapAsElement()` must pay zero bundle cost for the WC path.

## Considered options

1. **`@angular/elements` + `createCustomElement()`** — Angular's
   official path. Each app gains an `element.ts` entry + `build:element`
   target.
2. **Manual Custom Element wrapper** — register an element class that
   bootstraps the Angular app on `connectedCallback`.
3. **Stencil rewrite** — re-implement each app as a Stencil
   component. Heaviest option; loses the Angular DX.
4. **iframes** — host page `<iframe src="…">` the standalone bundle.
   Defeats the "look like a real custom element" goal.

## Decision outcome

Chosen option **1 — `@angular/elements`**.

A new helper, `bootstrapAsElement()`, lives in `libs/shared-app-shell`
and is invoked from each app's `element.ts`:

```ts
// apps/tire-shop/src/element.ts
import { bootstrapAsElement } from '@ai-studio/shared-app-shell';

import { AppComponent } from './app/app.component.js';
import { APP_ROUTES } from './app/app.routes.js';

void bootstrapAsElement(AppComponent, 'ais-tire-shop', {
  providers: [provideRouter(APP_ROUTES, withComponentInputBinding())],
});
```

The `build:element` Nx target produces a single ESM bundle that the
host page loads via `<script type="module" src="./tire-shop.js">`. The
helper dynamic-imports `@angular/elements` so standalone bundles
(which never call it) pay zero cost.

### Consequences

- ➕ Every app gains a third entry point with one new file per app.
  `AppComponent` is reused unchanged.
- ➕ Host pages stay non-Angular. The custom element is a black box
  with a stable tag + attribute contract.
- ➕ Apps can be versioned + deployed independently as ESM bundles
  served from a CDN.
- ➖ Each `<ais-<app>>` includes the Angular runtime (~200 KB
  gzipped); two WCs on the same host page ship Angular twice. We do
  NOT solve dedup at the WC layer — it's not what WCs are for. For
  multi-app-on-one-page, use the portal (ADR-0009) instead.
- ➖ Routing inside a WC works (Angular Router operates on a virtual
  URL) but the host page's URL bar is unaware of the navigation.
  Documented per app's `technical.md` "Web Component embedding"
  section.
- ➖ Material's font-family declarations rely on `<link rel="stylesheet">`
  in the host page's `<head>`. The WC bundle includes a comment
  reminding integrators to add it.

## Pros and cons of the options

### Option 1 — `@angular/elements` (chosen)

- ➕ Official path; minimal new code per app.
- ➕ Standalone bundles stay unaffected (dynamic import).
- ➖ Per-WC Angular runtime cost.

### Option 2 — Manual Custom Element wrapper

- ➕ No dependency on `@angular/elements`.
- ➖ Re-implements what `createCustomElement()` already does. NIH.

### Option 3 — Stencil rewrite

- ➕ Smallest WC bundles (~50 KB).
- ➖ Two frameworks in the same repo. Doubles maintenance.

### Option 4 — iframes

- ➕ Zero re-engineering.
- ➖ No shared DOM, no shared CSS, no shared cart. Defeats the goal.

## API contract

Every app's WC follows:

- **Tag name** — `ais-<app-slug>` (e.g. `ais-tire-shop`,
  `ais-bookstore`, `ais-pong-game`). The `ais-` prefix matches the
  repo's component selector prefix.
- **Attributes** — apps that accept config (locale, theme, initial
  route) expose them as kebab-case HTML attributes. The contract is
  documented in each app's `technical.md`.
- **Events** — apps that emit external signals (e.g. cart-changed)
  do so via `CustomEvent` — never via `output()`, because the host
  isn't Angular.
- **Style isolation** — Material font-face declarations are
  documented as a host-page responsibility. Each app's `element.ts`
  includes a top-of-file comment with the `<link>` snippet.

## Implementation plan

PR-sized bullets, mirroring Phase 1 of the consolidated roadmap.

- [x] Install `@angular/elements`; add `bootstrapAsElement()` helper to
      `libs/shared-app-shell` — **landed in this turn**.
- [ ] Add `element.ts` entry + `build:element` Nx target to one pilot
      app (`apps/pong-game`).
- [ ] Replicate across all 11 apps.
- [ ] Static demo page in `docs/projects/elements-demo/index.html`
      showing 4 custom elements side-by-side.
- [ ] E2E: Playwright loads the demo page and asserts each custom
      element mounted.
- [ ] Per-app `technical.md` gets a "Web Component embedding" section.

## References

- plan: docs/ai-workflow/plans/2026-05-18-portal-elements-keycloak.md
- helper: libs/shared-app-shell/src/element-bootstrap.ts
- rules: .ai/rules/angular.md
- upstream: <https://angular.dev/guide/elements>
- related: docs/adr/0009-microfrontend-architecture.md (the portal
  path, used when the host page is itself Angular)
