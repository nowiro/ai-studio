/**
 * Web Component entry — exposes union-vault as `<ais-union-vault>`.
 * Build: `pnpm nx run union-vault:build-element` → `dist/apps/union-vault-element/main.js`.
 * Pattern documented in `docs/adr/0012-app-dual-mode-web-components.md`.
 */
import { bootstrapAsElement } from '@ai-studio/shared-app-shell';

import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

void bootstrapAsElement(AppComponent, 'ais-union-vault', appConfig);
