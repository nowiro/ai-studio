import { isPlatformBrowser } from '@angular/common';
import { computed, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

import { buildCartView, cartCount, cartTotal, mergeLines } from '../filters/cart-math.js';
import type { CartLine, CartLineView, CartSnapshot } from '../models/cart.js';
import { CatalogueService } from './catalogue.service.js';

const STORAGE_KEY = 'ais.tire-shop.cart.v1';
const MAX_QUANTITY = 99;

/**
 * Holds the cart contents as a signal and mirrors them to localStorage on
 * every mutation. Browser-only side effects are guarded so unit tests under
 * Node don't crash.
 *
 * MIGRATION NOTE: new code should prefer `TireCartAdapter` from
 * `@ai-studio/tire-feature-cart`, which builds on the generic
 * `ShopCartService` primitives from `@ai-studio/shop-core` and adds
 * tire-specific business rules (bulk discount on full sets of four, free
 * mounting service). This class is retained for `CartDrawerComponent`,
 * `CartPageComponent` and `CheckoutComponent` until their migration lands —
 * `@deprecated` will be added in a follow-up once those consumers move over.
 */
@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly catalogue = inject(CatalogueService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly linesSignal = signal<readonly CartLine[]>(this.readSnapshot());

  readonly lines = this.linesSignal.asReadonly();
  readonly count = computed(() => cartCount(this.linesSignal()));
  readonly views = computed<readonly CartLineView[]>(() => buildCartView(this.linesSignal(), this.catalogue.tires()));
  readonly totalCents = computed(() => cartTotal(this.views()));

  /** Add a line (or top up an existing one). Quantity is clamped to [1, 99]. */
  addLine(tireId: string, quantity = 1): void {
    const safe = clampQuantity(quantity);
    this.linesSignal.update((current) => mergeLines(current, [{ tireId, quantity: safe }]));
    this.persist();
  }

  /** Replace the quantity of an existing line. Quantity ≤ 0 removes it. */
  setQuantity(tireId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeLine(tireId);
      return;
    }
    const safe = clampQuantity(quantity);
    this.linesSignal.update((current) =>
      current
        .map((line) => (line.tireId === tireId ? { tireId, quantity: safe } : line))
        .filter((line) => line.quantity > 0),
    );
    this.persist();
  }

  removeLine(tireId: string): void {
    this.linesSignal.update((current) => current.filter((line) => line.tireId !== tireId));
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
      globalThis.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
    } catch {
      // Quota or privacy mode — degrade silently. The signal stays the source of truth.
    }
  }

  private readSnapshot(): readonly CartLine[] {
    if (!isPlatformBrowser(this.platformId)) {
      return [];
    }
    try {
      const raw = globalThis.localStorage.getItem(STORAGE_KEY);
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

function isValidLine(line: Partial<CartLine> | null | undefined): line is CartLine {
  if (!line || typeof line !== 'object') {
    return false;
  }
  return typeof line.tireId === 'string' && typeof line.quantity === 'number' && line.quantity > 0;
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
