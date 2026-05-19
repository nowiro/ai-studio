/**
 * Static fixtures driving the dashboard demo. Replace with real backend
 * data (or computed feeds off each shop's catalogue) in a follow-up plan.
 *
 * @packageDocumentation
 */
import type { LowStockRow, Sale } from './models.js';

export const SEED_SALES: readonly Sale[] = [
  // Bookstore
  {
    shop: 'bookstore',
    productId: 'b1',
    productName: 'Pan Tadeusz',
    category: 'classic',
    quantity: 12,
    priceCents: 4900,
    soldAt: new Date('2026-05-12T10:00:00Z'),
  },
  {
    shop: 'bookstore',
    productId: 'b2',
    productName: 'Lalka',
    category: 'classic',
    quantity: 8,
    priceCents: 5900,
    soldAt: new Date('2026-05-13T14:00:00Z'),
  },
  {
    shop: 'bookstore',
    productId: 'b3',
    productName: 'Solaris',
    category: 'sci-fi',
    quantity: 5,
    priceCents: 4500,
    soldAt: new Date('2026-05-14T09:00:00Z'),
  },
  {
    shop: 'bookstore',
    productId: 'b4',
    productName: 'Wiedźmin',
    category: 'fantasy',
    quantity: 14,
    priceCents: 5500,
    soldAt: new Date('2026-05-15T11:00:00Z'),
  },
  {
    shop: 'bookstore',
    productId: 'b5',
    productName: 'Cyberiada',
    category: 'sci-fi',
    quantity: 4,
    priceCents: 4900,
    soldAt: new Date('2026-05-16T09:00:00Z'),
  },
  // Tools-shop
  {
    shop: 'tools-shop',
    productId: 't1',
    productName: 'Wiertarka 18V',
    category: 'power-tools',
    quantity: 7,
    priceCents: 39900,
    soldAt: new Date('2026-05-12T15:00:00Z'),
  },
  {
    shop: 'tools-shop',
    productId: 't2',
    productName: 'Klucz dynamometryczny',
    category: 'hand-tools',
    quantity: 3,
    priceCents: 22900,
    soldAt: new Date('2026-05-14T10:00:00Z'),
  },
  {
    shop: 'tools-shop',
    productId: 't3',
    productName: 'Szlifierka kątowa',
    category: 'power-tools',
    quantity: 5,
    priceCents: 29900,
    soldAt: new Date('2026-05-15T12:00:00Z'),
  },
  // Toy-shop
  {
    shop: 'toy-shop',
    productId: 'y1',
    productName: 'LEGO Technic',
    category: 'building',
    quantity: 11,
    priceCents: 19900,
    soldAt: new Date('2026-05-13T09:00:00Z'),
  },
  {
    shop: 'toy-shop',
    productId: 'y2',
    productName: 'Pluszowy miś',
    category: 'plush',
    quantity: 22,
    priceCents: 6900,
    soldAt: new Date('2026-05-14T14:00:00Z'),
  },
  {
    shop: 'toy-shop',
    productId: 'y3',
    productName: 'Puzzle 1000',
    category: 'puzzles',
    quantity: 9,
    priceCents: 4900,
    soldAt: new Date('2026-05-15T16:00:00Z'),
  },
  // Tire-shop
  {
    shop: 'tire-shop',
    productId: 'r1',
    productName: 'Opona zimowa 205/55',
    category: 'winter',
    quantity: 16,
    priceCents: 39900,
    soldAt: new Date('2026-05-12T11:00:00Z'),
  },
  {
    shop: 'tire-shop',
    productId: 'r2',
    productName: 'Opona letnia 195/65',
    category: 'summer',
    quantity: 24,
    priceCents: 32900,
    soldAt: new Date('2026-05-14T13:00:00Z'),
  },
  {
    shop: 'tire-shop',
    productId: 'r3',
    productName: 'Felga 17"',
    category: 'rims',
    quantity: 6,
    priceCents: 89900,
    soldAt: new Date('2026-05-16T10:00:00Z'),
  },
];

export const SEED_LOW_STOCK: readonly LowStockRow[] = [
  { shop: 'bookstore', productId: 'b3', productName: 'Solaris', stock: 3, threshold: 5 },
  { shop: 'tools-shop', productId: 't2', productName: 'Klucz dynamometryczny', stock: 2, threshold: 5 },
  { shop: 'toy-shop', productId: 'y3', productName: 'Puzzle 1000', stock: 4, threshold: 10 },
  { shop: 'tire-shop', productId: 'r3', productName: 'Felga 17"', stock: 1, threshold: 4 },
];
