import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { CatalogueService, EU_LABEL_GRADES, type EuLabelGrade, type TireSeason } from '@ai-studio/tire-data';
import { TireSizeInputComponent } from '@ai-studio/tire-ui';

const SEASON_OPTIONS: readonly { readonly value: TireSeason; readonly label: string }[] = [
  { value: 'summer', label: 'Letnie' },
  { value: 'winter', label: 'Zimowe' },
  { value: 'all-season', label: 'Całoroczne' },
];

@Component({
  selector: 'ais-filter-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    TireSizeInputComponent,
  ],
  template: `
    <aside
      class="gap-3 p-3 rounded flex flex-col bg-surface-container"
      data-testid="filter-panel"
    >
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold m-0">Filtry</h2>
        <button
          (click)="reset()"
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
          [ngModel]="query()"
          (ngModelChange)="setQuery($event)"
          matInput
          data-testid="filter-query"
          placeholder="np. Continental 205/55"
        />
      </mat-form-field>

      <mat-expansion-panel expanded>
        <mat-expansion-panel-header>
          <mat-panel-title>Rozmiar</mat-panel-title>
        </mat-expansion-panel-header>
        <ais-tire-size-input
          [width]="filters().width"
          [profile]="filters().profile"
          [diameter]="filters().diameter"
          (widthChange)="patch({ width: $event })"
          (profileChange)="patch({ profile: $event })"
          (diameterChange)="patch({ diameter: $event })"
        />
      </mat-expansion-panel>

      <mat-expansion-panel>
        <mat-expansion-panel-header>
          <mat-panel-title>Sezon</mat-panel-title>
        </mat-expansion-panel-header>
        <div class="gap-2 flex flex-col">
          @for (season of seasonOptions; track season.value) {
            <mat-checkbox
              [checked]="filters().seasons.has(season.value)"
              [attr.data-testid]="'filter-season-' + season.value"
              (change)="toggleSeason(season.value)"
            >
              {{ season.label }}
            </mat-checkbox>
          }
        </div>
      </mat-expansion-panel>

      <mat-expansion-panel>
        <mat-expansion-panel-header>
          <mat-panel-title>Marka</mat-panel-title>
        </mat-expansion-panel-header>
        <div class="gap-2 max-h-72 flex flex-col overflow-auto">
          @for (entry of brandList(); track entry.brand) {
            <mat-checkbox
              [checked]="filters().brands.has(entry.brand)"
              [attr.data-testid]="'filter-brand-' + entry.brand.toLowerCase()"
              (change)="toggleBrand(entry.brand)"
            >
              {{ entry.brand }} ({{ entry.count }})
            </mat-checkbox>
          }
        </div>
      </mat-expansion-panel>

      <mat-expansion-panel>
        <mat-expansion-panel-header>
          <mat-panel-title>EU label — paliwo</mat-panel-title>
        </mat-expansion-panel-header>
        <div class="gap-2 flex flex-wrap">
          @for (grade of euGrades; track grade) {
            <mat-checkbox
              [checked]="filters().euFuel.has(grade)"
              [attr.data-testid]="'filter-eu-fuel-' + grade"
              (change)="toggleFuel(grade)"
            >
              {{ grade }}
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
              [ngModel]="minPriceZl()"
              (ngModelChange)="setMinPrice($event)"
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
              [ngModel]="maxPriceZl()"
              (ngModelChange)="setMaxPrice($event)"
              matInput
              type="number"
              data-testid="filter-max-price"
            />
          </mat-form-field>
        </div>
      </mat-expansion-panel>

      <mat-checkbox
        [checked]="filters().inStockOnly"
        (change)="patch({ inStockOnly: !filters().inStockOnly })"
        data-testid="filter-in-stock"
      >
        Tylko w magazynie
      </mat-checkbox>
    </aside>
  `,
})
export class FilterPanelComponent {
  private readonly catalogue = inject(CatalogueService);
  protected readonly seasonOptions = SEASON_OPTIONS;
  protected readonly euGrades = EU_LABEL_GRADES;

  protected readonly filters = this.catalogue.filters;
  protected readonly query = computed(() => this.catalogue.filters().query);
  protected readonly brandList = computed(() =>
    [...this.catalogue.facets().brandCounts.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([brand, count]) => ({ brand, count })),
  );
  protected readonly minPriceZl = computed(() => {
    const value = this.catalogue.filters().minPriceCents;
    return value === null ? null : Math.round(value / 100);
  });
  protected readonly maxPriceZl = computed(() => {
    const value = this.catalogue.filters().maxPriceCents;
    return value === null ? null : Math.round(value / 100);
  });

  protected reset(): void {
    this.catalogue.resetFilters();
  }

  protected setQuery(value: string): void {
    this.catalogue.patchFilters({ query: value });
  }

  protected toggleSeason(season: TireSeason): void {
    const current = new Set(this.catalogue.filters().seasons);
    if (current.has(season)) {
      current.delete(season);
    } else {
      current.add(season);
    }
    this.catalogue.patchFilters({ seasons: current });
  }

  protected toggleBrand(brand: string): void {
    const current = new Set(this.catalogue.filters().brands);
    if (current.has(brand)) {
      current.delete(brand);
    } else {
      current.add(brand);
    }
    this.catalogue.patchFilters({ brands: current });
  }

  protected toggleFuel(grade: EuLabelGrade): void {
    const current = new Set(this.catalogue.filters().euFuel);
    if (current.has(grade)) {
      current.delete(grade);
    } else {
      current.add(grade);
    }
    this.catalogue.patchFilters({ euFuel: current });
  }

  protected setMinPrice(value: unknown): void {
    this.patch({ minPriceCents: parseZlotyToCents(value) });
  }

  protected setMaxPrice(value: unknown): void {
    this.patch({ maxPriceCents: parseZlotyToCents(value) });
  }

  protected patch(patch: Parameters<CatalogueService['patchFilters']>[0]): void {
    this.catalogue.patchFilters(patch);
  }
}

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
