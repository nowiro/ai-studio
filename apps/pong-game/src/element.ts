/**
 * Web Component entry — exposes the Pong game as `<ais-pong-game>`.
 *
 * Note: Phaser's render loop manages its own canvas; the WC wrapper hosts
 * the canvas via the Angular component's `<canvas>` element. Resizing the
 * custom element on the host page re-runs the Phaser scale manager via
 * the wrapper component's ResizeObserver.
 *
 * Pattern documented in `docs/adr/0012-app-dual-mode-web-components.md`.
 */
import { provideRouter } from '@angular/router';

import { bootstrapAsElement } from '@ai-studio/shared-app-shell';

import { AppComponent } from './app/app.component.js';
import { APP_ROUTES } from './app/app.routes.js';

void bootstrapAsElement(AppComponent, 'ais-pong-game', {
  providers: [provideRouter(APP_ROUTES)],
});
