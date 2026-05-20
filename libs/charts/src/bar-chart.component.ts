import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { ChartHostComponent } from './chart-host.component.js';
import type { EChartsOption } from './echarts-import.js';
import { ChartThemeBridge } from './theme.js';
import type { ChartAxis, ChartLegend, ChartSeries, ChartTooltip } from './types.js';

/**
 * Bar chart wrapper. Set `orientation: 'horizontal'` for the h-bar variant
 * (commonly used for "top N" lists). Stacking is supported via `stack`.
 */
@Component({
  selector: 'ais-bar-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ChartHostComponent],
  template: `
    <ais-chart-host
      [option]="option()"
      [testId]="testId() ?? 'bar-chart'"
      [ariaLabel]="ariaLabel()"
    />
  `,
  host: { class: 'block h-full w-full' },
})
export class BarChartComponent {
  readonly series = input.required<readonly ChartSeries[]>();
  readonly categoryAxis = input.required<ChartAxis>();
  readonly valueAxis = input<ChartAxis | null>(null);
  readonly orientation = input<'vertical' | 'horizontal'>('vertical');
  readonly stack = input<string | null>(null);
  readonly legend = input<ChartLegend | null>(null);
  readonly tooltip = input<ChartTooltip | null>(null);
  readonly testId = input<string | null>(null);
  readonly ariaLabel = input<string | null>(null);

  private readonly theme = inject(ChartThemeBridge);

  protected readonly option = computed<EChartsOption>(() => {
    const snapshot = this.theme.snapshot();
    const horizontal = this.orientation() === 'horizontal';
    const legend = this.legend();
    const categoryAxisConfig = toEchartsAxis(this.categoryAxis(), snapshot.muted, snapshot.grid);
    const valueAxisConfig = toEchartsAxis(this.valueAxis() ?? { type: 'value' }, snapshot.muted, snapshot.grid);
    return {
      color: snapshot.palette,
      tooltip: {
        show: this.tooltip()?.visible !== false,
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: snapshot.background,
        textStyle: { color: snapshot.foreground, fontFamily: snapshot.fontFamily },
      },
      legend: {
        show: legend?.visible !== false,
        bottom: legend?.position === 'bottom' || !legend?.position ? 0 : undefined,
        top: legend?.position === 'top' ? 0 : undefined,
        textStyle: { color: snapshot.muted },
      },
      grid: { left: 12, right: 16, top: legend?.position === 'top' ? 28 : 12, bottom: 36, containLabel: true },
      xAxis: horizontal ? valueAxisConfig : categoryAxisConfig,
      yAxis: horizontal ? categoryAxisConfig : valueAxisConfig,
      series: this.series().map((s) => ({
        id: s.id,
        name: s.label,
        type: 'bar' as const,
        stack: this.stack() ?? undefined,
        data: [...s.data],
        ...(s.color ? { itemStyle: { color: s.color } } : {}),
      })),
    };
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
