import { provideRouter, withComponentInputBinding } from '@angular/router';

import { bootstrapApp } from '@ai-studio/shared-app-shell';

import { AppComponent } from './app/app.component.js';
import { ROUTES } from './app/app.routes.js';

bootstrapApp(AppComponent, {
  providers: [provideRouter(ROUTES, withComponentInputBinding())],
});
