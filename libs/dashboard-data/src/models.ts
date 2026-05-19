/**
 * Dashboard domain models — KPI snapshots aggregated across every shop.
 *
 * The shapes are intentionally narrow: each chart panel maps one of these
 * types to a single `<ngx-charts-*>` invocation (Phase 3.5 of the
 * consolidated roadmap). Backend integration is out of scope — the demo
 * computes the snapshots from each shop's seed data + the current
 * `ShopCartService` state.
 *
 * @packageDocumentation
 */

export type ShopSlug = 'bookstore' | 'tools-shop' | 'toy-shop' | 'tire-shop';

/** Single fact row read from a shop's seed (or, eventually, a real backend). */
export interface Sale {
  readonly shop: ShopSlug;
  readonly productId: string;
  readonly productName: string;
  readonly category: string;
  readonly quantity: number;
  readonly priceCents: number;
  readonly soldAt: Date;
}

/** Aggregated KPI tile fed into the dashboard. */
export interface KpiSnapshot {
  readonly id: 'gross-revenue' | 'orders-today' | 'top-shop' | 'low-stock-count' | 'avg-cart-value';
  readonly label: string;
  readonly value: string;
  readonly delta: number | null;
  readonly icon: string;
}

/** Aggregated bar-chart row: revenue per shop. */
export interface ShopRevenueRow {
  readonly shop: ShopSlug;
  readonly label: string;
  readonly revenueCents: number;
}

/** Aggregated horizontal-bar row: top-N products. */
export interface TopProductRow {
  readonly productId: string;
  readonly productName: string;
  readonly shop: ShopSlug;
  readonly unitsSold: number;
}

/** Low-stock alert row (product whose seed stock fell below a threshold). */
export interface LowStockRow {
  readonly productId: string;
  readonly productName: string;
  readonly shop: ShopSlug;
  readonly stock: number;
  readonly threshold: number;
}

/** Daily orders (line-chart) — last N days. */
export interface DailyOrderRow {
  readonly day: string;
  readonly count: number;
}

/** Donut-chart slice: orders per category. */
export interface CategoryMixRow {
  readonly category: string;
  readonly count: number;
}
