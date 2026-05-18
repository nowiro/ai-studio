import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { AGE_GROUPS, type AgeGroup, TOY_CATEGORIES, ToyShopCatalogueService } from '@ai-studio/toy-shop-data';

@Component({
  selector: 'ais-toy-shop-filter-panel',
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
          placeholder="Lego, jednorożec, puzzle"
        />
      </mat-form-field>

      <mat-expansion-panel expanded>
        <mat-expansion-panel-header>
          <mat-panel-title>Kategoria</mat-panel-title>
        </mat-expansion-panel-header>
        <div class="gap-1 max-h-72 flex flex-col overflow-auto">
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
          <mat-panel-title>Wiek</mat-panel-title>
        </mat-expansion-panel-header>
        <div class="gap-1 flex flex-col">
          @for (a of ageGroups; track a) {
            <mat-checkbox
              [checked]="catalogue.filters().ageGroups.has(a)"
              [attr.data-testid]="'filter-age-' + a"
              (change)="toggleAge(a)"
            >
              {{ ageLabel(a) }}
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
        [checked]="catalogue.filters().batteryFreeOnly"
        (change)="catalogue.patchFilters({ batteryFreeOnly: !catalogue.filters().batteryFreeOnly })"
        data-testid="filter-battery-free"
      >
        Bez baterii
      </mat-checkbox>

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
  protected readonly catalogue = inject(ToyShopCatalogueService);

  protected readonly categories = TOY_CATEGORIES;
  protected readonly ageGroups = AGE_GROUPS;

  protected readonly minZl = computed(() => {
    const value = this.catalogue.filters().minPriceCents;
    return value === null ? null : Math.round(value / 100);
  });
  protected readonly maxZl = computed(() => {
    const value = this.catalogue.filters().maxPriceCents;
    return value === null ? null : Math.round(value / 100);
  });

  protected ageLabel(age: AgeGroup): string {
    return AGE_LABELS[age];
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

  protected toggleAge(age: AgeGroup): void {
    const current = new Set(this.catalogue.filters().ageGroups);
    if (current.has(age)) {
      current.delete(age);
    } else {
      current.add(age);
    }
    this.catalogue.patchFilters({ ageGroups: current });
  }

  protected setMin(value: unknown): void {
    this.catalogue.patchFilters({ minPriceCents: parseZlotyToCents(value) });
  }

  protected setMax(value: unknown): void {
    this.catalogue.patchFilters({ maxPriceCents: parseZlotyToCents(value) });
  }
}

const AGE_LABELS: Readonly<Record<AgeGroup, string>> = {
  '0-2': '0–2 lata',
  '3-5': '3–5 lat',
  '6-8': '6–8 lat',
  '9-12': '9–12 lat',
  '13+': '13+',
};

const CATEGORY_LABELS: Readonly<Record<string, string>> = {
  building: 'Klocki',
  dolls: 'Lalki',
  vehicles: 'Pojazdy',
  plush: 'Pluszaki',
  'board-games': 'Gry planszowe',
  puzzles: 'Puzzle',
  'arts-crafts': 'Plastyka',
  outdoor: 'Na świeżym powietrzu',
  educational: 'Edukacyjne',
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
