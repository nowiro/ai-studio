/**
 * Public API for the dashboard-data library.
 *
 * @packageDocumentation
 */
export { categoryMix, dailyOrders, lowStockOf, revenueByShop, topProducts } from './aggregation.js';
export { DashboardService } from './dashboard.service.js';
export type {
  CategoryMixRow,
  DailyOrderRow,
  KpiSnapshot,
  LowStockRow,
  Sale,
  ShopRevenueRow,
  ShopSlug,
  TopProductRow,
} from './models.js';
export { SEED_LOW_STOCK, SEED_SALES } from './seed.js';
