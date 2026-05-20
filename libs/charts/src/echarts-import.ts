/**
 * Single point of contact with the ECharts library. Tree-shaken — only the
 * chart types and components we ship are bundled. Wrappers import `echarts`
 * from this module, never from the package directly.
 *
 * If the backend changes (ADR-0016 keeps the option open), this file is the
 * first to rewrite; the rest of `libs/charts` only sees `EChartsInstance`
 * and the union of registered chart kinds.
 */
import { BarChart, GaugeChart, HeatmapChart, LineChart, PieChart } from 'echarts/charts';
import {
  DataZoomComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
  VisualMapComponent,
} from 'echarts/components';
import * as core from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';

core.use([
  BarChart,
  LineChart,
  PieChart,
  GaugeChart,
  HeatmapChart,
  CanvasRenderer,
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
  DataZoomComponent,
  VisualMapComponent,
]);

export type EChartsInstance = core.ECharts;
export type EChartsOption = core.EChartsCoreOption;

/** Init or re-use an ECharts instance on the host element. */
export function initChart(host: HTMLElement, theme?: string | object): EChartsInstance {
  return core.init(host, theme, { renderer: 'canvas' });
}

/** Dispose an instance and detach DOM listeners. */
export function disposeChart(instance: EChartsInstance | null | undefined): void {
  if (instance && !instance.isDisposed()) {
    instance.dispose();
  }
}

/** Resize an instance (e.g. on container resize). */
export function resizeChart(instance: EChartsInstance | null | undefined): void {
  instance?.resize();
}
