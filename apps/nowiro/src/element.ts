/**
 * Web Component entry — exposes the nowiro landing as `<ais-nowiro>`.
 * Build: `pnpm nx run nowiro:build-element` → `dist/apps/nowiro-element/main.js`.
 * Pattern documented in `docs/adr/0012-app-dual-mode-web-components.md`.
 */
import { bootstrapAsElement } from '@ai-studio/shared-app-shell';

import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

void bootstrapAsElement(AppComponent, 'ais-nowiro', appConfig);
