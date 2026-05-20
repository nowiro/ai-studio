import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { ChartHostComponent } from './chart-host.component.js';
import type { EChartsOption } from './echarts-import.js';
import { toPieOption } from './option-builders.js';
import { ChartThemeBridge } from './theme.js';
import type { ChartLegend, ChartSlice, ChartTooltip } from './types.js';

/**
 * Pie / donut chart wrapper. `variant: 'donut'` gives the classic ring
 * (60–80 % inner radius); `variant: 'pie'` is full slices.
 */
@Component({
  selector: 'ais-pie-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ChartHostComponent],
  template: `
    <ais-chart-host
      [option]="option()"
      [testId]="testId() ?? 'pie-chart'"
      [ariaLabel]="ariaLabel()"
    />
  `,
  host: { class: 'block h-full w-full' },
  styles: [':host { display: block; width: 100%; height: 100%; }'],
})
export class PieChartComponent {
  readonly slices = input.required<readonly ChartSlice[]>();
  readonly variant = input<'pie' | 'donut'>('donut');
  readonly legend = input<ChartLegend | null>(null);
  readonly tooltip = input<ChartTooltip | null>(null);
  readonly testId = input<string | null>(null);
  readonly ariaLabel = input<string | null>(null);

  private readonly theme = inject(ChartThemeBridge);

  protected readonly option = computed<EChartsOption>(() =>
    toPieOption({
      slices: this.slices(),
      variant: this.variant(),
      legend: this.legend(),
      tooltip: this.tooltip(),
      theme: this.theme.snapshot(),
    }),
  );
}
