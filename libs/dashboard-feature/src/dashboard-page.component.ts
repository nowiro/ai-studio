/**
 * Dashboard page — KPI strip + 4 chart panels + 1 colour-coded table.
 *
 * Charts use the `libs/charts` wrappers (`ais-bar-chart`, `ais-line-chart`,
 * `ais-pie-chart`) — backed by Apache ECharts today, swappable per ADR-0016
 * without touching this file. The `lowStock` panel stays a table because
 * the data is genuinely tabular (label + threshold + badge).
 *
 * @packageDocumentation
 */
import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';

import { timer } from 'rxjs';

import {
  BarChartComponent,
  type ChartAxis,
  type ChartSeries,
  type ChartSlice,
  LineChartComponent,
  PieChartComponent,
} from '@ai-studio/charts';
import { DashboardService } from '@ai-studio/dashboard-data';

import { KpiTileComponent } from './kpi-tile.component.js';

const PLN = new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN', maximumFractionDigits: 0 });

@Component({
  selector: 'ais-dashboard-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BarChartComponent,
    KpiTileComponent,
    LineChartComponent,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatToolbarModule,
    PieChartComponent,
  ],
  host: { class: 'block min-h-screen' },
  styles: [
    `
      :host {
        display: block;
      }
      .topbar {
        background: var(--mat-sys-primary);
        color: var(--mat-sys-on-primary);
        gap: 0.75rem;
        box-shadow: var(--mat-sys-level1);
      }
      /* Button sits on the primary-tinted toolbar — force on-primary for WCAG AA contrast
         (default button label is on-surface, ~2.67:1 on the teal toolbar). */
      .topbar button {
        --mdc-text-button-label-text-color: var(--mat-sys-on-primary);
        --mat-icon-color: var(--mat-sys-on-primary);
        color: var(--mat-sys-on-primary);
      }
      .topbar__brand {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 500;
      }
      .topbar__spacer {
        flex: 1;
      }
      .page {
        max-width: 96rem;
        margin: 0 auto;
        padding: 1.5rem;
      }
      .progress {
        margin-bottom: 1.25rem;
        height: 2px;
      }
      .kpi-row {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1rem;
        margin-bottom: 1.5rem;
      }
      @media (min-width: 640px) {
        .kpi-row {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }
      @media (min-width: 1024px) {
        .kpi-row {
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }
      }
      .panels {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1rem;
      }
      @media (min-width: 1024px) {
        .panels {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        .panel--wide {
          grid-column: 1 / -1;
        }
      }
      .panel {
        background: var(--mat-sys-surface);
        border-radius: var(--mat-sys-corner-large);
        border: 1px solid var(--mat-sys-outline-variant);
        padding: 1.25rem;
      }
      .panel__head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.5rem;
        margin-bottom: 0.75rem;
      }
      .panel__title {
        font: var(--mat-sys-title-medium);
        margin: 0;
      }
      .panel__chart {
        height: 18rem;
      }
      .panel__chart--tall {
        height: 22rem;
      }
      .table {
        width: 100%;
        border-collapse: collapse;
      }
      .table th,
      .table td {
        text-align: left;
        padding: 0.5rem 0.75rem;
        border-bottom: 1px solid var(--mat-sys-outline-variant);
      }
      .table th {
        font: var(--mat-sys-label-small);
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--mat-sys-on-surface-variant);
      }
      .table td.num {
        text-align: right;
        font-variant-numeric: tabular-nums;
      }
      .badge {
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
        padding: 0.125rem 0.5rem;
        border-radius: 9999px;
        font: var(--mat-sys-label-small);
        font-weight: 600;
      }
      .badge--low {
        background: var(--mat-sys-error-container);
        color: var(--mat-sys-on-error-container);
      }
      .empty {
        padding: 2rem 1rem;
        text-align: center;
        color: var(--mat-sys-on-surface-variant);
        font: var(--mat-sys-body-small);
      }
    `,
  ],
  template: `
    <mat-toolbar class="topbar">
      <span class="topbar__brand">
        <mat-icon>insights</mat-icon>
        AI Studio · Dashboard
      </span>
      <span class="topbar__spacer"></span>
      <button
        [disabled]="loading()"
        (click)="onRefresh()"
        matButton
        data-testid="dashboard-refresh"
      >
        <mat-icon>refresh</mat-icon>
        {{ loading() ? 'Odświeżanie…' : 'Odśwież' }}
      </button>
    </mat-toolbar>

    @if (loading()) {
      <mat-progress-bar
        class="progress"
        mode="indeterminate"
        aria-label="Ładowanie danych"
        data-testid="dashboard-progress"
      />
    }

    <main
      class="page"
      data-testid="dashboard-page"
    >
      <section class="kpi-row">
        <ais-kpi-tile
          id="gross-revenue"
          [value]="formatPln(totalRevenue())"
          [delta]="12.4"
          label="Łączny przychód"
          icon="payments"
        />
        <ais-kpi-tile
          id="orders-today"
          [value]="String(totalOrders())"
          [delta]="-3.2"
          label="Liczba zamówień"
          icon="receipt_long"
        />
        <ais-kpi-tile
          id="top-shop"
          [value]="topShopLabel()"
          [delta]="null"
          label="Najlepszy sklep"
          icon="emoji_events"
        />
        <ais-kpi-tile
          id="low-stock-count"
          [value]="String(dashboard.lowStock().length)"
          [delta]="null"
          label="Niski stan magazynu"
          icon="warning_amber"
        />
      </section>

      <section class="panels">
        <article
          class="panel"
          data-testid="panel-revenue"
        >
          <header class="panel__head">
            <h3 class="panel__title">Przychód wg sklepu</h3>
          </header>
          @if (revenueSeries().length > 0 && revenueAxis().labels?.length) {
            <div class="panel__chart">
              <ais-bar-chart
                [series]="revenueSeries()"
                [categoryAxis]="revenueAxis()"
                ariaLabel="Wykres słupkowy przychodu wg sklepu"
                testId="chart-revenue"
              />
            </div>
          } @else {
            <p class="empty">Brak danych o przychodzie.</p>
          }
        </article>

        <article
          class="panel"
          data-testid="panel-top-products"
        >
          <header class="panel__head">
            <h3 class="panel__title">Top produkty</h3>
          </header>
          @if (topProductsSeries().length > 0 && topProductsAxis().labels?.length) {
            <div class="panel__chart">
              <ais-bar-chart
                [series]="topProductsSeries()"
                [categoryAxis]="topProductsAxis()"
                orientation="horizontal"
                ariaLabel="Poziomy wykres słupkowy najlepiej sprzedających się produktów"
                testId="chart-top-products"
              />
            </div>
          } @else {
            <p class="empty">Brak top produktów do pokazania.</p>
          }
        </article>

        <article
          class="panel"
          data-testid="panel-low-stock"
        >
          <header class="panel__head">
            <h3 class="panel__title">Niski stan magazynu</h3>
          </header>
          @if (dashboard.lowStock().length > 0) {
            <table class="table">
              <thead>
                <tr>
                  <th>Produkt</th>
                  <th>Sklep</th>
                  <th class="num">Stan</th>
                </tr>
              </thead>
              <tbody>
                @for (row of dashboard.lowStock(); track row.productId) {
                  <tr>
                    <td>{{ row.productName }}</td>
                    <td>{{ row.shop }}</td>
                    <td class="num">
                      <span class="badge badge--low">{{ row.stock }} / {{ row.threshold }}</span>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          } @else {
            <p class="empty">Żaden produkt nie ma stanu poniżej progu.</p>
          }
        </article>

        <article
          class="panel"
          data-testid="panel-daily-orders"
        >
          <header class="panel__head">
            <h3 class="panel__title">Zamówienia dziennie</h3>
          </header>
          @if (dailyOrdersSeries().length > 0 && dailyOrdersAxis().labels?.length) {
            <div class="panel__chart">
              <ais-line-chart
                [series]="dailyOrdersSeries()"
                [xAxis]="dailyOrdersAxis()"
                [smooth]="true"
                ariaLabel="Wykres liniowy dziennej liczby zamówień"
                testId="chart-daily-orders"
              />
            </div>
          } @else {
            <p class="empty">Brak danych historycznych.</p>
          }
        </article>

        <article
          class="panel panel--wide"
          data-testid="panel-category-mix"
        >
          <header class="panel__head">
            <h3 class="panel__title">Mix kategorii</h3>
          </header>
          @if (categorySlices().length > 0) {
            <div class="panel__chart panel__chart--tall">
              <ais-pie-chart
                [slices]="categorySlices()"
                variant="donut"
                ariaLabel="Wykres pierścieniowy udziału kategorii"
                testId="chart-category-mix"
              />
            </div>
          } @else {
            <p class="empty">Brak danych o kategoriach.</p>
          }
        </article>
      </section>
    </main>
  `,
})
export class DashboardPageComponent {
  protected readonly dashboard = inject(DashboardService);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly String = String;

  /** Demo-only loading state, surfaced on initial visit and on every refresh click. */
  protected readonly loading = signal(true);

  protected readonly totalRevenue = computed(() =>
    this.dashboard.revenue().reduce((sum, row) => sum + row.revenueCents, 0),
  );

  protected readonly totalOrders = computed(() =>
    this.dashboard.dailyOrders().reduce((sum, row) => sum + row.count, 0),
  );

  protected readonly topShopLabel = computed(() => this.dashboard.revenue()[0]?.label ?? '—');

  // ── Chart-shape projections ─────────────────────────────────────────────

  protected readonly revenueAxis = computed<ChartAxis>(() => ({
    type: 'category',
    labels: this.dashboard.revenue().map((row) => row.label),
  }));

  protected readonly revenueSeries = computed<readonly ChartSeries[]>(() => [
    {
      id: 'revenue',
      label: 'Przychód (PLN)',
      data: this.dashboard.revenue().map((row) => Math.round(row.revenueCents / 100)),
      unit: 'zł',
    },
  ]);

  protected readonly topProductsAxis = computed<ChartAxis>(() => ({
    type: 'category',
    // Horizontal bar: reverse so the highest seller sits at the top of the chart.
    labels: [...this.dashboard.topProducts()].reverse().map((row) => row.productName),
  }));

  protected readonly topProductsSeries = computed<readonly ChartSeries[]>(() => [
    {
      id: 'units-sold',
      label: 'Sprzedano',
      data: [...this.dashboard.topProducts()].reverse().map((row) => row.unitsSold),
      unit: 'szt.',
    },
  ]);

  protected readonly dailyOrdersAxis = computed<ChartAxis>(() => ({
    type: 'category',
    labels: this.dashboard.dailyOrders().map((row) => row.day),
  }));

  protected readonly dailyOrdersSeries = computed<readonly ChartSeries[]>(() => [
    {
      id: 'orders',
      label: 'Zamówienia',
      data: this.dashboard.dailyOrders().map((row) => row.count),
      kind: 'area',
      unit: 'szt.',
    },
  ]);

  protected readonly categorySlices = computed<readonly ChartSlice[]>(() =>
    this.dashboard.categoryMix().map((row) => ({
      id: row.category,
      label: row.category,
      value: row.count,
    })),
  );

  constructor() {
    this.simulateFetch();
  }

  protected onRefresh(): void {
    this.dashboard.refresh();
    this.simulateFetch();
  }

  protected formatPln(cents: number): string {
    return PLN.format(cents / 100);
  }

  /** Flip `loading` true for 500 ms so the progress bar is visible during refreshes. */
  private simulateFetch(): void {
    this.loading.set(true);
    timer(500)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.loading.set(false));
  }
}
