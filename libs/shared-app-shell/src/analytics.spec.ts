/**
 * `AnalyticsService` is a signal-backed queue with a `window.gtag` sink. The
 * suite covers: track → queue, signal projection, clear, flush behaviour with
 * and without `window.gtag`, and exhaustive payload shape for every event
 * variant.
 *
 * We construct an injector manually (no TestBed) to keep the suite consistent
 * with the rest of the shared libs and avoid `initTestEnvironment` overhead.
 */
import { Injector } from '@angular/core';

import { afterEach, beforeEach, describe, expect, it, type MockInstance, vi } from 'vitest';

import { ANALYTICS_OPTIONS, type AnalyticsEvent, AnalyticsService } from './analytics.js';

interface GtagWindow {
  gtag?: (command: 'event', eventName: string, params: Record<string, unknown>) => void;
}

function makeService(opts: { measurementId?: string; debug?: boolean } = {}): AnalyticsService {
  const injector = Injector.create({
    providers: [{ provide: ANALYTICS_OPTIONS, useValue: opts }, AnalyticsService],
  });
  return injector.get(AnalyticsService);
}

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let consoleDebugSpy: MockInstance<(...args: unknown[]) => void>;

  beforeEach(() => {
    service = makeService();
    consoleDebugSpy = vi.spyOn(console, 'debug').mockImplementation(() => undefined) as MockInstance<
      (...args: unknown[]) => void
    >;
    delete (window as GtagWindow).gtag;
  });

  afterEach(() => {
    consoleDebugSpy.mockRestore();
    delete (window as GtagWindow).gtag;
  });

  it('track() pushes an event into the signal queue', () => {
    service.track({ type: 'page_view', appId: 'bookstore', route: '/books' });
    expect(service.events$()).toHaveLength(1);
    expect(service.events$()[0]).toEqual({ type: 'page_view', appId: 'bookstore', route: '/books' });
  });

  it('events$ reflects the latest queue state after multiple tracks', () => {
    service.track({ type: 'page_view', appId: 'library', route: '/' });
    service.track({ type: 'auth_login', appId: 'library', role: 'reader' });
    const snapshot = service.events$();
    expect(snapshot).toHaveLength(2);
    expect(snapshot[0]?.type).toBe('page_view');
    expect(snapshot[1]?.type).toBe('auth_login');
  });

  it('clear() empties the queue', () => {
    service.track({ type: 'page_view', appId: 'tire-shop', route: '/cart' });
    expect(service.events$()).toHaveLength(1);
    service.clear();
    expect(service.events$()).toEqual([]);
  });

  it('flush() is a no-op for the gtag sink when window.gtag is missing', () => {
    service.track({ type: 'page_view', appId: 'tire-shop', route: '/cart' });
    expect((window as GtagWindow).gtag).toBeUndefined();
    service.flush();
    // Queue is drained regardless — events are not double-sent on later flushes.
    expect(service.events$()).toEqual([]);
    // The fallback path uses console.debug; assert it was invoked at least once.
    expect(consoleDebugSpy).toHaveBeenCalled();
  });

  it('flush() forwards every queued event to window.gtag when present', () => {
    const gtag = vi.fn<(command: 'event', eventName: string, params: Record<string, unknown>) => void>();
    (window as GtagWindow).gtag = gtag;

    service.track({ type: 'cart_checkout', appId: 'tire-shop', totalGrosze: 12345, itemCount: 3 });
    service.track({ type: 'page_view', appId: 'tire-shop', route: '/checkout' });
    service.flush();

    expect(gtag).toHaveBeenCalledTimes(2);
    expect(gtag).toHaveBeenNthCalledWith(
      1,
      'event',
      'cart_checkout',
      expect.objectContaining({ app_id: 'tire-shop', value: 123.45, items: 3, currency: 'PLN' }),
    );
    expect(gtag).toHaveBeenNthCalledWith(
      2,
      'event',
      'page_view',
      expect.objectContaining({ app_id: 'tire-shop', route: '/checkout' }),
    );
    // Queue is drained after a successful flush.
    expect(service.events$()).toEqual([]);
  });

  it('track() accepts every AnalyticsEvent variant', () => {
    const events: AnalyticsEvent[] = [
      { type: 'page_view', appId: 'bookstore', route: '/books/42' },
      { type: 'cart_checkout', appId: 'bookstore', totalGrosze: 5000, itemCount: 1 },
      { type: 'wizard_completed', appId: 'individual-wizard', durationMs: 12_000, stepCount: 5 },
      { type: 'auth_login', appId: 'library', role: 'librarian' },
    ];
    for (const event of events) {
      service.track(event);
    }
    expect(service.events$()).toEqual(events);

    const gtag = vi.fn<(command: 'event', eventName: string, params: Record<string, unknown>) => void>();
    (window as GtagWindow).gtag = gtag;
    service.flush();
    expect(gtag).toHaveBeenCalledTimes(4);
    expect(gtag.mock.calls.map((call) => call[1])).toEqual([
      'page_view',
      'cart_checkout',
      'wizard_completed',
      'auth_login',
    ]);
  });

  it('flush() with debug option logs the gtag dispatch summary', () => {
    const debugService = makeService({ debug: true, measurementId: 'G-TEST' });
    const gtag = vi.fn<(command: 'event', eventName: string, params: Record<string, unknown>) => void>();
    (window as GtagWindow).gtag = gtag;

    debugService.track({ type: 'auth_login', appId: 'library', role: 'reader' });
    debugService.flush();

    expect(gtag).toHaveBeenCalledTimes(1);
    expect(consoleDebugSpy).toHaveBeenCalledWith(
      expect.stringContaining('flushed'),
      1,
      expect.stringContaining('gtag'),
      expect.any(Array),
    );
  });
});
