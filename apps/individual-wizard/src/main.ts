import { provideRouter, withComponentInputBinding } from '@angular/router';

import { IndividualFormFillStrategy } from '@ai-studio/individual-wizard-data';
import { bootstrapApp } from '@ai-studio/shared-app-shell';
import { FORM_FILL_STRATEGY } from '@ai-studio/wizard-form-fill';

import { AppComponent } from './app/app.component.js';
import { APP_ROUTES } from './app/app.routes.js';

// Angular 21 / Material 3 — the legacy `provideAnimations()` was deprecated in 20.2
// in favour of the `animate.enter` / `animate.leave` directives. Material components
// no longer require a global animations provider.
//
// FORM_FILL_STRATEGY wires the dev-tools FAB (from `@ai-studio/wizard-form-fill`)
// into the individual-wizard's form shape — see ADR-0011 §wrap before consume.
bootstrapApp(AppComponent, {
  providers: [
    provideRouter(APP_ROUTES, withComponentInputBinding()),
    { provide: FORM_FILL_STRATEGY, useExisting: IndividualFormFillStrategy },
  ],
});
