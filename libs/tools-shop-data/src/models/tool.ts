import type { BaseFilters, BaseProduct } from '@ai-studio/shop-core';

/** A hand tool / power tool for sale. Extends `BaseProduct` with tool-specific fields. */
export interface Tool extends BaseProduct {
  readonly toolType: ToolType;
  readonly powerSource: PowerSource;
  readonly voltage: number | null;
  readonly weightKg: number;
  readonly warrantyMonths: number;
  readonly skuCode: string;
}

export type ToolType =
  | 'drill'
  | 'saw'
  | 'grinder'
  | 'sander'
  | 'screwdriver'
  | 'wrench'
  | 'hammer'
  | 'measuring'
  | 'safety';

export const TOOL_TYPES: readonly ToolType[] = [
  'drill',
  'saw',
  'grinder',
  'sander',
  'screwdriver',
  'wrench',
  'hammer',
  'measuring',
  'safety',
];

export type PowerSource = 'manual' | 'corded' | 'battery' | 'pneumatic';

export const POWER_SOURCES: readonly PowerSource[] = ['manual', 'corded', 'battery', 'pneumatic'];

/** Categories used as the shop-wide "scope:tools-shop" facet. */
export const TOOL_CATEGORIES: readonly string[] = [
  'power-tools',
  'hand-tools',
  'fasteners',
  'measuring',
  'safety',
  'storage',
];

export interface ToolFilters extends BaseFilters {
  readonly toolTypes: ReadonlySet<ToolType>;
  readonly powerSources: ReadonlySet<PowerSource>;
}

export const EMPTY_TOOL_FILTERS: ToolFilters = {
  brands: new Set(),
  categories: new Set(),
  minPriceCents: null,
  maxPriceCents: null,
  inStockOnly: false,
  query: '',
  toolTypes: new Set(),
  powerSources: new Set(),
};
