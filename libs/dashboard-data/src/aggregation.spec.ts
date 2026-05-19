import { describe, expect, it } from 'vitest';

import { categoryMix, dailyOrders, lowStockOf, revenueByShop, topProducts } from './aggregation.js';
import type { Sale } from './models.js';

const SALES: readonly Sale[] = [
  {
    shop: 'bookstore',
    productId: 'b1',
    productName: 'Pan Tadeusz',
    category: 'classic',
    quantity: 2,
    priceCents: 4900,
    soldAt: new Date('2026-05-15T08:00:00Z'),
  },
  {
    shop: 'bookstore',
    productId: 'b2',
    productName: 'Lalka',
    category: 'classic',
    quantity: 1,
    priceCents: 5900,
    soldAt: new Date('2026-05-15T11:00:00Z'),
  },
  {
    shop: 'bookstore',
    productId: 'b1',
    productName: 'Pan Tadeusz',
    category: 'classic',
    quantity: 1,
    priceCents: 4900,
    soldAt: new Date('2026-05-16T09:00:00Z'),
  },
  {
    shop: 'tools-shop',
    productId: 't1',
    productName: 'Wiertarka',
    category: 'power-tools',
    quantity: 1,
    priceCents: 39900,
    soldAt: new Date('2026-05-15T14:00:00Z'),
  },
  {
    shop: 'toy-shop',
    productId: 'y1',
    productName: 'Klocki LEGO',
    category: 'building',
    quantity: 3,
    priceCents: 19900,
    soldAt: new Date('2026-05-16T10:00:00Z'),
  },
];

describe('revenueByShop', () => {
  it('sums revenue per shop, returns descending order', () => {
    const rows = revenueByShop(SALES);
    // bookstore: 2*4900 + 1*5900 + 1*4900 = 20600
    // tools-shop: 1*39900 = 39900
    // toy-shop: 3*19900 = 59700
    expect(rows).toEqual([
      { shop: 'toy-shop', label: 'Toys', revenueCents: 59700 },
      { shop: 'tools-shop', label: 'Tools', revenueCents: 39900 },
      { shop: 'bookstore', label: 'Bookstore', revenueCents: 20600 },
    ]);
  });

  it('returns empty array for no sales', () => {
    expect(revenueByShop([])).toEqual([]);
  });
});

describe('topProducts', () => {
  it('returns top-N products sorted by units sold', () => {
    const rows = topProducts(SALES, 2);
    expect(rows.map((r) => r.productId)).toEqual(['b1', 'y1']);
    expect(rows[0]?.unitsSold).toBe(3); // b1: 2+1=3
    expect(rows[1]?.unitsSold).toBe(3); // y1: 3
  });

  it('respects the N limit', () => {
    expect(topProducts(SALES, 1)).toHaveLength(1);
  });
});

describe('lowStockOf', () => {
  it('filters rows with stock at or below threshold', () => {
    const rows = lowStockOf([
      { productId: 'b1', productName: 'A', shop: 'bookstore', stock: 5, threshold: 10 },
      { productId: 'b2', productName: 'B', shop: 'bookstore', stock: 20, threshold: 10 },
      { productId: 'b3', productName: 'C', shop: 'bookstore', stock: 10, threshold: 10 },
    ]);
    expect(rows.map((r) => r.productId)).toEqual(['b1', 'b3']);
  });
});

describe('dailyOrders', () => {
  it('buckets by ISO day, sorted ascending', () => {
    const rows = dailyOrders(SALES);
    expect(rows).toEqual([
      { day: '2026-05-15', count: 3 },
      { day: '2026-05-16', count: 2 },
    ]);
  });
});

describe('categoryMix', () => {
  it('aggregates by category, sorted descending', () => {
    const rows = categoryMix(SALES);
    expect(rows).toEqual([
      { category: 'classic', count: 4 }, // 2+1+1
      { category: 'building', count: 3 },
      { category: 'power-tools', count: 1 },
    ]);
  });
});
