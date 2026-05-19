/**
 * Signal-based analytics service with an optional GA4 (`gtag`) sink.
 *
 * The service is intentionally **stub-by-default**: it never imports the real
 * GA4 SDK and never makes network calls itself. It only forwards events to a
 * `window.gtag` function if the host page already loaded one. This keeps the
 * portal/shell bundles free of third-party trackers while still letting demo
 * apps wire telemetry the way nowiro originally intended.
 *
 * Two consumer surfaces:
 *
 * - **Developers** — read the in-memory queue via `events$` to inspect what
 *   would have been sent. Useful in dev panels and Playwright assertions.
 * - **Production** — call `flush()` to drain the queue. If `window.gtag` is
 *   present each event becomes a `gtag('event', name, params)` call; otherwise
 *   the queue is logged via `console.debug` and cleared.
 *
 * Wire-up in `main.ts`:
 *
 * ```typescript
 * import { provideAnalytics } from '@ai-studio/shared-app-shell';
 *
 * bootstrapApplication(AppComponent, {
 *   providers: [provideAnalytics({ measurementId: 'G-XXXXXXX', debug: true })],
 * });
 * ```
 */
import { computed, inject, Injectable, InjectionToken, type Provider, type Signal, signal } from '@angular/core';

/**
 * Discriminated union of every analytics event the shell knows how to track.
 *
 * Adding a new event type = single new entry here. Consumers narrow via
 * `event.type` and the compiler enforces exhaustive handling in `flush()`.
 */
export type AnalyticsEvent =
  | { type: 'page_view'; appId: string; route: string }
  | { type: 'cart_checkout'; appId: string; totalGrosze: number; itemCount: number }
  | { type: 'wizard_completed'; appId: string; durationMs: number; stepCount: number }
  | { type: 'auth_login'; appId: string; role: string };

/**
 * Options consumed by {@link provideAnalytics}.
 *
 * - `measurementId` — GA4 measurement id (e.g. `G-XXXXXXX`). Only used in log
 *   messages; the service never configures gtag itself.
 * - `debug` — when `true`, `flush()` always logs the queue via `console.debug`,
 *   even if `window.gtag` is present.
 */
export interface AnalyticsOptions {
  measurementId?: string;
  debug?: boolean;
}

/** DI token holding the runtime options. Internal — consumers use the provider. */
export const ANALYTICS_OPTIONS = new InjectionToken<AnalyticsOptions>('AnalyticsOptions', {
  providedIn: 'root',
  factory: () => ({}),
});

/** Minimal shape of `window.gtag` used by this service — narrower than the GA4 typings. */
type GtagFn = (command: 'event', eventName: string, params: Record<string, unknown>) => void;

interface GtagWindow {
  gtag?: GtagFn;
}

/**
 * Signal-based analytics queue with an optional GA4 sink.
 *
 * The internal `#events` signal is the source of truth; `events$` is a
 * read-only computed wrapper so callers cannot mutate it. `flush()` drains
 * the queue and dispatches to `window.gtag` if available.
 */
@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  readonly #options = inject(ANALYTICS_OPTIONS);
  readonly #events = signal<readonly AnalyticsEvent[]>([]);
  #warnedMissingGtag = false;

  /** Read-only view of the queued events, newest last. */
  readonly events$: Signal<readonly AnalyticsEvent[]> = computed(() => this.#events());

  /** Push a typed event onto the queue. Does not flush. */
  track(event: AnalyticsEvent): void {
    this.#events.update((prev) => [...prev, event]);
  }

  /** Empty the queue. Used by tests and after a successful flush. */
  clear(): void {
    this.#events.set([]);
  }

  /**
   * Drain the queue.
   *
   * - If `window.gtag` exists, each event becomes one `gtag('event', name, params)` call.
   * - If it does not exist, the queue is logged via `console.debug` (once-warning
   *   for developers) and discarded.
   * - When `options.debug` is true, the queue is always also logged.
   */
  flush(): void {
    const queue = this.#events();
    if (queue.length === 0) return;

    const gtag = resolveGtag();
    if (gtag) {
      for (const event of queue) {
        gtag('event', event.type, eventParams(event));
      }
      if (this.#options.debug) {
        // eslint-disable-next-line no-console
        console.debug('[analytics] flushed', queue.length, 'events to gtag', queue);
      }
    } else {
      if (!this.#warnedMissingGtag) {
        // eslint-disable-next-line no-console
        console.debug(
          '[analytics] window.gtag not present — events dropped. ' +
            'Load gtag.js or omit provideAnalytics() in this environment.',
          { measurementId: this.#options.measurementId },
        );
        this.#warnedMissingGtag = true;
      }
      // eslint-disable-next-line no-console
      console.debug('[analytics] queued (no sink)', queue);
    }
    this.clear();
  }
}

/**
 * DI provider for {@link AnalyticsService}.
 *
 * Even though the service is `providedIn: 'root'`, this provider wires the
 * options token so apps can pass a measurement id / debug flag without having
 * to provide the token themselves.
 *
 * @param opts Optional measurement id + debug toggle.
 * @returns Providers wiring `ANALYTICS_OPTIONS`.
 */
export function provideAnalytics(opts: AnalyticsOptions = {}): Provider {
  return { provide: ANALYTICS_OPTIONS, useValue: opts };
}

/** Exhaustive event → params projection. Compiler-checked via `never` default. */
function eventParams(event: AnalyticsEvent): Record<string, unknown> {
  switch (event.type) {
    case 'page_view':
      return { app_id: event.appId, route: event.route };
    case 'cart_checkout':
      return { app_id: event.appId, value: event.totalGrosze / 100, items: event.itemCount, currency: 'PLN' };
    case 'wizard_completed':
      return { app_id: event.appId, duration_ms: event.durationMs, step_count: event.stepCount };
    case 'auth_login':
      return { app_id: event.appId, role: event.role };
    default: {
      const exhaustive: never = event;
      return exhaustive;
    }
  }
}

/** Reads `window.gtag` if running in a browser-like environment. */
function resolveGtag(): GtagFn | null {
  if (typeof window === 'undefined') return null;
  const candidate = (window as GtagWindow).gtag;
  return typeof candidate === 'function' ? candidate : null;
}
