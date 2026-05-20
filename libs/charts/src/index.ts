/**
 * Library-agnostic Angular chart wrappers backed by Apache ECharts.
 *
 * Consumers import ONLY the symbols re-exported from this file — never
 * anything from `echarts/*`. See `docs/adr/0016-charts-abstraction-echarts.md`
 * for the abstraction contract.
 *
 * @packageDocumentation
 */
export { ChartHostComponent } from './chart-host.component.js';
export { ChartThemeBridge } from './theme.js';
export { LineChartComponent } from './line-chart.component.js';
export { BarChartComponent } from './bar-chart.component.js';
export { PieChartComponent } from './pie-chart.component.js';
export { GaugeChartComponent } from './gauge-chart.component.js';
export { HeatmapChartComponent } from './heatmap-chart.component.js';
export type {
  ChartAxis,
  ChartHeatCell,
  ChartLegend,
  ChartSeries,
  ChartSlice,
  ChartTheme,
  ChartTooltip,
  ChartTooltipPoint,
} from './types.js';
