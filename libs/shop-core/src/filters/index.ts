export {
  matchesBaseFilters,
  matchesSetFacet,
  matchesDimension,
  matchesPriceFloor,
  matchesPriceCeiling,
  matchesStock,
  matchesQuery,
  applyBaseFilters,
} from './matching.js';
export { sortProducts, popularityScore } from './sorting.js';
export { summariseBaseFacets, type BaseFacetSummary } from './facets.js';
export { buildCartView, cartTotal, cartCount, mergeLines } from './cart-math.js';
