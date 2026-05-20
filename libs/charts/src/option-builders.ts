/**
 * Pure option builders — one per wrapper kind. The wrappers consume
 * Angular signal inputs and delegate to these functions, which in turn
 * produce the `EChartsOption` shape consumed by `ChartHost`.
 *
 * Why this file exists:
 *   1. The wrappers' input → option mapping is the most valuable logic to
 *      lock in with unit tests. Pure functions are trivially testable
 *      under any runner — no TestBed, no jsdom signal-input quirks.
 *   2. Should the backend change (ADR-0016 keeps that door open), every
 *      mapping that needs rewriting is centralised here. The wrappers
 *      themselves stay one-liners.
 */
import type { EChartsOption } from './echarts-import.js';
import type {
  ChartAxis,
  ChartHeatCell,
  ChartLegend,
  ChartSeries,
  ChartSlice,
  ChartTheme,
  ChartTooltip,
} from './types.js';

// ─── shared helpers ────────────────────────────────────────────────────────

function categoryAxisData(axis: ChartAxis): readonly string[] | undefined {
  if (axis.type !== 'category') return undefined;
  return axis.labels ? [...axis.labels] : [];
}

function toEchartsAxis(axis: ChartAxis, color: string, gridColor: string): EChartsOption['xAxis'] {
  return {
    type: axis.type,
    data: categoryAxisData(axis),
    name: axis.name,
    min: axis.min === 'auto' ? undefined : axis.min,
    max: axis.max === 'auto' ? undefined : axis.max,
    axisLabel: { color },
    axisLine: { lineStyle: { color: gridColor } },
    splitLine: { lineStyle: { color: gridColor, type: 'dashed' } },
  };
}

function legendBottom(legend: ChartLegend | null | undefined): number | undefined {
  return legend?.position === 'bottom' || !legend?.position ? 0 : undefined;
}

function legendTop(legend: ChartLegend | null | undefined): number | undefined {
  return legend?.position === 'top' ? 0 : undefined;
}

// ─── line ──────────────────────────────────────────────────────────────────

export interface LineOptionArgs {
  readonly series: readonly ChartSeries[];
  readonly xAxis: ChartAxis;
  readonly yAxis?: ChartAxis | null;
  readonly legend?: ChartLegend | null;
  readonly tooltip?: ChartTooltip | null;
  readonly smooth?: boolean;
  readonly theme: ChartTheme;
}

export function toLineOption(args: LineOptionArgs): EChartsOption {
  const { series, xAxis, yAxis, legend, tooltip, smooth, theme } = args;
  const option: EChartsOption = {
    color: [...theme.palette],
    tooltip: {
      show: tooltip?.visible !== false,
      trigger: 'axis',
      backgroundColor: theme.background,
      textStyle: { color: theme.foreground, fontFamily: theme.fontFamily },
    },
    legend: {
      show: legend?.visible !== false,
      bottom: legendBottom(legend),
      top: legendTop(legend),
      textStyle: { color: theme.muted },
    },
    grid: { left: 40, right: 16, top: legend?.position === 'top' ? 28 : 12, bottom: 36, containLabel: true },
    xAxis: toEchartsAxis(xAxis, theme.muted, theme.grid),
    yAxis: toEchartsAxis(yAxis ?? { type: 'value' }, theme.muted, theme.grid),
    series: series.map((s) => ({
      id: s.id,
      name: s.label,
      type: 'line' as const,
      smooth: smooth ?? false,
      areaStyle: (s.kind ?? 'line') === 'area' ? {} : undefined,
      data: [...s.data],
      ...(s.color ? { itemStyle: { color: s.color } } : {}),
    })),
  };
  return option;
}

// ─── bar ───────────────────────────────────────────────────────────────────

export interface BarOptionArgs {
  readonly series: readonly ChartSeries[];
  readonly categoryAxis: ChartAxis;
  readonly valueAxis?: ChartAxis | null;
  readonly orientation?: 'vertical' | 'horizontal';
  readonly stack?: string | null;
  readonly legend?: ChartLegend | null;
  readonly tooltip?: ChartTooltip | null;
  readonly theme: ChartTheme;
}

export function toBarOption(args: BarOptionArgs): EChartsOption {
  const { series, categoryAxis, valueAxis, orientation, stack, legend, tooltip, theme } = args;
  const horizontal = orientation === 'horizontal';
  const categoryAxisConfig = toEchartsAxis(categoryAxis, theme.muted, theme.grid);
  const valueAxisConfig = toEchartsAxis(valueAxis ?? { type: 'value' }, theme.muted, theme.grid);
  const option: EChartsOption = {
    color: [...theme.palette],
    tooltip: {
      show: tooltip?.visible !== false,
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: theme.background,
      textStyle: { color: theme.foreground, fontFamily: theme.fontFamily },
    },
    legend: {
      show: legend?.visible !== false,
      bottom: legendBottom(legend),
      top: legendTop(legend),
      textStyle: { color: theme.muted },
    },
    grid: { left: 12, right: 16, top: legend?.position === 'top' ? 28 : 12, bottom: 36, containLabel: true },
    xAxis: horizontal ? valueAxisConfig : categoryAxisConfig,
    yAxis: horizontal ? categoryAxisConfig : valueAxisConfig,
    series: series.map((s) => ({
      id: s.id,
      name: s.label,
      type: 'bar' as const,
      stack: stack ?? undefined,
      data: [...s.data],
      ...(s.color ? { itemStyle: { color: s.color } } : {}),
    })),
  };
  return option;
}

// ─── pie / donut ───────────────────────────────────────────────────────────

export interface PieOptionArgs {
  readonly slices: readonly ChartSlice[];
  readonly variant?: 'pie' | 'donut';
  readonly legend?: ChartLegend | null;
  readonly tooltip?: ChartTooltip | null;
  readonly theme: ChartTheme;
}

export function toPieOption(args: PieOptionArgs): EChartsOption {
  const { slices, variant, legend, tooltip, theme } = args;
  const isDonut = (variant ?? 'donut') === 'donut';
  const option: EChartsOption = {
    color: [...theme.palette],
    tooltip: {
      show: tooltip?.visible !== false,
      trigger: 'item',
      backgroundColor: theme.background,
      textStyle: { color: theme.foreground, fontFamily: theme.fontFamily },
      formatter: '{b}: {c} ({d}%)',
    },
    legend: {
      show: legend?.visible !== false,
      orient: legend?.position === 'left' || legend?.position === 'right' ? 'vertical' : 'horizontal',
      bottom: legendBottom(legend),
      top: legendTop(legend),
      left: legend?.position === 'left' ? 0 : undefined,
      right: legend?.position === 'right' ? 0 : undefined,
      textStyle: { color: theme.muted },
    },
    series: [
      {
        type: 'pie' as const,
        radius: isDonut ? ['52%', '76%'] : '76%',
        center: ['50%', '50%'],
        avoidLabelOverlap: true,
        label: { show: !isDonut, color: theme.muted },
        labelLine: { show: !isDonut },
        data: slices.map((s) => ({
          id: s.id,
          name: s.label,
          value: s.value,
          ...(s.color ? { itemStyle: { color: s.color } } : {}),
        })),
      },
    ],
  };
  return option;
}

// ─── gauge ─────────────────────────────────────────────────────────────────

export interface GaugeOptionArgs {
  readonly value: number;
  readonly label?: string;
  readonly min?: number;
  readonly max?: number;
  readonly unit?: string;
  readonly theme: ChartTheme;
}

export function toGaugeOption(args: GaugeOptionArgs): EChartsOption {
  const { value, label, min, max, unit, theme } = args;
  const primary = theme.palette[0] ?? '#4f46e5';
  const unitSuffix = unit ?? '%';
  return {
    series: [
      {
        type: 'gauge' as const,
        startAngle: 210,
        endAngle: -30,
        min: min ?? 0,
        max: max ?? 100,
        radius: '90%',
        progress: { show: true, width: 14, itemStyle: { color: primary } },
        axisLine: { lineStyle: { width: 14, color: [[1, theme.grid]] } },
        axisTick: { show: false },
        splitLine: { distance: -22, length: 8, lineStyle: { color: theme.muted } },
        axisLabel: { color: theme.muted, distance: 18 },
        pointer: { show: false },
        anchor: { show: false },
        title: { show: false },
        detail: {
          valueAnimation: true,
          formatter: (v: number) => `${Math.round(v)}${unitSuffix}`,
          color: theme.foreground,
          fontSize: 28,
          fontFamily: theme.fontFamily,
          offsetCenter: [0, '20%'],
        },
        data: [{ value, name: label ?? '' }],
      },
    ],
  };
}

// ─── heatmap ───────────────────────────────────────────────────────────────

export interface HeatmapOptionArgs {
  readonly rows: readonly string[];
  readonly columns: readonly string[];
  readonly cells: readonly ChartHeatCell[];
  readonly min?: number;
  readonly max?: number;
  readonly unit?: string;
  readonly theme: ChartTheme;
}

export function toHeatmapOption(args: HeatmapOptionArgs): EChartsOption {
  const { rows, columns, cells, min, max, unit, theme } = args;
  const low = theme.palette[4] ?? theme.palette[0] ?? '#a7c7ff';
  const high = theme.palette[1] ?? theme.palette[0] ?? '#1e40af';
  const unitSuffix = unit ?? '';
  return {
    tooltip: {
      backgroundColor: theme.background,
      textStyle: { color: theme.foreground, fontFamily: theme.fontFamily },
      formatter: (params: unknown) => {
        const point = params as { value?: readonly [number, number, number] };
        if (!point?.value) return '';
        const [col, row, value] = point.value;
        const colLabel = columns[col] ?? col;
        const rowLabel = rows[row] ?? row;
        return `${rowLabel} × ${colLabel}: ${value}${unitSuffix}`;
      },
    },
    grid: { left: 60, right: 12, top: 12, bottom: 60, containLabel: true },
    xAxis: {
      type: 'category' as const,
      data: [...columns],
      splitArea: { show: true },
      axisLabel: { color: theme.muted },
      axisLine: { lineStyle: { color: theme.grid } },
    },
    yAxis: {
      type: 'category' as const,
      data: [...rows],
      splitArea: { show: true },
      axisLabel: { color: theme.muted },
      axisLine: { lineStyle: { color: theme.grid } },
    },
    visualMap: {
      min: min ?? 0,
      max: max ?? 100,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: 0,
      textStyle: { color: theme.muted },
      inRange: { color: [low, high] },
    },
    series: [
      {
        type: 'heatmap' as const,
        data: cells.map((c) => [c.col, c.row, c.value] as const),
        label: { show: false },
        emphasis: { itemStyle: { shadowBlur: 8, shadowColor: 'rgba(0,0,0,0.4)' } },
      },
    ],
  };
}
