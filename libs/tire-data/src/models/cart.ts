import type { Tire } from './tire.js';

/** A single line in the cart — tire + quantity. */
export interface CartLine {
  readonly tireId: string;
  readonly quantity: number;
}

/** Cart line decorated with the tire it refers to. Built by the service. */
export interface CartLineView {
  readonly line: CartLine;
  readonly tire: Tire;
  readonly subtotalCents: number;
}

/** Snapshot of the cart written to / read from localStorage. */
export interface CartSnapshot {
  readonly version: 1;
  readonly lines: readonly CartLine[];
}
