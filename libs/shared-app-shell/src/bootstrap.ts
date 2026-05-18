/**
 * Tiny wrapper around `bootstrapApplication` that centralises the standard
 * "log + crash visibly" error handler. Both apps in this repo previously
 * inlined the same `.catch((error) => console.error('Bootstrap failed', error))`
 * with a per-call `eslint-disable no-console` comment — we now do it once here.
 *
 * The console.error is intentional and the only place in the codebase where
 * `no-console` is bypassed: an Angular bootstrap failure means the app never
 * mounted, so there is no LoggerService to route through yet.
 */
import type { ApplicationConfig, Type } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';

/**
 * Bootstrap an Angular app's root component with the standard repo-wide error
 * handler. The promise is intentionally consumed (errors logged to console)
 * because there is nothing else to do — if bootstrap fails, the page is blank
 * and the user needs to see the error in DevTools.
 *
 * @param root  Standalone root component (typically `AppComponent`).
 * @param config Optional providers — pass `provideRouter(ROUTES)` etc. here.
 */
export function bootstrapApp(root: Type<unknown>, config?: ApplicationConfig): void {
  bootstrapApplication(root, config).catch((error: unknown) => {
    // eslint-disable-next-line no-console
    console.error('Bootstrap failed', error);
  });
}
