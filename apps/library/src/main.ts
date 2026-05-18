import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { AuthService } from '@ai-studio/library-data';
import { AUTH_CONTEXT, bootstrapApp } from '@ai-studio/shared-app-shell';

import { AppComponent } from './app/app.component.js';
import { APP_ROUTES } from './app/app.routes.js';

bootstrapApp(AppComponent, {
  providers: [
    provideRouter(APP_ROUTES, withComponentInputBinding()),
    provideHttpClient(withFetch()),
    // Plug the library's AuthService into the repo-wide role-allow + roleGuard
    // primitives. The shared lib reads `auth.role()` opaquely; we keep our own
    // typed enum on `AuthService` for app-side logic.
    { provide: AUTH_CONTEXT, useExisting: AuthService },
  ],
});
