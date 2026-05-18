import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import {
  BOOK_FORMATS,
  BOOK_GENRES,
  BOOK_LANGUAGES,
  type BookFormat,
  type BookLanguage,
  BookstoreCatalogueService,
} from '@ai-studio/bookstore-data';

/** Bookstore-specific filter panel. Reuses `BookstoreCatalogueService`. */
@Component({
  selector: 'ais-bookstore-filter-panel',
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
          placeholder="Tytuł, autor, ISBN"
        />
      </mat-form-field>

      <mat-expansion-panel expanded>
        <mat-expansion-panel-header>
          <mat-panel-title>Gatunek</mat-panel-title>
        </mat-expansion-panel-header>
        <div class="gap-1 max-h-72 flex flex-col overflow-auto">
          @for (g of genres; track g) {
            <mat-checkbox
              [checked]="catalogue.filters().categories.has(g)"
              [attr.data-testid]="'filter-genre-' + g"
              (change)="toggleGenre(g)"
            >
              {{ genreLabel(g) }}
            </mat-checkbox>
          }
        </div>
      </mat-expansion-panel>

      <mat-expansion-panel>
        <mat-expansion-panel-header>
          <mat-panel-title>Język</mat-panel-title>
        </mat-expansion-panel-header>
        <div class="gap-2 flex flex-wrap">
          @for (l of languages; track l) {
            <mat-checkbox
              [checked]="catalogue.filters().languages.has(l)"
              [attr.data-testid]="'filter-language-' + l"
              (change)="toggleLanguage(l)"
            >
              {{ l.toUpperCase() }}
            </mat-checkbox>
          }
        </div>
      </mat-expansion-panel>

      <mat-expansion-panel>
        <mat-expansion-panel-header>
          <mat-panel-title>Format</mat-panel-title>
        </mat-expansion-panel-header>
        <div class="gap-1 flex flex-col">
          @for (f of formats; track f) {
            <mat-checkbox
              [checked]="catalogue.filters().formats.has(f)"
              [attr.data-testid]="'filter-format-' + f"
              (change)="toggleFormat(f)"
            >
              {{ formatLabel(f) }}
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
  protected readonly catalogue = inject(BookstoreCatalogueService);

  protected readonly genres = BOOK_GENRES;
  protected readonly languages = BOOK_LANGUAGES;
  protected readonly formats = BOOK_FORMATS;

  protected readonly minZl = computed(() => {
    const value = this.catalogue.filters().minPriceCents;
    return value === null ? null : Math.round(value / 100);
  });
  protected readonly maxZl = computed(() => {
    const value = this.catalogue.filters().maxPriceCents;
    return value === null ? null : Math.round(value / 100);
  });

  protected genreLabel(genre: string): string {
    return GENRE_LABELS[genre] ?? genre;
  }

  protected formatLabel(format: BookFormat): string {
    return FORMAT_LABELS[format];
  }

  protected toggleGenre(genre: string): void {
    const current = new Set(this.catalogue.filters().categories);
    if (current.has(genre)) {
      current.delete(genre);
    } else {
      current.add(genre);
    }
    this.catalogue.patchFilters({ categories: current });
  }

  protected toggleLanguage(language: BookLanguage): void {
    const current = new Set(this.catalogue.filters().languages);
    if (current.has(language)) {
      current.delete(language);
    } else {
      current.add(language);
    }
    this.catalogue.patchFilters({ languages: current });
  }

  protected toggleFormat(format: BookFormat): void {
    const current = new Set(this.catalogue.filters().formats);
    if (current.has(format)) {
      current.delete(format);
    } else {
      current.add(format);
    }
    this.catalogue.patchFilters({ formats: current });
  }

  protected setMin(value: unknown): void {
    this.catalogue.patchFilters({ minPriceCents: parseZlotyToCents(value) });
  }

  protected setMax(value: unknown): void {
    this.catalogue.patchFilters({ maxPriceCents: parseZlotyToCents(value) });
  }
}

const GENRE_LABELS: Readonly<Record<string, string>> = {
  fiction: 'Literatura',
  'non-fiction': 'Literatura faktu',
  fantasy: 'Fantasy',
  'sci-fi': 'Science fiction',
  mystery: 'Kryminał',
  biography: 'Biografia',
  history: 'Historia',
  science: 'Nauka',
  children: 'Dla dzieci',
  poetry: 'Poezja',
};

const FORMAT_LABELS: Readonly<Record<BookFormat, string>> = {
  hardcover: 'Twarda oprawa',
  paperback: 'Miękka oprawa',
  ebook: 'Ebook',
  audiobook: 'Audiobook',
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
