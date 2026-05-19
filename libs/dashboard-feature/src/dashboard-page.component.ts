/**
 * Dashboard page — renders the KPI strip + 5 chart panels.
 *
 * v1 ships with **table-style placeholders** for the chart bodies. Phase 3.5
 * of the consolidated roadmap swaps them for `<ngx-charts-*>` after
 * `@swimlane/ngx-charts` is installed. The data pipeline + signals are
 * unchanged across the swap — only the panel templates change.
 *
 * @packageDocumentation
 */
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

import { DashboardService } from '@ai-studio/dashboard-data';

import { KpiTileComponent } from './kpi-tile.component.js';

const PLN = new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN', maximumFractionDigits: 0 });

@Component({
  selector: 'ais-dashboard-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [KpiTileComponent, MatButtonModule, MatIconModule, MatToolbarModule],
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
      .panel__placeholder-note {
        font: var(--mat-sys-label-small);
        color: var(--mat-sys-on-surface-variant);
        margin: 0;
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
        (click)="dashboard.refresh()"
        matButton
        data-testid="dashboard-refresh"
      >
        <mat-icon>refresh</mat-icon>
        Odśwież
      </button>
    </mat-toolbar>

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
            <p class="panel__placeholder-note">Bar chart — ngx-charts po Phase 3.5</p>
          </header>
          <table class="table">
            <thead>
              <tr>
                <th>Sklep</th>
                <th class="num">Przychód</th>
              </tr>
            </thead>
            <tbody>
              @for (row of dashboard.revenue(); track row.shop) {
                <tr>
                  <td>{{ row.label }}</td>
                  <td class="num">{{ formatPln(row.revenueCents) }}</td>
                </tr>
              }
            </tbody>
          </table>
        </article>

        <article
          class="panel"
          data-testid="panel-top-products"
        >
          <header class="panel__head">
            <h3 class="panel__title">Top produkty</h3>
            <p class="panel__placeholder-note">Horizontal bar — ngx-charts po Phase 3.5</p>
          </header>
          <table class="table">
            <thead>
              <tr>
                <th>Produkt</th>
                <th>Sklep</th>
                <th class="num">Sprzedano</th>
              </tr>
            </thead>
            <tbody>
              @for (row of dashboard.topProducts(); track row.productId) {
                <tr>
                  <td>{{ row.productName }}</td>
                  <td>{{ row.shop }}</td>
                  <td class="num">{{ row.unitsSold }}</td>
                </tr>
              }
            </tbody>
          </table>
        </article>

        <article
          class="panel"
          data-testid="panel-low-stock"
        >
          <header class="panel__head">
            <h3 class="panel__title">Niski stan magazynu</h3>
            <p class="panel__placeholder-note">Color-coded table</p>
          </header>
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
        </article>

        <article
          class="panel"
          data-testid="panel-daily-orders"
        >
          <header class="panel__head">
            <h3 class="panel__title">Zamówienia dziennie</h3>
            <p class="panel__placeholder-note">Line chart — ngx-charts po Phase 3.5</p>
          </header>
          <table class="table">
            <thead>
              <tr>
                <th>Data</th>
                <th class="num">Liczba</th>
              </tr>
            </thead>
            <tbody>
              @for (row of dashboard.dailyOrders(); track row.day) {
                <tr>
                  <td>{{ row.day }}</td>
                  <td class="num">{{ row.count }}</td>
                </tr>
              }
            </tbody>
          </table>
        </article>

        <article
          class="panel panel--wide"
          data-testid="panel-category-mix"
        >
          <header class="panel__head">
            <h3 class="panel__title">Mix kategorii</h3>
            <p class="panel__placeholder-note">Donut — ngx-charts po Phase 3.5</p>
          </header>
          <table class="table">
            <thead>
              <tr>
                <th>Kategoria</th>
                <th class="num">Liczba sztuk</th>
              </tr>
            </thead>
            <tbody>
              @for (row of dashboard.categoryMix(); track row.category) {
                <tr>
                  <td>{{ row.category }}</td>
                  <td class="num">{{ row.count }}</td>
                </tr>
              }
            </tbody>
          </table>
        </article>
      </section>
    </main>
  `,
})
export class DashboardPageComponent {
  protected readonly dashboard = inject(DashboardService);
  protected readonly String = String;

  protected readonly totalRevenue = computed(() =>
    this.dashboard.revenue().reduce((sum, row) => sum + row.revenueCents, 0),
  );

  protected readonly totalOrders = computed(() =>
    this.dashboard.dailyOrders().reduce((sum, row) => sum + row.count, 0),
  );

  protected readonly topShopLabel = computed(() => this.dashboard.revenue()[0]?.label ?? '—');

  protected formatPln(cents: number): string {
    return PLN.format(cents / 100);
  }
}
