/**
 * Web Component (Custom Element) entry — exposes the entire business-wizard
 * as `<ais-business-wizard></ais-business-wizard>` for embedding into any
 * host page (Angular, React, plain HTML, WordPress, …).
 *
 * Build:
 *
 * ```bash
 * pnpm nx run business-wizard:build-element
 * # → dist/apps/business-wizard-element/main.js + assets
 * ```
 *
 * Host page integration:
 *
 * ```html
 * <link
 *   href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap"
 *   rel="stylesheet"
 * />
 * <link
 *   href="https://fonts.googleapis.com/icon?family=Material+Icons"
 *   rel="stylesheet"
 * />
 * <link
 *   rel="stylesheet"
 *   href="./business-wizard-element/styles.css"
 * />
 * <script
 *   type="module"
 *   src="./business-wizard-element/main.js"
 * ></script>
 * <ais-business-wizard></ais-business-wizard>
 * ```
 *
 * The custom element bootstraps the same `AppComponent` + `APP_ROUTES` as
 * the standalone build — only the entry differs. See
 * `docs/adr/0012-app-dual-mode-web-components.md` for the design.
 *
 * Note: hosting apps that opt into this Web Component must install
 * `@angular/elements` (peer-style — see `bootstrapAsElement()` JSDoc in
 * `libs/shared-app-shell`).
 */
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { bootstrapAsElement } from '@ai-studio/shared-app-shell';

import { AppComponent } from './app/app.component.js';
import { APP_ROUTES } from './app/app.routes.js';

void bootstrapAsElement(AppComponent, 'ais-business-wizard', {
  providers: [provideRouter(APP_ROUTES, withComponentInputBinding()), provideHttpClient(withFetch())],
});
