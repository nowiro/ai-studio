import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { bootstrapApp } from '@ai-studio/shared-app-shell';

import { AppComponent } from './app/app.component.js';
import { APP_ROUTES } from './app/app.routes.js';

bootstrapApp(AppComponent, {
  providers: [provideRouter(APP_ROUTES, withComponentInputBinding()), provideHttpClient(withFetch())],
});
