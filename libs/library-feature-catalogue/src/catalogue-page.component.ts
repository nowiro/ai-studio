import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, type PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';

import {
  type Book,
  BOOK_GENRES,
  BOOK_LANGUAGES,
  BOOK_SORT_KEYS,
  type BookGenre,
  type BookLanguage,
  type BookSortKey,
  CatalogueService,
  LoansService,
} from '@ai-studio/library-data';
import { AvailabilityChipComponent } from '@ai-studio/library-ui';

const DEFAULT_PAGE_SIZE = 10;
const SORT_LABELS: Readonly<Record<BookSortKey, string>> = {
  'title-asc': 'Tytuł: A–Z',
  'title-desc': 'Tytuł: Z–A',
  'author-asc': 'Autor: A–Z',
  'year-desc': 'Rok: malejąco',
  'year-asc': 'Rok: rosnąco',
};

@Component({
  selector: 'ais-catalogue-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AvailabilityChipComponent,
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSelectModule,
    MatTableModule,
  ],
  template: `
    <section
      class="p-4 max-w-6xl gap-4 mx-auto flex flex-col"
      data-testid="catalogue-page"
    >
      <header class="gap-2 flex flex-wrap items-center justify-between">
        <h1
          class="text-2xl font-semibold m-0"
          data-testid="catalogue-heading"
        >
          Katalog ({{ results().length }})
        </h1>
        <mat-form-field
          class="min-w-64"
          appearance="outline"
          subscriptSizing="dynamic"
        >
          <mat-label>Sortuj</mat-label>
          <mat-select
            [value]="catalogue.sort()"
            (valueChange)="setSort($event)"
            data-testid="catalogue-sort"
          >
            @for (key of sortKeys; track key) {
              <mat-option [value]="key">{{ labelOf(key) }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
      </header>

      <div class="gap-4 md:grid-cols-[16rem_1fr] grid">
        <aside
          class="gap-3 p-3 rounded flex flex-col bg-surface-container"
          data-testid="catalogue-filters"
        >
          <mat-form-field
            appearance="outline"
            subscriptSizing="dynamic"
          >
            <mat-label>Szukaj</mat-label>
            <input
              [ngModel]="catalogue.filters().query"
              (ngModelChange)="setQuery($event)"
              matInput
              data-testid="catalogue-query"
              placeholder="Tytuł, autor, ISBN"
            />
          </mat-form-field>

          <div>
            <h3 class="m-0 mb-1 text-sm font-semibold">Gatunek</h3>
            <div class="gap-1 flex flex-wrap">
              @for (g of genres; track g) {
                <mat-checkbox
                  [checked]="catalogue.filters().genres.has(g)"
                  [attr.data-testid]="'filter-genre-' + g"
                  (change)="toggleGenre(g)"
                >
                  {{ genreLabel(g) }}
                </mat-checkbox>
              }
            </div>
          </div>

          <div>
            <h3 class="m-0 mb-1 text-sm font-semibold">Język</h3>
            <div class="gap-1 flex flex-wrap">
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
          </div>

          <mat-checkbox
            [checked]="catalogue.filters().availableOnly"
            (change)="toggleAvailableOnly()"
            data-testid="filter-available-only"
          >
            Tylko dostępne
          </mat-checkbox>

          <button
            (click)="resetFilters()"
            matButton
            type="button"
            data-testid="catalogue-reset"
          >
            Wyczyść filtry
          </button>
        </aside>

        @if (results().length === 0) {
          <div
            class="gap-2 py-12 flex flex-col items-center text-center text-on-surface-variant"
            data-testid="catalogue-empty"
          >
            <span class="material-symbols-outlined text-5xl">menu_book</span>
            <p class="m-0">Brak książek spełniających kryteria.</p>
          </div>
        } @else {
          <div
            class="overflow-x-auto"
            data-testid="catalogue-table-wrapper"
          >
            <table
              [dataSource]="pageRows()"
              class="w-full"
              mat-table
              data-testid="catalogue-table"
            >
              <ng-container matColumnDef="title">
                <th
                  *matHeaderCellDef
                  mat-header-cell
                >
                  Tytuł
                </th>
                <td
                  *matCellDef="let row"
                  mat-cell
                >
                  <a
                    [attr.data-testid]="'book-link-' + row.id"
                    (click)="open(row)"
                    (keydown.enter)="open(row)"
                    class="font-semibold cursor-pointer hover:underline"
                    tabindex="0"
                    role="link"
                  >
                    {{ row.title }}
                  </a>
                </td>
              </ng-container>
              <ng-container matColumnDef="author">
                <th
                  *matHeaderCellDef
                  mat-header-cell
                >
                  Autor
                </th>
                <td
                  *matCellDef="let row"
                  mat-cell
                >
                  {{ row.author }}
                </td>
              </ng-container>
              <ng-container matColumnDef="year">
                <th
                  *matHeaderCellDef
                  mat-header-cell
                >
                  Rok
                </th>
                <td
                  *matCellDef="let row"
                  mat-cell
                >
                  {{ row.publishedYear }}
                </td>
              </ng-container>
              <ng-container matColumnDef="genre">
                <th
                  *matHeaderCellDef
                  mat-header-cell
                >
                  Gatunek
                </th>
                <td
                  *matCellDef="let row"
                  mat-cell
                >
                  <mat-chip class="!text-xs">{{ genreLabel(row.genre) }}</mat-chip>
                </td>
              </ng-container>
              <ng-container matColumnDef="availability">
                <th
                  *matHeaderCellDef
                  mat-header-cell
                >
                  Dostępność
                </th>
                <td
                  *matCellDef="let row"
                  mat-cell
                >
                  <ais-availability-chip
                    [free]="availabilityFor(row.id).free"
                    [total]="availabilityFor(row.id).total"
                  />
                </td>
              </ng-container>
              <tr
                *matHeaderRowDef="displayedColumns"
                mat-header-row
              ></tr>
              <tr
                *matRowDef="let row; columns: displayedColumns"
                mat-row
              ></tr>
            </table>

            <mat-paginator
              [length]="results().length"
              [pageSize]="pageSize()"
              [pageIndex]="pageIndex()"
              [pageSizeOptions]="[10, 25, 50]"
              (page)="onPage($event)"
              data-testid="catalogue-paginator"
            />
          </div>
        }
      </div>
    </section>
  `,
})
export class CataloguePageComponent {
  protected readonly catalogue = inject(CatalogueService);
  private readonly loans = inject(LoansService);
  private readonly router = inject(Router);

  protected readonly genres = BOOK_GENRES;
  protected readonly languages = BOOK_LANGUAGES;
  protected readonly sortKeys = BOOK_SORT_KEYS;
  protected readonly displayedColumns = ['title', 'author', 'year', 'genre', 'availability'];

  protected readonly results = this.catalogue.filtered;

  protected readonly pageIndex = signal(0);
  protected readonly pageSize = signal(DEFAULT_PAGE_SIZE);

  protected readonly pageRows = computed<readonly Book[]>(() => {
    const start = this.pageIndex() * this.pageSize();
    return this.results().slice(start, start + this.pageSize());
  });

  protected genreLabel(genre: BookGenre): string {
    return GENRE_LABELS[genre];
  }

  protected labelOf(key: BookSortKey): string {
    return SORT_LABELS[key];
  }

  protected setSort(key: BookSortKey): void {
    this.catalogue.setSort(key);
  }

  protected setQuery(value: string): void {
    this.catalogue.patchFilters({ query: value });
    this.pageIndex.set(0);
  }

  protected toggleGenre(genre: BookGenre): void {
    const current = new Set(this.catalogue.filters().genres);
    if (current.has(genre)) {
      current.delete(genre);
    } else {
      current.add(genre);
    }
    this.catalogue.patchFilters({ genres: current });
    this.pageIndex.set(0);
  }

  protected toggleLanguage(language: BookLanguage): void {
    const current = new Set(this.catalogue.filters().languages);
    if (current.has(language)) {
      current.delete(language);
    } else {
      current.add(language);
    }
    this.catalogue.patchFilters({ languages: current });
    this.pageIndex.set(0);
  }

  protected toggleAvailableOnly(): void {
    this.catalogue.patchFilters({ availableOnly: !this.catalogue.filters().availableOnly });
    this.pageIndex.set(0);
  }

  protected resetFilters(): void {
    this.catalogue.resetFilters();
    this.pageIndex.set(0);
  }

  protected availabilityFor(bookId: string): { readonly free: number; readonly total: number } {
    return this.loans.availability().get(bookId) ?? { free: 0, total: 0 };
  }

  protected onPage(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  protected open(book: Book): void {
    void this.router.navigate(['/book', book.id]);
  }
}

const GENRE_LABELS: Readonly<Record<BookGenre, string>> = {
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
