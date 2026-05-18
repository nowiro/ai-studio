/**
 * Public API for the tire-shop data-access lib.
 * Re-exports models, pure filter/sort fns and signal-driven services.
 *
 * @packageDocumentation
 */
export type {
  Tire,
  TireSize,
  TireSeason,
  SpeedIndex,
  EuLabel,
  EuLabelGrade,
  CartLine,
  CartLineView,
  CartSnapshot,
  ContactDetails,
  DeliveryDetails,
  DeliveryMethod,
  InvoiceDetails,
  OrderDraft,
  TireFilters,
  TireSortKey,
} from './models/index.js';
export { SPEED_INDEX_ORDER, EU_LABEL_GRADES, EMPTY_FILTERS, TIRE_SORT_KEYS } from './models/index.js';
export {
  matchesFilters,
  applyFilters,
  sortTires,
  euLabelScore,
  popularityScore,
  summariseFacets,
  buildCartView,
  cartTotal,
  cartCount,
  mergeLines,
  formatPln,
  type FacetSummary,
} from './filters/index.js';
export { CatalogueService, CartService } from './services/index.js';
export { TIRE_CATALOGUE } from './seed/catalogue.js';
