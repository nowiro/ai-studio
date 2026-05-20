import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { ChartHostComponent } from './chart-host.component.js';
import type { EChartsOption } from './echarts-import.js';
import { ChartThemeBridge } from './theme.js';
import type { ChartAxis, ChartLegend, ChartSeries, ChartTooltip } from './types.js';

/**
 * Line chart wrapper. Each `ChartSeries` becomes one polyline; multi-series
 * support out of the box. Set `kind: 'area'` on a series for the filled
 * variant; mix lines and areas on the same chart.
 */
@Component({
  selector: 'ais-line-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ChartHostComponent],
  template: `
    <ais-chart-host
      [option]="option()"
      [testId]="testId() ?? 'line-chart'"
      [ariaLabel]="ariaLabel()"
    />
  `,
  host: { class: 'block h-full w-full' },
})
export class LineChartComponent {
  readonly series = input.required<readonly ChartSeries[]>();
  readonly xAxis = input.required<ChartAxis>();
  readonly yAxis = input<ChartAxis | null>(null);
  readonly legend = input<ChartLegend | null>(null);
  readonly tooltip = input<ChartTooltip | null>(null);
  readonly smooth = input<boolean>(false);
  readonly testId = input<string | null>(null);
  readonly ariaLabel = input<string | null>(null);

  private readonly theme = inject(ChartThemeBridge);

  protected readonly option = computed<EChartsOption>(() => {
    const snapshot = this.theme.snapshot();
    const series = this.series();
    const legend = this.legend();
    const option: EChartsOption = {
      color: [...snapshot.palette],
      tooltip: {
        show: this.tooltip()?.visible !== false,
        trigger: 'axis',
        backgroundColor: snapshot.background,
        textStyle: { color: snapshot.foreground, fontFamily: snapshot.fontFamily },
      },
      legend: {
        show: legend?.visible !== false,
        bottom: legend?.position === 'bottom' || !legend?.position ? 0 : undefined,
        top: legend?.position === 'top' ? 0 : undefined,
        textStyle: { color: snapshot.muted },
      },
      grid: { left: 40, right: 16, top: legend?.position === 'top' ? 28 : 12, bottom: 36, containLabel: true },
      xAxis: toEchartsAxis(this.xAxis(), snapshot.muted, snapshot.grid),
      yAxis: toEchartsAxis(this.yAxis() ?? { type: 'value' }, snapshot.muted, snapshot.grid),
      series: series.map((s) => ({
        id: s.id,
        name: s.label,
        type: 'line' as const,
        smooth: this.smooth(),
        areaStyle: (s.kind ?? 'line') === 'area' ? {} : undefined,
        data: [...s.data],
        ...(s.color ? { itemStyle: { color: s.color } } : {}),
      })),
    };
    return option;
  });
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

function categoryAxisData(axis: ChartAxis): readonly string[] | undefined {
  if (axis.type !== 'category') return undefined;
  return axis.labels ? [...axis.labels] : [];
}
