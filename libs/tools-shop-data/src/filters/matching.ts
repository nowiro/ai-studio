import { matchesBaseFilters, matchesSetFacet } from '@ai-studio/shop-core';

import type { Tool, ToolFilters } from '../models/tool.js';

export function matchesToolFilters(tool: Tool, filters: ToolFilters): boolean {
  if (!matchesBaseFilters(tool, filters)) {
    return false;
  }
  if (!matchesSetFacet(filters.toolTypes, tool.toolType)) {
    return false;
  }
  if (!matchesSetFacet(filters.powerSources, tool.powerSource)) {
    return false;
  }
  return true;
}

export function applyToolFilters(tools: readonly Tool[], filters: ToolFilters): readonly Tool[] {
  return tools.filter((tool) => matchesToolFilters(tool, filters));
}
