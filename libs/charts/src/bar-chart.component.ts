import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { ChartHostComponent } from './chart-host.component.js';
import type { EChartsOption } from './echarts-import.js';
import { toBarOption } from './option-builders.js';
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

  protected readonly option = computed<EChartsOption>(() =>
    toBarOption({
      series: this.series(),
      categoryAxis: this.categoryAxis(),
      valueAxis: this.valueAxis(),
      orientation: this.orientation(),
      stack: this.stack(),
      legend: this.legend(),
      tooltip: this.tooltip(),
      theme: this.theme.snapshot(),
    }),
  );
}
