import { computed, Injectable, signal } from '@angular/core';

import {
  BASE_SORT_KEYS,
  type BaseSortKey,
  type ProductLookup,
  sortProducts,
  summariseBaseFacets,
} from '@ai-studio/shop-core';

import { applyToolFilters } from '../filters/matching.js';
import { EMPTY_TOOL_FILTERS, type Tool, type ToolFilters } from '../models/tool.js';
import { TOOL_CATALOGUE } from '../seed/catalogue.js';

@Injectable({ providedIn: 'root' })
export class ToolsShopCatalogueService implements ProductLookup<Tool> {
  private readonly toolsSignal = signal<readonly Tool[]>(TOOL_CATALOGUE);
  private readonly filtersSignal = signal<ToolFilters>(EMPTY_TOOL_FILTERS);
  private readonly sortSignal = signal<BaseSortKey>('popularity');

  readonly sortKeys = BASE_SORT_KEYS;
  readonly products = this.toolsSignal.asReadonly();
  readonly filters = this.filtersSignal.asReadonly();
  readonly sort = this.sortSignal.asReadonly();

  readonly filtered = computed<readonly Tool[]>(() => {
    const passed = applyToolFilters(this.toolsSignal(), this.filtersSignal());
    return sortProducts(passed, this.sortSignal());
  });

  readonly facets = computed(() => summariseBaseFacets(this.toolsSignal()));

  patchFilters(patch: Partial<ToolFilters>): void {
    this.filtersSignal.update((current) => ({ ...current, ...patch }));
  }

  resetFilters(): void {
    this.filtersSignal.set(EMPTY_TOOL_FILTERS);
  }

  setSort(next: BaseSortKey): void {
    this.sortSignal.set(next);
  }

  findById(id: string): Tool | null {
    return this.toolsSignal().find((tool) => tool.id === id) ?? null;
  }
}
