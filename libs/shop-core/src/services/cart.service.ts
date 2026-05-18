import { isPlatformBrowser } from '@angular/common';
import { computed, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

import { buildCartView, cartCount, cartTotal, mergeLines } from '../filters/cart-math.js';
import type { CartLine, CartLineView, CartSnapshot } from '../models/cart.js';
import type { BaseProduct } from '../models/product.js';
import { CART_STORAGE_KEY, PRODUCT_LOOKUP } from './product-lookup.js';

const MAX_QUANTITY = 99;

/**
 * Generic cart service shared by every shop demo. Owns:
 *
 * - `lines` signal — the canonical cart contents.
 * - `count` / `totalCents` / `views` computeds derived from `PRODUCT_LOOKUP`.
 * - localStorage mirror, keyed by the shop-provided `CART_STORAGE_KEY`.
 *
 * Each shop wires its own product catalogue via the `PRODUCT_LOOKUP` token:
 *
 * ```ts
 * { provide: PRODUCT_LOOKUP, useExisting: TireCatalogueService },
 * { provide: CART_STORAGE_KEY, useValue: 'ais.tire-shop.cart.v1' },
 * ```
 */
@Injectable({ providedIn: 'root' })
export class ShopCartService {
  private readonly lookup = inject(PRODUCT_LOOKUP);
  private readonly storageKey = inject(CART_STORAGE_KEY);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly linesSignal = signal<readonly CartLine[]>(this.readSnapshot());

  readonly lines = this.linesSignal.asReadonly();
  readonly count = computed(() => cartCount(this.linesSignal()));
  readonly views = computed<readonly CartLineView<BaseProduct>[]>(() =>
    buildCartView(this.linesSignal(), (id) => this.lookup.findById(id)),
  );
  readonly totalCents = computed(() => cartTotal(this.views()));

  /** Add a line (or top up an existing one). Quantity clamped to [1, 99]. */
  addLine(productId: string, quantity = 1): void {
    const safe = clampQuantity(quantity);
    this.linesSignal.update((current) => mergeLines(current, [{ productId, quantity: safe }]));
    this.persist();
  }

  /** Replace the quantity of an existing line. Quantity ≤ 0 removes it. */
  setQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeLine(productId);
      return;
    }
    const safe = clampQuantity(quantity);
    this.linesSignal.update((current) =>
      current
        .map((line) => (line.productId === productId ? { productId, quantity: safe } : line))
        .filter((line) => line.quantity > 0),
    );
    this.persist();
  }

  removeLine(productId: string): void {
    this.linesSignal.update((current) => current.filter((line) => line.productId !== productId));
    this.persist();
  }

  clear(): void {
    this.linesSignal.set([]);
    this.persist();
  }

  private persist(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const snapshot: CartSnapshot = { version: 1, lines: this.linesSignal() };
    try {
      globalThis.localStorage.setItem(this.storageKey, JSON.stringify(snapshot));
    } catch {
      // Quota or privacy mode — degrade silently. The signal stays the source of truth.
    }
  }

  private readSnapshot(): readonly CartLine[] {
    if (!isPlatformBrowser(this.platformId)) {
      return [];
    }
    try {
      const raw = globalThis.localStorage.getItem(this.storageKey);
      if (!raw) {
        return [];
      }
      const parsed = JSON.parse(raw) as Partial<CartSnapshot> | null;
      if (parsed?.version !== 1 || !Array.isArray(parsed.lines)) {
        return [];
      }
      return (parsed.lines as readonly Partial<CartLine>[]).filter(isValidLine);
    } catch {
      return [];
    }
  }
}

function clampQuantity(quantity: number): number {
  if (!Number.isFinite(quantity) || quantity < 1) {
    return 1;
  }
  if (quantity > MAX_QUANTITY) {
    return MAX_QUANTITY;
  }
  return Math.floor(quantity);
}

function isValidLine(line: Partial<CartLine> | null | undefined): line is CartLine {
  if (!line || typeof line !== 'object') {
    return false;
  }
  return typeof line.productId === 'string' && typeof line.quantity === 'number' && line.quantity > 0;
}
