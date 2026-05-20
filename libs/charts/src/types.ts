/**
 * Public, library-agnostic shapes consumed by `libs/charts` wrappers.
 *
 * Consumers in `apps/*` and `libs/!(charts)/**` import ONLY these types —
 * not anything from `echarts/*`. The wrapper components do the mapping
 * to ECharts' option object inside `libs/charts` so that swapping the
 * backend later (Chart.js, D3, Highcharts, …) stays a single-library
 * change. See ADR-0016 for the full rationale.
 */

/**
 * One data series rendered on a cartesian / radial chart. Generic over
 * the numeric primitive — usually `number`, can be a tuple (`[x, y]`)
 * for sparse / time-series data, or a record for grouped data.
 */
export interface ChartSeries<T = number> {
  /** Stable identifier — used by trackBy and chart updates. */
  readonly id: string;
  /** Human-readable legend label (already localised by the caller). */
  readonly label: string;
  /** Series values, in the order matching the chart's primary axis. */
  readonly data: readonly T[];
  /** Visual kind. Per-series override; falls back to the wrapper's default. */
  readonly kind?: 'line' | 'bar' | 'area';
  /**
   * Optional CSS colour. When omitted the chart picks a colour from the
   * Material 3 palette (primary, tertiary, secondary, surface-variant, error).
   */
  readonly color?: string;
  /** When true the series is initially hidden — toggleable via legend. */
  readonly hidden?: boolean;
  /** Optional unit suffix shown in tooltips (e.g. `"zł"`, `"%"`, `"szt."`). */
  readonly unit?: string;
}

/** Cartesian axis description — used by line, bar and area wrappers. */
export interface ChartAxis {
  readonly type: 'category' | 'value' | 'time';
  /** Category labels when `type: 'category'`. */
  readonly labels?: readonly string[];
  /** Display format for tick labels. Wrapper-specific defaults apply. */
  readonly format?: 'integer' | 'decimal' | 'currency' | 'percent' | 'date';
  /** Optional axis caption — drawn below / next to the axis. */
  readonly name?: string;
  /** Tick lower bound (`'auto'` lets the chart decide). */
  readonly min?: number | 'auto';
  /** Tick upper bound. */
  readonly max?: number | 'auto';
}

/** Pie / donut / radar slice. */
export interface ChartSlice {
  readonly id: string;
  readonly label: string;
  readonly value: number;
  readonly color?: string;
}

/** Heatmap cell — one row × col intersection. */
export interface ChartHeatCell {
  readonly row: number;
  readonly col: number;
  readonly value: number;
}

/** Legend configuration shared by all wrapper components. */
export interface ChartLegend {
  readonly visible?: boolean;
  readonly position?: 'top' | 'bottom' | 'left' | 'right';
}

/** Tooltip configuration shared by all wrapper components. */
export interface ChartTooltip {
  readonly visible?: boolean;
  /** Override the default `${label}: ${value}${unit}` format. */
  readonly formatter?: (point: ChartTooltipPoint) => string;
}

/** Payload handed to `ChartTooltip.formatter`. */
export interface ChartTooltipPoint {
  readonly seriesId: string;
  readonly seriesLabel: string;
  readonly category: string | number;
  readonly value: number;
  readonly unit?: string;
}

/** Read-only theme snapshot derived from Material 3 `--mat-sys-*` tokens. */
export interface ChartTheme {
  readonly mode: 'light' | 'dark';
  readonly palette: readonly string[];
  readonly background: string;
  readonly foreground: string;
  readonly muted: string;
  readonly grid: string;
  readonly fontFamily: string;
}
