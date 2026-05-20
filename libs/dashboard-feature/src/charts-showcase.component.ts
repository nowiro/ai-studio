/**
 * Charts showcase route. Demonstrates each of the 5 wrappers in
 * `libs/charts` with representative sample data so designers, ops, and
 * incoming engineers can see the visual + accessibility contract at a
 * glance without spinning up the full dashboard data flow.
 *
 * Lazy-loaded from `/charts/showcase` — keeps the initial dashboard
 * bundle clean (ECharts is only pulled for this route plus the live
 * dashboard, both code-split).
 */
import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  BarChartComponent,
  type ChartAxis,
  type ChartHeatCell,
  type ChartSeries,
  type ChartSlice,
  GaugeChartComponent,
  HeatmapChartComponent,
  LineChartComponent,
  PieChartComponent,
} from '@ai-studio/charts';

const MONTHS = ['Sty', 'Lut', 'Mar', 'Kwi', 'Maj', 'Cze', 'Lip', 'Sie', 'Wrz', 'Paź', 'Lis', 'Gru'];
const DAYS = ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Nd'];

const LINE_AXIS: ChartAxis = { type: 'category', labels: MONTHS };
const LINE_SERIES: readonly ChartSeries[] = [
  {
    id: 'revenue',
    label: 'Przychód (tys. zł)',
    data: [42, 51, 49, 63, 71, 80, 95, 88, 76, 84, 92, 110],
    kind: 'area',
    unit: 'tys. zł',
  },
  {
    id: 'profit',
    label: 'Zysk (tys. zł)',
    data: [12, 16, 14, 22, 26, 29, 34, 30, 26, 28, 31, 41],
    kind: 'line',
    unit: 'tys. zł',
  },
];

const BAR_AXIS: ChartAxis = {
  type: 'category',
  labels: ['Mazowieckie', 'Małopolskie', 'Wielkopolskie', 'Śląskie', 'Pomorskie'],
};
const BAR_SERIES: readonly ChartSeries[] = [
  { id: 'q1', label: 'Q1 2026', data: [320, 240, 210, 280, 190], unit: 'tys.' },
  { id: 'q2', label: 'Q2 2026', data: [370, 280, 250, 310, 220], unit: 'tys.' },
];

const HBAR_AXIS: ChartAxis = {
  type: 'category',
  labels: ['Klocki LEGO', 'Lalka Barbie', 'Hot Wheels', 'Puzzle 1000', 'Gra planszowa'],
};
const HBAR_SERIES: readonly ChartSeries[] = [
  { id: 'units', label: 'Sprzedano (szt.)', data: [820, 740, 690, 510, 470], unit: 'szt.' },
];

const PIE_SLICES: readonly ChartSlice[] = [
  { id: 'books', label: 'Książki', value: 38 },
  { id: 'toys', label: 'Zabawki', value: 24 },
  { id: 'tools', label: 'Narzędzia', value: 18 },
  { id: 'tires', label: 'Opony', value: 12 },
  { id: 'other', label: 'Inne', value: 8 },
];

const HEAT_CELLS: readonly ChartHeatCell[] = buildHeatCells();

function buildHeatCells(): readonly ChartHeatCell[] {
  const result: ChartHeatCell[] = [];
  for (let row = 0; row < DAYS.length; row++) {
    for (let col = 0; col < 12; col++) {
      // Higher visits during business hours mid-week — deterministic so the
      // snapshot is stable across renders / tests.
      const base = col >= 4 && col <= 10 ? 60 : 20;
      const weekday = row < 5 ? 30 : 0;
      const noise = (row * 7 + col * 3) % 17;
      result.push({ row, col, value: base + weekday + noise });
    }
  }
  return result;
}

@Component({
  selector: 'ais-charts-showcase',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BarChartComponent, GaugeChartComponent, HeatmapChartComponent, LineChartComponent, PieChartComponent],
  host: { class: 'block min-h-screen' },
  styles: [
    `
      .page {
        max-width: 96rem;
        margin: 0 auto;
        padding: 1.5rem;
      }
      .intro {
        margin-bottom: 1.5rem;
      }
      .intro__eyebrow {
        font: var(--mat-sys-label-medium);
        color: var(--mat-sys-on-surface-variant);
        margin: 0 0 0.25rem;
      }
      .intro__title {
        font: var(--mat-sys-headline-medium);
        margin: 0 0 0.5rem;
      }
      .intro__lead {
        font: var(--mat-sys-body-medium);
        color: var(--mat-sys-on-surface-variant);
        max-width: 56rem;
        margin: 0;
      }
      .grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1rem;
      }
      @media (min-width: 768px) {
        .grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }
      @media (min-width: 1280px) {
        .grid {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
        .card--wide {
          grid-column: span 2;
        }
        .card--tall {
          grid-row: span 2;
        }
      }
      .card {
        background: var(--mat-sys-surface);
        border-radius: var(--mat-sys-corner-large);
        border: 1px solid var(--mat-sys-outline-variant);
        padding: 1.25rem;
      }
      .card__head {
        margin-bottom: 0.75rem;
      }
      .card__title {
        font: var(--mat-sys-title-medium);
        margin: 0;
      }
      .card__subtitle {
        font: var(--mat-sys-body-small);
        color: var(--mat-sys-on-surface-variant);
        margin: 0.125rem 0 0;
      }
      .card__chart {
        height: 18rem;
      }
      .card__chart--tall {
        height: 22rem;
      }
    `,
  ],
  template: `
    <main
      class="page"
      data-testid="charts-showcase"
    >
      <header class="intro">
        <p class="intro__eyebrow">libs/charts · 5 wrappers · ADR-0016</p>
        <h1 class="intro__title">Wykresy — galeria</h1>
        <p class="intro__lead">
          Każdy z 5 wrapperów (
          <code>line</code>
          ,
          <code>bar</code>
          ,
          <code>pie</code>
          ,
          <code>gauge</code>
          ,
          <code>heatmap</code>
          ) z reprezentatywnymi danymi. Wszystkie czytają tokeny Material 3 — przełącz motyw systemu, żeby zobaczyć
          rebrand bez przeładowania.
        </p>
      </header>

      <section class="grid">
        <article class="card card--wide">
          <header class="card__head">
            <h2 class="card__title">Trend przychodu vs zysku</h2>
            <p class="card__subtitle">Line + area, 2 serie, 12 miesięcy</p>
          </header>
          <div class="card__chart">
            <ais-line-chart
              [series]="lineSeries"
              [xAxis]="lineAxis"
              [smooth]="true"
              ariaLabel="Wykres liniowy trendu przychodu i zysku w 12 miesiącach"
              testId="showcase-line"
            />
          </div>
        </article>

        <article class="card">
          <header class="card__head">
            <h2 class="card__title">SLA</h2>
            <p class="card__subtitle">Gauge, 0–100%</p>
          </header>
          <div class="card__chart">
            <ais-gauge-chart
              [value]="98.7"
              label="SLA Q2"
              ariaLabel="Wskaźnik SLA 98.7 procent"
              testId="showcase-gauge"
            />
          </div>
        </article>

        <article class="card card--wide">
          <header class="card__head">
            <h2 class="card__title">Sprzedaż wg województwa</h2>
            <p class="card__subtitle">Bar, 2 serie (Q1 / Q2)</p>
          </header>
          <div class="card__chart">
            <ais-bar-chart
              [series]="barSeries"
              [categoryAxis]="barAxis"
              ariaLabel="Wykres słupkowy sprzedaży w 5 województwach"
              testId="showcase-bar"
            />
          </div>
        </article>

        <article class="card">
          <header class="card__head">
            <h2 class="card__title">Mix kategorii</h2>
            <p class="card__subtitle">Donut, 5 wycinków</p>
          </header>
          <div class="card__chart">
            <ais-pie-chart
              [slices]="pieSlices"
              variant="donut"
              ariaLabel="Wykres pierścieniowy udziału 5 kategorii"
              testId="showcase-pie"
            />
          </div>
        </article>

        <article class="card">
          <header class="card__head">
            <h2 class="card__title">Top 5 produktów</h2>
            <p class="card__subtitle">Horizontal bar</p>
          </header>
          <div class="card__chart">
            <ais-bar-chart
              [series]="hbarSeries"
              [categoryAxis]="hbarAxis"
              orientation="horizontal"
              ariaLabel="Poziomy wykres słupkowy 5 najlepiej sprzedających się produktów"
              testId="showcase-hbar"
            />
          </div>
        </article>

        <article class="card card--wide">
          <header class="card__head">
            <h2 class="card__title">Ruch w sklepie — godzina × dzień</h2>
            <p class="card__subtitle">Heatmap, 7 × 12, gradient primary → tertiary</p>
          </header>
          <div class="card__chart card__chart--tall">
            <ais-heatmap-chart
              [rows]="heatRows"
              [columns]="heatCols"
              [cells]="heatCells"
              [min]="0"
              [max]="100"
              unit=" wizyt"
              ariaLabel="Mapa cieplna ruchu w sklepie według godziny i dnia tygodnia"
              testId="showcase-heatmap"
            />
          </div>
        </article>
      </section>
    </main>
  `,
})
export class ChartsShowcaseComponent {
  protected readonly lineSeries = LINE_SERIES;
  protected readonly lineAxis = LINE_AXIS;
  protected readonly barSeries = BAR_SERIES;
  protected readonly barAxis = BAR_AXIS;
  protected readonly hbarSeries = HBAR_SERIES;
  protected readonly hbarAxis = HBAR_AXIS;
  protected readonly pieSlices = PIE_SLICES;
  protected readonly heatRows = DAYS;
  protected readonly heatCols = ['8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19'];
  protected readonly heatCells = HEAT_CELLS;
}
