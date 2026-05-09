import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { AppComponent } from './app/app.component.js';
import { APP_ROUTES } from './app/app.routes.js';

// Pong relies on Phaser's render loop, not Angular animations — no provider needed.
bootstrapApplication(AppComponent, {
  providers: [provideRouter(APP_ROUTES)],
}).catch((error: unknown) => {
  // eslint-disable-next-line no-console
  console.error('Bootstrap failed', error);
});
