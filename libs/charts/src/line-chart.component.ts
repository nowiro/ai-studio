import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { ChartHostComponent } from './chart-host.component.js';
import type { EChartsOption } from './echarts-import.js';
import { toLineOption } from './option-builders.js';
import { ChartThemeBridge } from './theme.js';
import type { ChartAxis, ChartLegend, ChartSeries, ChartTooltip } from './types.js';

/**
 * Line chart wrapper. Each `ChartSeries` becomes one polyline; multi-series
 * support out of the box. Set `kind: 'area'` on a series for the filled
 * variant; mix lines and areas on the same chart.
 *
 * The actual option building lives in `option-builders.ts` so the mapping
 * is unit-testable without TestBed.
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

  protected readonly option = computed<EChartsOption>(() =>
    toLineOption({
      series: this.series(),
      xAxis: this.xAxis(),
      yAxis: this.yAxis(),
      legend: this.legend(),
      tooltip: this.tooltip(),
      smooth: this.smooth(),
      theme: this.theme.snapshot(),
    }),
  );
}
