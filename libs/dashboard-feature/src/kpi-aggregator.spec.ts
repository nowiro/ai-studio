/**
 * `KpiAggregator` rolls a stream of `MfeBus` events into a signal-based KPI
 * store. Each test pushes events through a fake bus and asserts the
 * resulting signal projection.
 *
 * We manually construct an injector (no TestBed) to stay consistent with the
 * other shared-lib specs and avoid the `initTestEnvironment` overhead. The
 * fake `MfeBus` exposes the same `events$` shape as the real service plus an
 * `emit()` helper so each test can drive the stream deterministically.
 */
import { Injector, runInInjectionContext } from '@angular/core';

import type { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';

import { MfeBus, type MfeEvent } from '@ai-studio/shared-app-shell';

import { KpiAggregator } from './kpi-aggregator.js';

class FakeMfeBus {
  private readonly subject = new Subject<MfeEvent>();
  readonly events$: Observable<MfeEvent> = this.subject.asObservable();

  emit(event: MfeEvent): void {
    this.subject.next(event);
  }
}

function makeAggregator(): { aggregator: KpiAggregator; bus: FakeMfeBus } {
  const bus = new FakeMfeBus();
  const injector = Injector.create({
    providers: [{ provide: MfeBus, useValue: bus }, KpiAggregator],
  });
  const aggregator = runInInjectionContext(injector, () => injector.get(KpiAggregator));
  return { aggregator, bus };
}

describe('KpiAggregator', () => {
  let aggregator: KpiAggregator;
  let bus: FakeMfeBus;

  beforeEach(() => {
    ({ aggregator, bus } = makeAggregator());
  });

  it('starts with an empty initial state', () => {
    const kpi = aggregator.kpi();
    expect(kpi).toEqual({
      activeApps: [],
      totalCartsValueGrosze: 0,
      activeCartCount: 0,
      loggedInUsers: 0,
      ordersToday: 0,
      lastEventAt: null,
    });
    expect(aggregator.kpiByApp()).toEqual({});
  });

  it('cart:updated increases totalCartsValueGrosze and tracks the app', () => {
    bus.emit({ type: 'cart:updated', appId: 'bookstore', itemCount: 2, totalGrosze: 5400 });

    const kpi = aggregator.kpi();
    expect(kpi.totalCartsValueGrosze).toBe(5400);
    expect(kpi.activeCartCount).toBe(1);
    expect(kpi.activeApps).toEqual(['bookstore']);
    expect(aggregator.kpiByApp()).toEqual({
      bookstore: { cartValue: 5400, cartCount: 2 },
    });
  });

  it('tracks multiple apps independently and sums the totals', () => {
    bus.emit({ type: 'cart:updated', appId: 'bookstore', itemCount: 2, totalGrosze: 5400 });
    bus.emit({ type: 'cart:updated', appId: 'tools-shop', itemCount: 1, totalGrosze: 39_900 });
    bus.emit({ type: 'cart:updated', appId: 'toy-shop', itemCount: 3, totalGrosze: 59_700 });

    const kpi = aggregator.kpi();
    expect(kpi.totalCartsValueGrosze).toBe(5400 + 39_900 + 59_700);
    expect(kpi.activeCartCount).toBe(3);
    expect(kpi.activeApps).toEqual(['bookstore', 'tools-shop', 'toy-shop']);
    expect(aggregator.kpiByApp()).toEqual({
      bookstore: { cartValue: 5400, cartCount: 2 },
      'tools-shop': { cartValue: 39_900, cartCount: 1 },
      'toy-shop': { cartValue: 59_700, cartCount: 3 },
    });
  });

  it('cart:updated replaces (does not add to) the previous snapshot for the same app', () => {
    bus.emit({ type: 'cart:updated', appId: 'bookstore', itemCount: 2, totalGrosze: 5400 });
    bus.emit({ type: 'cart:updated', appId: 'bookstore', itemCount: 5, totalGrosze: 12_000 });

    expect(aggregator.kpi().totalCartsValueGrosze).toBe(12_000);
    expect(aggregator.kpi().activeCartCount).toBe(1);
    expect(aggregator.kpiByApp()['bookstore']).toEqual({ cartValue: 12_000, cartCount: 5 });
  });

  it('cart:cleared zeroes the specific app slot and recomputes totals', () => {
    bus.emit({ type: 'cart:updated', appId: 'bookstore', itemCount: 2, totalGrosze: 5400 });
    bus.emit({ type: 'cart:updated', appId: 'tools-shop', itemCount: 1, totalGrosze: 39_900 });
    bus.emit({ type: 'cart:cleared', appId: 'bookstore' });

    const kpi = aggregator.kpi();
    expect(kpi.totalCartsValueGrosze).toBe(39_900);
    expect(kpi.activeCartCount).toBe(1);
    expect(aggregator.kpiByApp()).toEqual({
      'tools-shop': { cartValue: 39_900, cartCount: 1 },
    });
  });

  it('auth:login increments loggedInUsers and adds the app', () => {
    bus.emit({ type: 'auth:login', appId: 'library', role: 'reader' });
    bus.emit({ type: 'auth:login', appId: 'bookstore', role: 'admin' });

    const kpi = aggregator.kpi();
    expect(kpi.loggedInUsers).toBe(2);
    expect(kpi.activeApps).toEqual(['bookstore', 'library']);
  });

  it('auth:logout decrements loggedInUsers and floors at zero', () => {
    bus.emit({ type: 'auth:login', appId: 'library', role: 'reader' });
    bus.emit({ type: 'auth:login', appId: 'library', role: 'librarian' });
    bus.emit({ type: 'auth:logout', appId: 'library' });

    expect(aggregator.kpi().loggedInUsers).toBe(1);
    // Library still has one active session, so it remains tracked.
    expect(aggregator.kpi().activeApps).toEqual(['library']);

    bus.emit({ type: 'auth:logout', appId: 'library' });
    expect(aggregator.kpi().loggedInUsers).toBe(0);
    expect(aggregator.kpi().activeApps).toEqual([]);

    // Extra logout must not drive the counter negative.
    bus.emit({ type: 'auth:logout', appId: 'library' });
    expect(aggregator.kpi().loggedInUsers).toBe(0);
  });

  it('order:placed increments ordersToday and reduces totalCartsValueGrosze', () => {
    bus.emit({ type: 'cart:updated', appId: 'tools-shop', itemCount: 1, totalGrosze: 39_900 });
    bus.emit({ type: 'order:placed', appId: 'tools-shop', orderId: 'o-1', totalGrosze: 39_900 });

    const kpi = aggregator.kpi();
    expect(kpi.ordersToday).toBe(1);
    // Cart total drops by the placed value (clamped at 0).
    expect(kpi.totalCartsValueGrosze).toBe(0);
    expect(kpi.activeApps).toContain('tools-shop');
  });

  it('lastEventAt is updated on every accepted event', () => {
    expect(aggregator.kpi().lastEventAt).toBeNull();

    bus.emit({ type: 'cart:updated', appId: 'bookstore', itemCount: 1, totalGrosze: 1000 });
    const firstStamp = aggregator.kpi().lastEventAt;
    expect(firstStamp).toBeInstanceOf(Date);

    bus.emit({ type: 'cart:cleared', appId: 'bookstore' });
    const secondStamp = aggregator.kpi().lastEventAt;
    expect(secondStamp).toBeInstanceOf(Date);
    expect(secondStamp!.getTime()).toBeGreaterThanOrEqual(firstStamp!.getTime());
  });
});
