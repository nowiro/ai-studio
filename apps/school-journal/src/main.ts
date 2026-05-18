import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { SessionService } from '@ai-studio/journal-data';
import { AUTH_CONTEXT, bootstrapApp } from '@ai-studio/shared-app-shell';

import { AppComponent } from './app/app.component.js';
import { APP_ROUTES } from './app/app.routes.js';

bootstrapApp(AppComponent, {
  providers: [
    provideRouter(APP_ROUTES, withComponentInputBinding()),
    provideHttpClient(withFetch()),
    // Plug the journal's SessionService into the shared role-allow + roleGuard
    // primitives. The shared lib treats `role()` opaquely; the journal keeps
    // its own typed `JournalRole` union for app-side logic.
    { provide: AUTH_CONTEXT, useExisting: SessionService },
  ],
});
