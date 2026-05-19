/**
 * Cross-MFE KPI aggregator.
 *
 * Subscribes to `MfeBus` (BroadcastChannel-backed event stream) and projects
 * the resulting traffic into a single signal-based KPI store consumed by the
 * dashboard tiles.
 *
 * Each tracked `MfeEvent` mutates exactly one slice:
 *
 * | event              | KPI mutation                                                                              |
 * | ------------------ | ----------------------------------------------------------------------------------------- |
 * | `cart:updated`     | replaces the per-app cart snapshot; recomputes `totalCartsValueGrosze` + `activeCartCount`|
 * | `cart:cleared`     | zeroes the per-app cart slot; recomputes totals                                           |
 * | `auth:login`       | `loggedInUsers++` (idempotent per app); adds app to `activeApps`                          |
 * | `auth:logout`      | `loggedInUsers--` (floored at 0); removes app from `activeApps` when no other slice keeps it|
 * | `order:placed`     | `ordersToday++`; subtracts the placed-order value from `totalCartsValueGrosze` (clamped)  |
 *
 * `lastEventAt` is updated on every accepted event.
 *
 * The service is `providedIn: 'root'` so a single instance lives for the
 * lifetime of the dashboard MFE; subscription is auto-cleaned via
 * `takeUntilDestroyed()`.
 *
 * @packageDocumentation
 */
import { computed, DestroyRef, inject, Injectable, Signal, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { MfeBus, type MfeEvent } from '@ai-studio/shared-app-shell';

/** Snapshot of one app's cart contribution kept inside the aggregator. */
interface CartSnapshot {
  readonly itemCount: number;
  readonly totalGrosze: number;
}

/**
 * Public, read-only KPI view exposed to the dashboard.
 *
 * - `activeApps`: every appId that currently has a cart, a logged-in user,
 *   or has placed an order.
 * - `totalCartsValueGrosze`: sum of every app's current cart total (in
 *   grosze), minus any value drained by `order:placed` events.
 * - `activeCartCount`: number of apps whose current cart is non-empty.
 * - `loggedInUsers`: count of `auth:login` events not yet matched by a
 *   `auth:logout` for the same app.
 * - `ordersToday`: total `order:placed` events observed (the aggregator does
 *   not yet roll over at midnight; the dashboard owns the day window).
 * - `lastEventAt`: timestamp of the most recently accepted event, or `null`
 *   before any event arrives.
 */
export interface KpiState {
  readonly activeApps: readonly string[];
  readonly totalCartsValueGrosze: number;
  readonly activeCartCount: number;
  readonly loggedInUsers: number;
  readonly ordersToday: number;
  readonly lastEventAt: Date | null;
}

interface InternalKpiState extends KpiState {
  /** Per-app cart snapshots. Replaced on every `cart:updated`. */
  readonly carts: Readonly<Record<string, CartSnapshot>>;
  /** Per-app login counter (a single app may have multiple sessions across tabs). */
  readonly logins: Readonly<Record<string, number>>;
  /** Apps that have placed at least one order since process start. */
  readonly orderApps: Readonly<Record<string, true>>;
}

const INITIAL_STATE: InternalKpiState = {
  activeApps: [],
  totalCartsValueGrosze: 0,
  activeCartCount: 0,
  loggedInUsers: 0,
  ordersToday: 0,
  lastEventAt: null,
  carts: {},
  logins: {},
  orderApps: {},
};

@Injectable({ providedIn: 'root' })
export class KpiAggregator {
  private readonly bus = inject(MfeBus);
  private readonly destroyRef = inject(DestroyRef);
  private readonly state = signal<InternalKpiState>(INITIAL_STATE);

  /** Read-only KPI snapshot consumed by dashboard tiles. */
  readonly kpi: Signal<KpiState> = computed(() => {
    const s = this.state();
    return {
      activeApps: s.activeApps,
      totalCartsValueGrosze: s.totalCartsValueGrosze,
      activeCartCount: s.activeCartCount,
      loggedInUsers: s.loggedInUsers,
      ordersToday: s.ordersToday,
      lastEventAt: s.lastEventAt,
    };
  });

  /** Per-app breakdown of cart value and item count, derived from internal state. */
  readonly kpiByApp: Signal<Record<string, { cartValue: number; cartCount: number }>> = computed(() => {
    const carts = this.state().carts;
    const result: Record<string, { cartValue: number; cartCount: number }> = {};
    for (const [appId, snapshot] of Object.entries(carts)) {
      result[appId] = { cartValue: snapshot.totalGrosze, cartCount: snapshot.itemCount };
    }
    return result;
  });

  constructor() {
    this.bus.events$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((event) => {
      this.apply(event);
    });
  }

  private apply(event: MfeEvent): void {
    this.state.update((prev) => {
      const next = this.reduce(prev, event);
      return { ...next, lastEventAt: new Date() };
    });
  }

  private reduce(prev: InternalKpiState, event: MfeEvent): InternalKpiState {
    switch (event.type) {
      case 'cart:updated': {
        const carts: Record<string, CartSnapshot> = {
          ...prev.carts,
          [event.appId]: { itemCount: event.itemCount, totalGrosze: event.totalGrosze },
        };
        return this.withCarts(prev, carts);
      }
      case 'cart:cleared': {
        const carts: Record<string, CartSnapshot> = { ...prev.carts };
        delete carts[event.appId];
        return this.withCarts(prev, carts);
      }
      case 'auth:login': {
        const logins: Record<string, number> = {
          ...prev.logins,
          [event.appId]: (prev.logins[event.appId] ?? 0) + 1,
        };
        return this.recomputeActiveApps({
          ...prev,
          logins,
          loggedInUsers: prev.loggedInUsers + 1,
        });
      }
      case 'auth:logout': {
        const current = prev.logins[event.appId] ?? 0;
        const logins: Record<string, number> = { ...prev.logins };
        if (current <= 1) {
          delete logins[event.appId];
        } else {
          logins[event.appId] = current - 1;
        }
        return this.recomputeActiveApps({
          ...prev,
          logins,
          loggedInUsers: Math.max(0, prev.loggedInUsers - 1),
        });
      }
      case 'order:placed': {
        const orderApps: Record<string, true> = { ...prev.orderApps, [event.appId]: true };
        return this.recomputeActiveApps({
          ...prev,
          orderApps,
          ordersToday: prev.ordersToday + 1,
          totalCartsValueGrosze: Math.max(0, prev.totalCartsValueGrosze - event.totalGrosze),
        });
      }
      default: {
        // Exhaustiveness guard — adding a new MfeEvent variant breaks the
        // build until the switch handles it.
        const _exhaustive: never = event;
        return _exhaustive;
      }
    }
  }

  private withCarts(prev: InternalKpiState, carts: Record<string, CartSnapshot>): InternalKpiState {
    let total = 0;
    let active = 0;
    for (const snapshot of Object.values(carts)) {
      total += snapshot.totalGrosze;
      if (snapshot.itemCount > 0 || snapshot.totalGrosze > 0) {
        active += 1;
      }
    }
    return this.recomputeActiveApps({
      ...prev,
      carts,
      totalCartsValueGrosze: total,
      activeCartCount: active,
    });
  }

  private recomputeActiveApps(prev: InternalKpiState): InternalKpiState {
    const ids = new Set<string>();
    for (const appId of Object.keys(prev.carts)) {
      ids.add(appId);
    }
    for (const appId of Object.keys(prev.logins)) {
      ids.add(appId);
    }
    for (const appId of Object.keys(prev.orderApps)) {
      ids.add(appId);
    }
    return { ...prev, activeApps: [...ids].sort((a, b) => a.localeCompare(b)) };
  }
}
