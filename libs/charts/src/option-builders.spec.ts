/**
 * Smoke specs for the option builders that back every chart wrapper.
 *
 * These tests assert the input → `EChartsOption` mapping in isolation —
 * no TestBed, no real ECharts boot. The wrappers themselves are thin
 * shims that thread signal inputs into these functions, so locking the
 * mapping here covers the contract that matters.
 *
 * If a future ADR-0016 swap rewrites these functions for a different
 * backend, the tests' shape assertions guide the rewrite.
 */
import { describe, expect, it } from 'vitest';

import { toBarOption, toGaugeOption, toHeatmapOption, toLineOption, toPieOption } from './option-builders.js';
import type { ChartTheme } from './types.js';

const TEST_THEME: ChartTheme = {
  mode: 'light',
  palette: ['#111111', '#222222', '#333333', '#444444', '#555555', '#666666'],
  background: '#ffffff',
  foreground: '#000000',
  muted: '#888888',
  grid: '#eeeeee',
  fontFamily: 'Test, sans-serif',
};

interface SeriesProbe {
  readonly type?: string;
  readonly name?: string;
  readonly data?: readonly unknown[];
  readonly areaStyle?: unknown;
  readonly smooth?: boolean;
  readonly stack?: string;
  readonly itemStyle?: { readonly color?: string };
}

interface AxisProbe {
  readonly type?: string;
  readonly data?: readonly string[];
  readonly name?: string;
}

interface LegendProbe {
  readonly orient?: string;
  readonly bottom?: number;
  readonly top?: number;
  readonly left?: number;
  readonly right?: number;
}

// ─── line ──────────────────────────────────────────────────────────────────

describe('toLineOption', () => {
  it('maps a single series into a line option with the M3 palette', () => {
    const option = toLineOption({
      series: [{ id: 'rev', label: 'Revenue', data: [10, 20, 30] }],
      xAxis: { type: 'category', labels: ['Jan', 'Feb', 'Mar'] },
      theme: TEST_THEME,
    });
    const series = option['series'] as readonly SeriesProbe[];
    expect(series).toHaveLength(1);
    expect(series[0]?.type).toBe('line');
    expect(series[0]?.name).toBe('Revenue');
    expect(series[0]?.data).toEqual([10, 20, 30]);
    expect(series[0]?.areaStyle).toBeUndefined();
    expect(option.color).toEqual(TEST_THEME.palette);
  });

  it('promotes a series with `kind: area` to an area chart via areaStyle', () => {
    const option = toLineOption({
      series: [{ id: 'a', label: 'Trend', data: [1, 2, 3], kind: 'area' }],
      xAxis: { type: 'category', labels: ['Mon', 'Tue', 'Wed'] },
      theme: TEST_THEME,
    });
    const series = option['series'] as readonly SeriesProbe[];
    expect(series[0]?.areaStyle).toBeDefined();
  });

  it('passes the category axis labels through to the ECharts x-axis', () => {
    const option = toLineOption({
      series: [{ id: 's', label: 'S', data: [1, 2] }],
      xAxis: { type: 'category', labels: ['A', 'B'], name: 'Months' },
      theme: TEST_THEME,
    });
    const xAxis = option['xAxis'] as AxisProbe;
    expect(xAxis.type).toBe('category');
    expect(xAxis.data).toEqual(['A', 'B']);
    expect(xAxis.name).toBe('Months');
  });

  it('propagates `smooth` to every series', () => {
    const option = toLineOption({
      series: [
        { id: 'a', label: 'A', data: [1, 2] },
        { id: 'b', label: 'B', data: [3, 4] },
      ],
      xAxis: { type: 'category', labels: ['x', 'y'] },
      smooth: true,
      theme: TEST_THEME,
    });
    const series = option['series'] as readonly SeriesProbe[];
    expect(series.every((s) => s.smooth === true)).toBe(true);
  });

  it('uses an explicit per-series colour when provided', () => {
    const option = toLineOption({
      series: [{ id: 's', label: 'S', data: [1, 2], color: '#abcdef' }],
      xAxis: { type: 'category', labels: ['a', 'b'] },
      theme: TEST_THEME,
    });
    const series = option['series'] as readonly SeriesProbe[];
    expect(series[0]?.itemStyle?.color).toBe('#abcdef');
  });
});

// ─── bar ───────────────────────────────────────────────────────────────────

describe('toBarOption', () => {
  it('maps series into bar type and keeps category on the x-axis by default', () => {
    const option = toBarOption({
      series: [{ id: 'q1', label: 'Q1', data: [100, 200, 300] }],
      categoryAxis: { type: 'category', labels: ['A', 'B', 'C'] },
      theme: TEST_THEME,
    });
    const series = option['series'] as readonly SeriesProbe[];
    expect(series[0]?.type).toBe('bar');
    expect(series[0]?.data).toEqual([100, 200, 300]);
    expect((option['xAxis'] as AxisProbe).type).toBe('category');
    expect((option['yAxis'] as AxisProbe).type).toBe('value');
  });

  it('swaps axes when orientation is horizontal (top-N style)', () => {
    const option = toBarOption({
      series: [{ id: 'sales', label: 'Sales', data: [5, 9, 12] }],
      categoryAxis: { type: 'category', labels: ['Shirt', 'Hat', 'Mug'] },
      orientation: 'horizontal',
      theme: TEST_THEME,
    });
    expect((option['xAxis'] as AxisProbe).type).toBe('value');
    expect((option['yAxis'] as AxisProbe).type).toBe('category');
    expect((option['yAxis'] as AxisProbe).data).toEqual(['Shirt', 'Hat', 'Mug']);
  });

  it('threads stack id through to every series', () => {
    const option = toBarOption({
      series: [
        { id: 'a', label: 'A', data: [1, 2] },
        { id: 'b', label: 'B', data: [3, 4] },
      ],
      categoryAxis: { type: 'category', labels: ['x', 'y'] },
      stack: 'totals',
      theme: TEST_THEME,
    });
    const series = option['series'] as readonly SeriesProbe[];
    expect(series.every((s) => s.stack === 'totals')).toBe(true);
  });

  it('positions legend at top when configured', () => {
    const option = toBarOption({
      series: [{ id: 'a', label: 'A', data: [1] }],
      categoryAxis: { type: 'category', labels: ['x'] },
      legend: { position: 'top' },
      theme: TEST_THEME,
    });
    const legend = option['legend'] as LegendProbe;
    expect(legend.top).toBe(0);
    expect(legend.bottom).toBeUndefined();
  });
});

// ─── pie ───────────────────────────────────────────────────────────────────

describe('toPieOption', () => {
  it('maps slices into a pie series with id/name/value preserved', () => {
    const option = toPieOption({
      slices: [
        { id: 'a', label: 'Apples', value: 10 },
        { id: 'b', label: 'Bananas', value: 5 },
      ],
      theme: TEST_THEME,
    });
    const series = option['series'] as readonly SeriesProbe[];
    expect(series[0]?.type).toBe('pie');
    expect(series[0]?.data).toEqual([
      { id: 'a', name: 'Apples', value: 10 },
      { id: 'b', name: 'Bananas', value: 5 },
    ]);
  });

  it('renders a donut (array radius) by default', () => {
    const option = toPieOption({ slices: [{ id: 'a', label: 'A', value: 1 }], theme: TEST_THEME });
    const series = option['series'] as readonly { radius?: unknown }[];
    expect(Array.isArray(series[0]?.radius)).toBe(true);
  });

  it('renders a full pie (string radius) when variant is "pie"', () => {
    const option = toPieOption({
      slices: [{ id: 'a', label: 'A', value: 1 }],
      variant: 'pie',
      theme: TEST_THEME,
    });
    const series = option['series'] as readonly { radius?: unknown }[];
    expect(typeof series[0]?.radius).toBe('string');
  });

  it('switches legend to vertical when positioned left or right', () => {
    const option = toPieOption({
      slices: [{ id: 'a', label: 'A', value: 1 }],
      legend: { position: 'left' },
      theme: TEST_THEME,
    });
    const legend = option['legend'] as LegendProbe;
    expect(legend.orient).toBe('vertical');
    expect(legend.left).toBe(0);
  });
});

// ─── gauge ─────────────────────────────────────────────────────────────────

describe('toGaugeOption', () => {
  it('renders a single gauge series with the supplied value, label, min and max', () => {
    const option = toGaugeOption({ value: 42, label: 'SLA', min: 0, max: 100, theme: TEST_THEME });
    const series = option['series'] as readonly (SeriesProbe & {
      min?: number;
      max?: number;
      data?: readonly { value: number; name: string }[];
    })[];
    expect(series[0]?.type).toBe('gauge');
    expect(series[0]?.min).toBe(0);
    expect(series[0]?.max).toBe(100);
    expect(series[0]?.data?.[0]).toEqual({ value: 42, name: 'SLA' });
  });

  it('formats the displayed value as `${rounded}${unit}` (defaults to "%")', () => {
    const option = toGaugeOption({ value: 73.6, theme: TEST_THEME });
    const detail = (option['series'] as readonly { detail?: { formatter?: (v: number) => string } }[])[0]?.detail;
    expect(detail?.formatter?.(73.6)).toBe('74%');
  });

  it('honours an explicit unit override (e.g. "GB", "k")', () => {
    const option = toGaugeOption({ value: 12, unit: 'GB', theme: TEST_THEME });
    const detail = (option['series'] as readonly { detail?: { formatter?: (v: number) => string } }[])[0]?.detail;
    expect(detail?.formatter?.(12)).toBe('12GB');
  });
});

// ─── heatmap ───────────────────────────────────────────────────────────────

describe('toHeatmapOption', () => {
  it('maps cells into [col, row, value] tuples on a heatmap series', () => {
    const option = toHeatmapOption({
      rows: ['Mon', 'Tue'],
      columns: ['0h', '1h', '2h'],
      cells: [
        { row: 0, col: 0, value: 1 },
        { row: 1, col: 2, value: 9 },
      ],
      theme: TEST_THEME,
    });
    const series = option['series'] as readonly SeriesProbe[];
    expect(series[0]?.type).toBe('heatmap');
    expect(series[0]?.data).toEqual([
      [0, 0, 1],
      [2, 1, 9],
    ]);
  });

  it('places columns on x-axis and rows on y-axis as categories', () => {
    const option = toHeatmapOption({
      rows: ['R1', 'R2'],
      columns: ['C1', 'C2', 'C3'],
      cells: [],
      theme: TEST_THEME,
    });
    expect((option['xAxis'] as AxisProbe).data).toEqual(['C1', 'C2', 'C3']);
    expect((option['yAxis'] as AxisProbe).data).toEqual(['R1', 'R2']);
  });

  it('configures visualMap with the supplied min/max bounds', () => {
    const option = toHeatmapOption({
      rows: ['r'],
      columns: ['c'],
      cells: [],
      min: 5,
      max: 95,
      theme: TEST_THEME,
    });
    const visualMap = option['visualMap'] as { min?: number; max?: number };
    expect(visualMap.min).toBe(5);
    expect(visualMap.max).toBe(95);
  });

  it('formats tooltip as `${row} × ${col}: ${value}${unit}`', () => {
    const option = toHeatmapOption({
      rows: ['Mon'],
      columns: ['9h'],
      cells: [{ row: 0, col: 0, value: 17 }],
      unit: ' orders',
      theme: TEST_THEME,
    });
    const formatter = (option['tooltip'] as { formatter?: (p: unknown) => string }).formatter;
    expect(formatter?.({ value: [0, 0, 17] })).toBe('Mon × 9h: 17 orders');
  });
});
