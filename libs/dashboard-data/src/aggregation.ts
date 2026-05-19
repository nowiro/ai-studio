/**
 * Pure aggregation functions over `Sale[]`. Each chart panel binds one of
 * these to its `<ngx-charts-*>` data input via a Signal in
 * `DashboardService` (Phase 3.5).
 *
 * Kept pure (no Angular, no DOM, no I/O) so they're trivially unit-tested
 * via the spec file next to this one. Total coverage target ≥ 80 %.
 *
 * @packageDocumentation
 */
import type {
  CategoryMixRow,
  DailyOrderRow,
  LowStockRow,
  Sale,
  ShopRevenueRow,
  ShopSlug,
  TopProductRow,
} from './models.js';

const SHOP_LABELS: Readonly<Record<ShopSlug, string>> = {
  bookstore: 'Bookstore',
  'tools-shop': 'Tools',
  'toy-shop': 'Toys',
  'tire-shop': 'Tires',
};

/** Sum revenue per shop. Returns rows in shop-slug order. */
export function revenueByShop(sales: readonly Sale[]): readonly ShopRevenueRow[] {
  const totals = new Map<ShopSlug, number>();
  for (const s of sales) {
    totals.set(s.shop, (totals.get(s.shop) ?? 0) + s.priceCents * s.quantity);
  }
  return Array.from(totals.entries())
    .map(([shop, revenueCents]) => ({
      shop,
      label: SHOP_LABELS[shop],
      revenueCents,
    }))
    .sort((a, b) => b.revenueCents - a.revenueCents);
}

/** Top-N products by units sold, descending. */
export function topProducts(sales: readonly Sale[], n = 10): readonly TopProductRow[] {
  const totals = new Map<string, TopProductRow>();
  for (const s of sales) {
    const existing = totals.get(s.productId);
    if (existing === undefined) {
      totals.set(s.productId, {
        productId: s.productId,
        productName: s.productName,
        shop: s.shop,
        unitsSold: s.quantity,
      });
    } else {
      totals.set(s.productId, { ...existing, unitsSold: existing.unitsSold + s.quantity });
    }
  }
  return Array.from(totals.values())
    .sort((a, b) => b.unitsSold - a.unitsSold)
    .slice(0, n);
}

/** Filter to rows whose stock <= threshold (per row). Pure projection. */
export function lowStockOf(
  rows: readonly {
    readonly productId: string;
    readonly productName: string;
    readonly shop: ShopSlug;
    readonly stock: number;
    readonly threshold: number;
  }[],
): readonly LowStockRow[] {
  return rows.filter((r) => r.stock <= r.threshold);
}

/** Bucket sales by ISO day (`YYYY-MM-DD`). Sorted ascending. */
export function dailyOrders(sales: readonly Sale[]): readonly DailyOrderRow[] {
  const buckets = new Map<string, number>();
  for (const s of sales) {
    const day = toIsoDay(s.soldAt);
    buckets.set(day, (buckets.get(day) ?? 0) + 1);
  }
  return Array.from(buckets.entries())
    .map(([day, count]) => ({ day, count }))
    .sort((a, b) => a.day.localeCompare(b.day));
}

/** Aggregate sales count per category (donut chart). */
export function categoryMix(sales: readonly Sale[]): readonly CategoryMixRow[] {
  const buckets = new Map<string, number>();
  for (const s of sales) {
    buckets.set(s.category, (buckets.get(s.category) ?? 0) + s.quantity);
  }
  return Array.from(buckets.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}

function toIsoDay(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
