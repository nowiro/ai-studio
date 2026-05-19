/**
 * Toy-shop domain — `Toy` extends `BaseProduct` from `@ai-studio/shop-core`.
 * @packageDocumentation
 */
export type { Toy, ToyFilters, AgeGroup, GenderHint } from './models/index.js';
export { AGE_GROUPS, GENDER_HINTS, TOY_CATEGORIES, EMPTY_TOY_FILTERS } from './models/index.js';
export { matchesToyFilters, applyToyFilters } from './filters/index.js';
export { ToyShopCatalogueService } from './services/index.js';
export { TOY_CATALOGUE } from './seed/catalogue.js';
export type { AgeGateDecision, AgeRange, SafetyBadge, ToyProduct } from './safety.js';
export { ageRangeMinYears, compareSafety, formatBadgeLabel, requiresAgeGate } from './safety.js';
