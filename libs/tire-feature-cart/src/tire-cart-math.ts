// Type-only imports keep this module pure-Node so vitest tests run without
// the Angular JIT compiler (the public `@ai-studio/shop-core` barrel pulls in
// `ShopCartService` and triggers an `@angular/common/_platform_location-chunk`
// JIT error in node-env tests).
import type { CartLine, CartLineView, Tire } from '@ai-studio/tire-data';

interface ShopLine {
  readonly productId: string;
  readonly quantity: number;
}

/**
 * Inlined copy of `mergeLines` from `@ai-studio/shop-core`. Kept here to avoid
 * a runtime dependency on the shop-core barrel (which evaluates Angular DI
 * tokens and breaks Node-only vitest). Logic must stay in sync with the
 * canonical implementation — covered by tire-cart-math.spec.ts.
 */
function shopMergeLines(existing: readonly ShopLine[], incoming: readonly ShopLine[]): readonly ShopLine[] {
  const merged = new Map<string, number>();
  for (const line of existing) {
    merged.set(line.productId, (merged.get(line.productId) ?? 0) + line.quantity);
  }
  for (const line of incoming) {
    merged.set(line.productId, (merged.get(line.productId) ?? 0) + line.quantity);
  }
  return [...merged.entries()]
    .filter(([, quantity]) => quantity > 0)
    .map(([productId, quantity]) => ({ productId, quantity }));
}

/** Tires per set on a standard passenger car. */
export const SET_SIZE = 4;

/** Bulk-discount rate applied to each full set of four (5 %). */
export const BULK_DISCOUNT_RATE = 0.05;

/**
 * Flat per-tire mounting fee that is waived once the cart holds at least
 * `SET_SIZE` tires. Exposed so consumers can render "Oszczędzasz X" labels.
 */
export const MOUNTING_FEE_PER_TIRE_CENTS = 4500;

/** Sum of every line's quantity — total piece count. */
export function tireCartCount(lines: readonly CartLine[]): number {
  return lines.reduce((sum, line) => sum + line.quantity, 0);
}

/**
 * Number of full **sets of four** of the **same SKU** in the cart.
 * `[{tire-a:8},{tire-b:5}]` → `2 + 1 = 3`.
 */
export function tireSetsOfFour(lines: readonly CartLine[]): number {
  return lines.reduce((sum, line) => sum + Math.floor(line.quantity / SET_SIZE), 0);
}

/**
 * Bulk-discount amount in grosze. `BULK_DISCOUNT_RATE` is applied to every
 * tire that belongs to a full same-SKU set of four. Mixed sets do NOT count.
 */
export function tireBulkDiscount(views: readonly CartLineView[]): number {
  let discount = 0;
  for (const view of views) {
    const tiresInSets = Math.floor(view.line.quantity / SET_SIZE) * SET_SIZE;
    discount += Math.round(view.tire.priceCents * tiresInSets * BULK_DISCOUNT_RATE);
  }
  return discount;
}

/** True when the cart holds enough tires for the free mounting service (≥ `SET_SIZE`). */
export function freeMountingEligible(lines: readonly CartLine[]): boolean {
  return tireCartCount(lines) >= SET_SIZE;
}

/** Notional savings of the free mounting service. Zero when ineligible. */
export function mountingSavings(lines: readonly CartLine[]): number {
  return freeMountingEligible(lines) ? MOUNTING_FEE_PER_TIRE_CENTS * tireCartCount(lines) : 0;
}

/** Gross total before discount, summed from per-line subtotals. */
export function tireCartTotal(views: readonly CartLineView[]): number {
  return views.reduce((sum, view) => sum + view.subtotalCents, 0);
}

/** Final payable total: gross total minus the bulk discount. Never negative. */
export function tireCartTotalAfterDiscount(views: readonly CartLineView[]): number {
  return Math.max(0, tireCartTotal(views) - tireBulkDiscount(views));
}

/**
 * Build the `CartLineView[]` from current lines + tire catalogue. Lines whose
 * `tireId` is not in the catalogue are silently dropped (matches the
 * behaviour of `@ai-studio/tire-data/buildCartView`).
 */
export function buildTireCartView(lines: readonly CartLine[], tires: readonly Tire[]): readonly CartLineView[] {
  const byId = new Map(tires.map((tire) => [tire.id, tire]));
  const out: CartLineView[] = [];
  for (const line of lines) {
    const tire = byId.get(line.tireId);
    if (!tire) {
      continue;
    }
    out.push({ line, tire, subtotalCents: tire.priceCents * line.quantity });
  }
  return out;
}

/**
 * Merge new cart-line increments into the existing list using the shop-core
 * `mergeLines` helper. Acts as the bridge that keeps tire-shop's `tireId`
 * convention compatible with shop-core's `productId` field.
 */
export function mergeTireLines(existing: readonly CartLine[], incoming: readonly CartLine[]): readonly CartLine[] {
  const merged = shopMergeLines(
    existing.map((line) => ({ productId: line.tireId, quantity: line.quantity })),
    incoming.map((line) => ({ productId: line.tireId, quantity: line.quantity })),
  );
  return merged.map((line) => ({ tireId: line.productId, quantity: line.quantity }));
}
