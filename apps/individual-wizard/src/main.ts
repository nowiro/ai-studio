import { provideRouter, withComponentInputBinding } from '@angular/router';

import { bootstrapApp } from '@ai-studio/shared-app-shell';

import { AppComponent } from './app/app.component.js';
import { APP_ROUTES } from './app/app.routes.js';

// Angular 21 / Material 3 — the legacy `provideAnimations()` was deprecated in 20.2
// in favour of the `animate.enter` / `animate.leave` directives. Material components
// no longer require a global animations provider.
bootstrapApp(AppComponent, {
  providers: [provideRouter(APP_ROUTES, withComponentInputBinding())],
});
