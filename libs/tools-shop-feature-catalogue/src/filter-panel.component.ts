import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import {
  POWER_SOURCES,
  type PowerSource,
  TOOL_CATEGORIES,
  TOOL_TYPES,
  ToolsShopCatalogueService,
  type ToolType,
} from '@ai-studio/tools-shop-data';

@Component({
  selector: 'ais-tools-shop-filter-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, MatButtonModule, MatCheckboxModule, MatExpansionModule, MatFormFieldModule, MatInputModule],
  template: `
    <aside
      class="gap-3 p-3 rounded flex flex-col bg-surface-container"
      data-testid="filter-panel"
    >
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold m-0">Filtry</h2>
        <button
          (click)="catalogue.resetFilters()"
          matButton
          type="button"
          data-testid="filter-reset"
        >
          Wyczyść
        </button>
      </div>

      <mat-form-field
        appearance="outline"
        subscriptSizing="dynamic"
      >
        <mat-label>Szukaj</mat-label>
        <input
          [ngModel]="catalogue.filters().query"
          (ngModelChange)="catalogue.patchFilters({ query: $event })"
          matInput
          data-testid="filter-query"
          placeholder="Bosch, wiertarka, 18V"
        />
      </mat-form-field>

      <mat-expansion-panel expanded>
        <mat-expansion-panel-header>
          <mat-panel-title>Kategoria</mat-panel-title>
        </mat-expansion-panel-header>
        <div class="gap-1 flex flex-col">
          @for (c of categories; track c) {
            <mat-checkbox
              [checked]="catalogue.filters().categories.has(c)"
              [attr.data-testid]="'filter-category-' + c"
              (change)="toggleCategory(c)"
            >
              {{ categoryLabel(c) }}
            </mat-checkbox>
          }
        </div>
      </mat-expansion-panel>

      <mat-expansion-panel>
        <mat-expansion-panel-header>
          <mat-panel-title>Typ narzędzia</mat-panel-title>
        </mat-expansion-panel-header>
        <div class="gap-1 max-h-64 flex flex-col overflow-auto">
          @for (t of toolTypes; track t) {
            <mat-checkbox
              [checked]="catalogue.filters().toolTypes.has(t)"
              [attr.data-testid]="'filter-tool-type-' + t"
              (change)="toggleToolType(t)"
            >
              {{ toolTypeLabel(t) }}
            </mat-checkbox>
          }
        </div>
      </mat-expansion-panel>

      <mat-expansion-panel>
        <mat-expansion-panel-header>
          <mat-panel-title>Zasilanie</mat-panel-title>
        </mat-expansion-panel-header>
        <div class="gap-1 flex flex-col">
          @for (s of powerSources; track s) {
            <mat-checkbox
              [checked]="catalogue.filters().powerSources.has(s)"
              [attr.data-testid]="'filter-power-' + s"
              (change)="togglePower(s)"
            >
              {{ powerLabel(s) }}
            </mat-checkbox>
          }
        </div>
      </mat-expansion-panel>

      <mat-expansion-panel>
        <mat-expansion-panel-header>
          <mat-panel-title>Cena (zł)</mat-panel-title>
        </mat-expansion-panel-header>
        <div class="gap-2 flex items-center">
          <mat-form-field
            appearance="outline"
            subscriptSizing="dynamic"
          >
            <mat-label>od</mat-label>
            <input
              [ngModel]="minZl()"
              (ngModelChange)="setMin($event)"
              matInput
              type="number"
              data-testid="filter-min-price"
            />
          </mat-form-field>
          <mat-form-field
            appearance="outline"
            subscriptSizing="dynamic"
          >
            <mat-label>do</mat-label>
            <input
              [ngModel]="maxZl()"
              (ngModelChange)="setMax($event)"
              matInput
              type="number"
              data-testid="filter-max-price"
            />
          </mat-form-field>
        </div>
      </mat-expansion-panel>

      <mat-checkbox
        [checked]="catalogue.filters().inStockOnly"
        (change)="catalogue.patchFilters({ inStockOnly: !catalogue.filters().inStockOnly })"
        data-testid="filter-in-stock"
      >
        Tylko w magazynie
      </mat-checkbox>
    </aside>
  `,
})
export class FilterPanelComponent {
  protected readonly catalogue = inject(ToolsShopCatalogueService);

  protected readonly categories = TOOL_CATEGORIES;
  protected readonly toolTypes = TOOL_TYPES;
  protected readonly powerSources = POWER_SOURCES;

  protected readonly minZl = computed(() => {
    const value = this.catalogue.filters().minPriceCents;
    return value === null ? null : Math.round(value / 100);
  });
  protected readonly maxZl = computed(() => {
    const value = this.catalogue.filters().maxPriceCents;
    return value === null ? null : Math.round(value / 100);
  });

  protected toolTypeLabel(t: ToolType): string {
    return TOOL_TYPE_LABELS[t];
  }

  protected powerLabel(s: PowerSource): string {
    return POWER_LABELS[s];
  }

  protected categoryLabel(c: string): string {
    return CATEGORY_LABELS[c] ?? c;
  }

  protected toggleCategory(category: string): void {
    const current = new Set(this.catalogue.filters().categories);
    if (current.has(category)) {
      current.delete(category);
    } else {
      current.add(category);
    }
    this.catalogue.patchFilters({ categories: current });
  }

  protected toggleToolType(t: ToolType): void {
    const current = new Set(this.catalogue.filters().toolTypes);
    if (current.has(t)) {
      current.delete(t);
    } else {
      current.add(t);
    }
    this.catalogue.patchFilters({ toolTypes: current });
  }

  protected togglePower(s: PowerSource): void {
    const current = new Set(this.catalogue.filters().powerSources);
    if (current.has(s)) {
      current.delete(s);
    } else {
      current.add(s);
    }
    this.catalogue.patchFilters({ powerSources: current });
  }

  protected setMin(value: unknown): void {
    this.catalogue.patchFilters({ minPriceCents: parseZlotyToCents(value) });
  }

  protected setMax(value: unknown): void {
    this.catalogue.patchFilters({ maxPriceCents: parseZlotyToCents(value) });
  }
}

const TOOL_TYPE_LABELS: Readonly<Record<ToolType, string>> = {
  drill: 'Wiertarki',
  saw: 'Piły',
  grinder: 'Szlifierki kątowe',
  sander: 'Szlifierki',
  screwdriver: 'Wkrętarki / wkrętaki',
  wrench: 'Klucze',
  hammer: 'Młotki',
  measuring: 'Pomiarowe',
  safety: 'BHP',
};

const POWER_LABELS: Readonly<Record<PowerSource, string>> = {
  manual: 'Ręczne',
  corded: 'Sieciowe',
  battery: 'Akumulatorowe',
  pneumatic: 'Pneumatyczne',
};

const CATEGORY_LABELS: Readonly<Record<string, string>> = {
  'power-tools': 'Elektronarzędzia',
  'hand-tools': 'Narzędzia ręczne',
  fasteners: 'Mocowania',
  measuring: 'Pomiarowe',
  safety: 'BHP',
  storage: 'Skrzynki / organizery',
};

function parseZlotyToCents(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return Math.round(value * 100);
  }
  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? Math.round(parsed * 100) : null;
  }
  return null;
}
