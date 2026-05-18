import { InjectionToken, type Signal } from '@angular/core';

import type { BaseProduct } from '../models/product.js';

/**
 * Minimal contract a shop's catalogue exposes so the generic
 * `ShopCartService` and `<ais-shop-*>` components can join cart lines
 * with their products without knowing the concrete product type.
 */
export interface ProductLookup<T extends BaseProduct = BaseProduct> {
  readonly products: Signal<readonly T[]>;
  findById(id: string): T | null;
}

/**
 * DI token each shop wires to its `CatalogueService` (or equivalent):
 *
 * ```ts
 * { provide: PRODUCT_LOOKUP, useExisting: TireCatalogueService }
 * ```
 */
export const PRODUCT_LOOKUP = new InjectionToken<ProductLookup>('ais.shop.ProductLookup');

/** DI token each shop provides to control the localStorage key prefix. */
export const CART_STORAGE_KEY = new InjectionToken<string>('ais.shop.CartStorageKey');
