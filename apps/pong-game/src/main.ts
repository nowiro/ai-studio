import { provideRouter } from '@angular/router';

import { bootstrapApp } from '@ai-studio/shared-app-shell';

import { AppComponent } from './app/app.component.js';
import { APP_ROUTES } from './app/app.routes.js';

// Pong relies on Phaser's render loop, not Angular animations — no provider needed.
bootstrapApp(AppComponent, {
  providers: [provideRouter(APP_ROUTES)],
});
