/**
 * Dashboard Web Component entry — `<ais-dashboard>`.
 * Built via `pnpm nx run dashboard:build-element` → `dist/apps/dashboard-element/`.
 * Loaded by the portal's `RemoteHostComponent` (per ADR-0009).
 */
import { bootstrapAsElement } from '@ai-studio/shared-app-shell';

import { AppComponent } from './app/app.component.js';

void bootstrapAsElement(AppComponent, 'ais-dashboard');
