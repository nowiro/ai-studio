import type { BaseProduct } from './product.js';

/** A single line in the cart — product + quantity. */
export interface CartLine {
  readonly productId: string;
  readonly quantity: number;
}

/** Cart line decorated with its product. Built by the cart service. */
export interface CartLineView<T extends BaseProduct = BaseProduct> {
  readonly line: CartLine;
  readonly product: T;
  readonly subtotalCents: number;
}

/** Snapshot of the cart written to / read from localStorage. */
export interface CartSnapshot {
  readonly version: 1;
  readonly lines: readonly CartLine[];
}
