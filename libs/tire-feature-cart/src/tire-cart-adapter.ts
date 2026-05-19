import { isPlatformBrowser } from '@angular/common';
import { computed, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

import { CatalogueService } from '@ai-studio/tire-data';
import type { CartLine, CartLineView, CartSnapshot, Tire } from '@ai-studio/tire-data';

import {
  buildTireCartView,
  freeMountingEligible as isFreeMountingEligible,
  mergeTireLines,
  MOUNTING_FEE_PER_TIRE_CENTS,
  tireBulkDiscount,
  tireCartCount,
  tireCartTotal,
  tireCartTotalAfterDiscount,
  tireSetsOfFour,
} from './tire-cart-math.js';

const STORAGE_KEY = 'ais.tire-shop.cart-adapter.v1';
const MAX_QUANTITY = 99;

/**
 * Tire-shop cart adapter that builds on the generic `shop-core` cart
 * primitives (`mergeLines`, `CartLine`, `CartSnapshot`) and layers
 * tire-specific business rules on top:
 *
 * - **Bulk discount** — 5 % off the running total once the buyer has at least
 *   one full set of four tires of the same SKU in the cart.
 * - **Free mounting** — when the cart contains ≥ 4 tires in total (any mix
 *   of SKUs), the mounting service is offered on the house.
 * - **Set counter** — exposes how many full "sets of four" the cart holds,
 *   useful for the checkout summary and the marketing banner.
 *
 * The adapter is **additive**: it lives alongside the legacy
 * `@ai-studio/tire-data` `CartService` and uses its own `localStorage` key so
 * the two stores never clobber each other while consumers migrate. The
 * legacy service is `@deprecated` — new code should depend on
 * `TireCartAdapter`.
 *
 * @example
 * ```ts
 * private readonly cart = inject(TireCartAdapter);
 *
 * this.cart.addLine('tire-001', 4);
 * this.cart.totalAfterDiscountCents();   // 5 % off applied
 * this.cart.freeMountingEligible();      // true
 * ```
 */
@Injectable({ providedIn: 'root' })
export class TireCartAdapter {
  private readonly catalogue = inject(CatalogueService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly linesSignal = signal<readonly CartLine[]>(this.readSnapshot());

  /** Readonly cart contents — one entry per SKU. */
  readonly lines = this.linesSignal.asReadonly();

  /** Total piece count across every line. */
  readonly count = computed(() => tireCartCount(this.linesSignal()));

  /** Cart lines joined with their `Tire` and per-line subtotal. Unknown SKUs are dropped. */
  readonly views = computed<readonly CartLineView[]>(() =>
    buildTireCartView(this.linesSignal(), this.catalogue.tires()),
  );

  /** Gross total before any tire-specific discount. */
  readonly totalCents = computed(() => tireCartTotal(this.views()));

  /** Number of full **sets of four** of the **same SKU** in the cart. */
  readonly setsOfFour = computed(() => tireSetsOfFour(this.linesSignal()));

  /** Bulk-discount amount in grosze (5 % per full same-SKU set of four). */
  readonly bulkDiscountCents = computed(() => tireBulkDiscount(this.views()));

  /** True when the total cart quantity reaches `SET_SIZE` — mounting service is free. */
  readonly freeMountingEligible = computed(() => isFreeMountingEligible(this.linesSignal()));

  /** Notional value of the free mounting service ("ile zaoszczędzasz"). `0` when ineligible. */
  readonly mountingSavingsCents = computed(() =>
    this.freeMountingEligible() ? MOUNTING_FEE_PER_TIRE_CENTS * this.count() : 0,
  );

  /** Final payable total: gross total minus the bulk discount. */
  readonly totalAfterDiscountCents = computed(() => tireCartTotalAfterDiscount(this.views()));

  /** Add (or top up) a line. Quantity clamps to `[1, 99]`. Non-finite or negative quantities collapse to `1`. */
  addLine(tireId: string, quantity = 1): void {
    const safe = clampQuantity(quantity);
    this.linesSignal.update((current) => mergeTireLines(current, [{ tireId, quantity: safe }]));
    this.persist();
  }

  /** Replace an existing line's quantity. `0` or less removes the line. */
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
  return typeof line.tireId === 'string' && typeof line.quantity === 'number' && line.quantity > 0;
}

/** Re-export for downstream callers that want the same `Tire` reference without re-importing. */
export type { Tire };
