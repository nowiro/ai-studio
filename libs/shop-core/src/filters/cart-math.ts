import type { CartLine, CartLineView } from '../models/cart.js';
import type { BaseProduct } from '../models/product.js';

/** Join `CartLine[]` with the catalogue lookup to produce subtotaled views. */
export function buildCartView<T extends BaseProduct>(
  lines: readonly CartLine[],
  lookup: (productId: string) => T | null,
): readonly CartLineView<T>[] {
  const views: CartLineView<T>[] = [];
  for (const line of lines) {
    const product = lookup(line.productId);
    if (!product) {
      continue;
    }
    views.push({ line, product, subtotalCents: product.priceCents * line.quantity });
  }
  return views;
}

/** Sum the subtotals of a built view. */
export function cartTotal<T extends BaseProduct>(views: readonly CartLineView<T>[]): number {
  return views.reduce((sum, view) => sum + view.subtotalCents, 0);
}

/** Total piece count (∑ quantities). */
export function cartCount(lines: readonly CartLine[]): number {
  return lines.reduce((sum, line) => sum + line.quantity, 0);
}

/** Merge two cart-line lists by `productId`, summing quantities. */
export function mergeLines(existing: readonly CartLine[], incoming: readonly CartLine[]): readonly CartLine[] {
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
