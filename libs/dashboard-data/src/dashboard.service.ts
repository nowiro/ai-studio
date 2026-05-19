/**
 * Signal-backed read-side service for the dashboard.
 *
 * Owns:
 *  - A fake fixture-driven `Sale[]` snapshot (replaced with backend data in
 *    a future plan).
 *  - 5 derived signals — one per chart panel — recomputed via `computed()`.
 *
 * Per /clarify resolution the refresh is signal-driven; the seed currently
 * doesn't mutate, so charts only recompute when callers explicitly call
 * {@link refresh}. Wiring to `ShopCartService` mutations (debounced 150 ms)
 * is the Phase 3.5 follow-up.
 *
 * @packageDocumentation
 */
import { computed, Injectable, signal } from '@angular/core';

import { categoryMix, dailyOrders, lowStockOf, revenueByShop, topProducts } from './aggregation.js';
import { SEED_LOW_STOCK, SEED_SALES } from './seed.js';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  readonly #sales = signal(SEED_SALES);
  readonly #lowStock = signal(SEED_LOW_STOCK);

  readonly revenue = computed(() => revenueByShop(this.#sales()));
  readonly topProducts = computed(() => topProducts(this.#sales(), 10));
  readonly lowStock = computed(() => lowStockOf(this.#lowStock()));
  readonly dailyOrders = computed(() => dailyOrders(this.#sales()));
  readonly categoryMix = computed(() => categoryMix(this.#sales()));

  /** Re-emit the seeds — the derived signals recompute automatically. */
  refresh(): void {
    this.#sales.set([...this.#sales()]);
    this.#lowStock.set([...this.#lowStock()]);
  }
}
