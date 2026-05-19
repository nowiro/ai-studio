/**
 * Web Component (Custom Element) bootstrap for the dual-mode app contract.
 *
 * Each app in the monorepo can be consumed three ways without code changes:
 *
 * 1. **Standalone SPA** — `main.ts` calls `bootstrapApp(AppComponent, …)`
 *    (existing behaviour, unchanged).
 * 2. **Web Component** — `element.ts` calls `bootstrapAsElement(AppComponent,
 *    'ais-<app>', …)` to expose the app as a `<custom-element>`.
 * 3. **Federated remote** — `bootstrap.ts` exposes `AppComponent` +
 *    `APP_ROUTES` via Native Federation (added in Phase 3 of the consolidated
 *    roadmap).
 *
 * The same `AppComponent` mounts in all three modes — only the entry point
 * differs.
 *
 * Pattern documented in `docs/adr/0012-app-dual-mode-web-components.md`.
 *
 * @packageDocumentation
 */
import type { ApplicationConfig, Injector, Type } from '@angular/core';
import { createApplication } from '@angular/platform-browser';

/**
 * Minimal shape of the `@angular/elements` module — we declare the surface
 * we consume here so the helper can compile without the package being
 * installed in the workspace root. Apps that actually call this helper MUST
 * add `@angular/elements` as a per-app runtime dep
 * (`pnpm add \@angular/elements --filter=apps/<app>`). Phase 1 of the
 * consolidated roadmap promotes the dep to the root once every app exposes
 * a Web Component build.
 */
interface AngularElementsModule {
  createCustomElement(component: Type<unknown>, config: { injector: Injector }): CustomElementConstructor;
}

/**
 * Bootstrap an Angular component as a Web Component (Custom Element) on the
 * host page. Returns a promise that resolves once `customElements.define()`
 * has registered the tag.
 *
 * ## Usage
 *
 * In `apps/<app>/src/element.ts`:
 *
 * ```ts
 * import { provideHttpClient, withFetch } from '@angular/common/http';
 * import { provideRouter, withComponentInputBinding } from '@angular/router';
 * import { bootstrapAsElement } from '@ai-studio/shared-app-shell';
 * import { AppComponent } from './app/app.component.js';
 * import { APP_ROUTES } from './app/app.routes.js';
 *
 * void bootstrapAsElement(AppComponent, 'ais-tire-shop', {
 *   providers: [
 *     provideRouter(APP_ROUTES, withComponentInputBinding()),
 *     provideHttpClient(withFetch()),
 *   ],
 * });
 * ```
 *
 * Host page:
 *
 * ```html
 * <script type="module" src="./tire-shop.js"></script>
 * <ais-tire-shop></ais-tire-shop>
 * ```
 *
 * ## Why a separate helper
 *
 * `bootstrapApplication()` (used by the standalone mode) immediately mounts
 * the root component into `document.body`. Custom elements need to defer
 * mounting until the host page instantiates the tag. We use
 * `createApplication()` + `@angular/elements` `createCustomElement()` to
 * keep the root component dormant until then.
 *
 * The `@angular/elements` import is intentionally dynamic — the package is
 * a per-app runtime dep (see {@link AngularElementsModule} above) so apps
 * that never call `bootstrapAsElement()` don't have to install it. The
 * single shared helper means we don't duplicate the dynamic-import
 * boilerplate per app.
 *
 * @param root     Standalone root component (typically `AppComponent`).
 * @param tagName  Custom element tag — must contain a dash (e.g. `ais-tire-shop`).
 *                 Per repo convention, prefix every tag with `ais-`.
 * @param config   Optional providers (router, HttpClient, app-specific DI).
 * @returns        Resolves once the custom element is registered. Throws if
 *                 the tag is already defined or if the Angular runtime fails
 *                 to bootstrap.
 */
export async function bootstrapAsElement(
  root: Type<unknown>,
  tagName: string,
  config?: ApplicationConfig,
): Promise<void> {
  if (!tagName.includes('-')) {
    throw new Error(
      `bootstrapAsElement: tag "${tagName}" is not a valid custom element name (must contain a dash, e.g. "ais-tire-shop").`,
    );
  }
  if (customElements.get(tagName) !== undefined) {
    // Re-registering would throw a DOMException — fail loud with a clearer message.
    throw new Error(`bootstrapAsElement: custom element "${tagName}" is already defined on this page.`);
  }

  const elementsModuleSpecifier = '@angular/elements';
  const elementsModule = (await import(/* @vite-ignore */ elementsModuleSpecifier).catch(() => {
    throw new Error(
      'bootstrapAsElement: @angular/elements is not installed in this app. ' +
        'Run `pnpm add @angular/elements` in the consuming app to enable Web Component builds.',
    );
  })) as AngularElementsModule;

  const appRef = await createApplication(config);
  const element = elementsModule.createCustomElement(root, { injector: appRef.injector });
  customElements.define(tagName, element);
}
