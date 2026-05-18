import type { CartLine, CartLineView } from '../models/cart.js';
import type { Tire } from '../models/tire.js';

/** Build a snapshot view of the cart by joining lines with the tire catalogue. */
export function buildCartView(lines: readonly CartLine[], tires: readonly Tire[]): readonly CartLineView[] {
  const byId = new Map(tires.map((tire) => [tire.id, tire]));
  const views: CartLineView[] = [];
  for (const line of lines) {
    const tire = byId.get(line.tireId);
    if (!tire) {
      continue;
    }
    views.push({ line, tire, subtotalCents: tire.priceCents * line.quantity });
  }
  return views;
}

/** Sum the subtotals of a built view. */
export function cartTotal(views: readonly CartLineView[]): number {
  return views.reduce((sum, view) => sum + view.subtotalCents, 0);
}

/** Total piece count (∑ quantities). */
export function cartCount(lines: readonly CartLine[]): number {
  return lines.reduce((sum, line) => sum + line.quantity, 0);
}

/** Merge two cart-line lists by `tireId`, summing quantities. */
export function mergeLines(existing: readonly CartLine[], incoming: readonly CartLine[]): readonly CartLine[] {
  const merged = new Map<string, number>();
  for (const line of existing) {
    merged.set(line.tireId, (merged.get(line.tireId) ?? 0) + line.quantity);
  }
  for (const line of incoming) {
    merged.set(line.tireId, (merged.get(line.tireId) ?? 0) + line.quantity);
  }
  return [...merged.entries()]
    .filter(([, quantity]) => quantity > 0)
    .map(([tireId, quantity]) => ({ tireId, quantity }));
}

/**
 * Format minor-unit (grosze) integer as `1 234,56 zł`. Mirrors the
 * `formatPln` helper in `@ai-studio/shared-app-shell` but kept inline here
 * because `tire-data` is `type:data-access + type:util` and we don't want
 * to pull Angular Material into Node-only unit tests via the shared
 * package's barrel.
 */
export function formatPln(cents: number): string {
  return PLN_FORMATTER.format(cents / 100);
}

const PLN_FORMATTER = new Intl.NumberFormat('pl-PL', {
  style: 'currency',
  currency: 'PLN',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
