/**
 * Generic e-commerce primitives shared by every shop demo. Domain libs
 * (`tire-data`, `bookstore-data`, `tools-data`, `toys-data`) extend
 * `BaseProduct` and inject the generic `ShopCartService` via the
 * `PRODUCT_LOOKUP` token.
 *
 * @packageDocumentation
 */
export type {
  BaseProduct,
  CartLine,
  CartLineView,
  CartSnapshot,
  BaseFilters,
  BaseSortKey,
  ContactDetails,
  DeliveryDetails,
  DeliveryMethod,
  InvoiceDetails,
  OrderDraft,
} from './models/index.js';
export { EMPTY_BASE_FILTERS, BASE_SORT_KEYS } from './models/index.js';
export {
  matchesBaseFilters,
  matchesSetFacet,
  matchesDimension,
  matchesPriceFloor,
  matchesPriceCeiling,
  matchesStock,
  matchesQuery,
  applyBaseFilters,
  sortProducts,
  popularityScore,
  summariseBaseFacets,
  buildCartView,
  cartTotal,
  cartCount,
  mergeLines,
  type BaseFacetSummary,
} from './filters/index.js';
export { CART_STORAGE_KEY, PRODUCT_LOOKUP, ShopCartService, type ProductLookup } from './services/index.js';
