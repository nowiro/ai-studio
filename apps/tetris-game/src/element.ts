/**
 * Web Component entry — exposes the Tetris game as `<ais-tetris-game>`.
 *
 * Note: Phaser's render loop manages its own canvas inside the wrapped
 * component. The custom element only owns the boundary; resize events are
 * propagated to the canvas via the component's ResizeObserver.
 *
 * Pattern documented in `docs/adr/0012-app-dual-mode-web-components.md`.
 */
import { provideRouter } from '@angular/router';

import { bootstrapAsElement } from '@ai-studio/shared-app-shell';

import { AppComponent } from './app/app.component.js';
import { APP_ROUTES } from './app/app.routes.js';

void bootstrapAsElement(AppComponent, 'ais-tetris-game', {
  providers: [provideRouter(APP_ROUTES)],
});
