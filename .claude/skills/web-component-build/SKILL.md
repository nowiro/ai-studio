---
name: web-component-build
description: |
  Patterns for exposing AI Studio Angular apps as standalone Web Components via `@angular/elements`.
  Use whenever an app needs a `build-element` target, whenever you embed an Angular app on a
  host page outside Angular (CMS, legacy app, marketing page), or when you debug shadow-DOM
  CSS inheritance. Covers `createCustomElement`, the per-app `build-element` target in
  `project.json`, ESM bundle conventions, host-page embed snippets, shadow-DOM caveats with
  Material 3, and the input/output mapping. Linked to ADR-0012 (canonical decision).
---

# Web Component build patterns (AI Studio)

> Reach for this skill whenever an app needs to ship as a custom element (`<ais-app>`) embeddable
> outside Angular. Every demo app in `apps/*` exposes a `build-element` target — see ADR-0012
> for the architectural decision.
>
> Stack: `@angular/elements@^21`, `@angular/build:browser-esbuild` executor with the
> `customElements: true` option, ESM bundle output. Host pages embed via `<script type="module">`.

## 1. Decision — when an app needs `build-element`

Every demo app gets a dual-mode build:

| Target          | Output                                          | Use case                               |
| --------------- | ----------------------------------------------- | -------------------------------------- |
| `build`         | Full SPA shell (`index.html` + chunks)          | `pnpm start:<app>` — standalone dev    |
| `build-element` | Single ESM `<app>-element.js` (no `index.html`) | Embedded as `<ais-app>` on a host page |
| `serve`         | Dev server for the SPA mode                     | Local dev                              |
| `test` / `e2e`  | Unit + E2E suites                               | CI                                     |

Build all elements at once:

```bash
pnpm build:all-elements
# runs: nx run-many -t build-element --parallel=4
```

## 2. `project.json` — the `build-element` target

```jsonc
// apps/business-wizard/project.json (excerpt)
{
  "targets": {
    "build-element": {
      "executor": "@angular/build:application",
      "options": {
        "browser": "apps/business-wizard/src/element.ts",
        "outputPath": "dist/elements/business-wizard",
        "tsConfig": "apps/business-wizard/tsconfig.element.json",
        "polyfills": ["zone.js", "apps/business-wizard/src/polyfills-element.ts"],
        "styles": ["styles/tailwind.scss", "apps/business-wizard/src/styles-element.scss"],
        "outputHashing": "none",
        "optimization": true,
        "sourceMap": false,
        "extractLicenses": true,
        "namedChunkFiles": false,
      },
    },
  },
}
```

`outputHashing: "none"` so the host can reference a stable filename
(`<app>-element.js`). Hash via the host's deployment pipeline if needed.

## 3. Element entry — `element.ts`

```ts
// apps/business-wizard/src/element.ts
import { provideHttpClient, withFetch } from '@angular/common/http';
import { createCustomElement } from '@angular/elements';
import { createApplication } from '@angular/platform-browser';
import { provideRouter, withHashLocation } from '@angular/router';

import 'zone.js';

import { BusinessWizardElementComponent } from './app/business-wizard-element.component';
import { WIZARD_ROUTES } from './app/wizard.routes';

(async () => {
  const app = await createApplication({
    providers: [provideHttpClient(withFetch()), provideRouter(WIZARD_ROUTES, withHashLocation())],
  });

  const element = createCustomElement(BusinessWizardElementComponent, {
    injector: app.injector,
  });

  customElements.define('ais-business-wizard', element);
})();
```

Key choices:

- **`createApplication`** (not `bootstrapApplication`) — gives us the `Injector` to pass to
  `createCustomElement`.
- **`withHashLocation`** — the host owns `pushState`. Hash routing avoids fighting the host.
- **One `customElements.define` call** — the host page tag is `<ais-business-wizard>`.

## 4. The component — Web Component bridge

```ts
// apps/business-wizard/src/app/business-wizard-element.component.ts
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'ais-business-wizard-element',
  standalone: true,
  imports: [RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <router-outlet />
  `,
  styleUrl: './business-wizard-element.component.scss',
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class BusinessWizardElementComponent {
  // Inputs become element attributes / props
  readonly locale = input<'pl' | 'en'>('pl');
  readonly theme = input<'light' | 'dark'>('light');

  // Outputs become element CustomEvents
  readonly submitted = output<{ payload: unknown }>();
  readonly cancelled = output<void>();
}
```

Mappings (Angular Elements does these automatically):

| Angular side          | Host page side                                                         |
| --------------------- | ---------------------------------------------------------------------- |
| `input('locale')`     | `<ais-business-wizard locale="en">` or `el.locale = 'en'`              |
| `output('submitted')` | `el.addEventListener('submitted', e => ...)` (`e.detail` is the value) |
| Component CSS         | Encapsulated to shadow DOM                                             |

## 5. Host page embed

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Host</title>
  </head>
  <body>
    <ais-business-wizard
      locale="pl"
      theme="light"
    ></ais-business-wizard>

    <script
      type="module"
      src="https://cdn.example.com/business-wizard-element.js"
    ></script>
    <script>
      const el = document.querySelector('ais-business-wizard');
      el.addEventListener('submitted', (e) => console.log('payload', e.detail));
      el.addEventListener('cancelled', () => console.log('user cancelled'));
    </script>
  </body>
</html>
```

The host only needs the ESM bundle URL — no Angular knowledge required. The bundle self-registers
the element on load.

## 6. Shadow DOM — Material 3 caveats

Angular Material 3 renders some primitives (snackbar, dialog, tooltip) into the **document
body**, not the component tree. With `ViewEncapsulation.ShadowDom` these escape the shadow
boundary and lose your theme tokens.

Two workarounds:

1. **Set `OverlayContainer` to the shadow root** (preferred):

```ts
import { OverlayContainer } from '@angular/cdk/overlay';
import { ElementRef, inject, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ShadowOverlayContainer extends OverlayContainer {
  private readonly host = inject(ElementRef<HTMLElement>);
  protected override _createContainer(): void {
    const container = document.createElement('div');
    container.classList.add('cdk-overlay-container');
    this.host.nativeElement.shadowRoot?.appendChild(container);
    this._containerElement = container;
  }
}
```

Provide in `createApplication`:

```ts
providers: [
  { provide: OverlayContainer, useClass: ShadowOverlayContainer },
  ...,
]
```

2. **Use `ViewEncapsulation.None`** — give up encapsulation entirely. Host page styles leak in;
   your styles leak out. Acceptable when the host owns no styles for those tags.

ADR-0012 picks **option 1** as the default.

## 7. Styles entry — `styles-element.scss`

```scss
// apps/business-wizard/src/styles-element.scss
@use '@angular/material' as mat;

:host {
  display: block;
  color-scheme: light;

  @include mat.theme(
    (
      color: (
        primary: mat.$azure-palette,
        tertiary: mat.$rose-palette,
      ),
      typography: Roboto,
      density: -2,
    )
  );
}
```

The `:host` selector targets the shadow root. Theme tokens are scoped to the element — multiple
instances on a page can have different themes.

## 8. `tsconfig.element.json`

```jsonc
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "../../dist/out-tsc/business-wizard-element",
    "types": ["node"],
  },
  "files": ["src/element.ts"],
  "include": ["src/**/*.ts"],
}
```

Note `"files"` (not `"main"`) — Angular's application builder uses the value from `project.json`,
not tsconfig.

## 9. Build & local verify

```bash
# Build only this app's element
pnpm nx run business-wizard:build-element

# Serve a static host page that embeds the element
pnpm exec http-server dist/elements/business-wizard -p 5500
# Open the host HTML you authored

# Build all elements
pnpm build:all-elements
```

## 10. Bundle hygiene

- Output is a **single** ESM file (no code splitting). The host doesn't know about chunks.
- No `index.html`, no service worker, no PWA manifest.
- `zone.js` ships inside the bundle (host page may already have Angular — that's fine,
  custom elements don't conflict on the global `Zone` for same-version peers).
- `<link rel="stylesheet">` outputs are inlined into the bundle via `styles-element.scss`.

## 11. Anti-patterns

- Importing the SPA's `main.ts` from `element.ts` — they're separate entry points by design.
- `bootstrapApplication` in `element.ts`. Use `createApplication` so you can pass the injector
  to `createCustomElement`.
- `provideRouter(...)` without `withHashLocation()` — fighting the host on `pushState`.
- `ViewEncapsulation.Emulated` for the element root — shadows are the contract.
- Forgetting to scope `mat.theme(...)` to `:host` — every element on the page gets the same theme.
- Naming inputs/outputs with hyphens (`my-attr`). Angular Elements converts camelCase to
  kebab-case automatically.
- Building with `outputHashing: "all"` — host references break on every deploy.

## 12. Quick element-author checklist

Before reporting done:

- [ ] App has a `build-element` target in `project.json`?
- [ ] `src/element.ts` calls `createApplication` + `createCustomElement` + `customElements.define`?
- [ ] Component uses `ViewEncapsulation.ShadowDom`?
- [ ] Material overlay container redirected to shadow root?
- [ ] `styles-element.scss` scopes `mat.theme(...)` to `:host`?
- [ ] `outputHashing: "none"` so filename is stable?
- [ ] Inputs use `input()` (Angular 21 signal API)?
- [ ] Outputs use `output()` and emit `CustomEvent` semantics?
- [ ] Host page embed verified locally?
- [ ] Bundle < 250 KB gzip (or budgeted exception documented)?

## 13. When to reach for Federation instead

If the host **is itself an Angular app** and you want to share dependencies (`@angular/core`,
`rxjs`, `@angular/material`), use Native Federation rather than `@angular/elements`. See
[`microfrontend-orchestration`](../microfrontend-orchestration/SKILL.md) and ADR-0009.

Web Components win when:

- Host is not Angular (or unknown).
- You want one bundle that ships everything (no shared peers).
- Element instances need independent theming.

Federation wins when:

- Host is Angular and dependency duplication matters.
- You ship many small "remotes" that share a runtime.

---

_Reference: `apps/business-wizard` has the canonical `build-element` target. All 12 demo apps
will mirror the pattern as ADR-0012 rolls out — see `pnpm build:all-elements`._
