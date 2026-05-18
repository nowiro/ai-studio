/**
 * Base shape every shop's product implements. Domain-specific extensions
 * (e.g. `Tire`, `Book`, `Tool`, `Toy`) add their own fields while keeping
 * this contract — the generic cart, filter and sort helpers rely on it.
 *
 * Prices are stored in minor units (grosze) to avoid floating-point bugs.
 */
export interface BaseProduct {
  readonly id: string;
  readonly name: string;
  readonly brand: string;
  readonly priceCents: number;
  readonly oldPriceCents: number | null;
  readonly imageUrl: string;
  readonly description: string;
  readonly stock: number;
  readonly rating: number;
  readonly reviewCount: number;
  readonly category: string;
  readonly tags: readonly string[];
}
