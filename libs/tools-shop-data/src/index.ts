/**
 * Tools-shop domain — `Tool` extends `BaseProduct` from `@ai-studio/shop-core`.
 * @packageDocumentation
 */
export type { Tool, ToolFilters, ToolType, PowerSource } from './models/index.js';
export { TOOL_TYPES, POWER_SOURCES, TOOL_CATEGORIES, EMPTY_TOOL_FILTERS } from './models/index.js';
export { matchesToolFilters, applyToolFilters } from './filters/index.js';
export { ToolsShopCatalogueService } from './services/index.js';
export { TOOL_CATALOGUE } from './seed/catalogue.js';
export type { BulkPricingTier, BulkPricingScheme, AppliedPricing } from './bulk-pricing.js';
export { applyBulkPricing, formatPricingBadge, validateScheme } from './bulk-pricing.js';
