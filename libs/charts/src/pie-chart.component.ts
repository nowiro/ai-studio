import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { ChartHostComponent } from './chart-host.component.js';
import type { EChartsOption } from './echarts-import.js';
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
})
export class PieChartComponent {
  readonly slices = input.required<readonly ChartSlice[]>();
  readonly variant = input<'pie' | 'donut'>('donut');
  readonly legend = input<ChartLegend | null>(null);
  readonly tooltip = input<ChartTooltip | null>(null);
  readonly testId = input<string | null>(null);
  readonly ariaLabel = input<string | null>(null);

  private readonly theme = inject(ChartThemeBridge);

  protected readonly option = computed<EChartsOption>(() => {
    const snapshot = this.theme.snapshot();
    const legend = this.legend();
    const isDonut = this.variant() === 'donut';
    const option: EChartsOption = {
      color: [...snapshot.palette],
      tooltip: {
        show: this.tooltip()?.visible !== false,
        trigger: 'item',
        backgroundColor: snapshot.background,
        textStyle: { color: snapshot.foreground, fontFamily: snapshot.fontFamily },
        formatter: '{b}: {c} ({d}%)',
      },
      legend: {
        show: legend?.visible !== false,
        orient: legend?.position === 'left' || legend?.position === 'right' ? 'vertical' : 'horizontal',
        bottom: legend?.position === 'bottom' || !legend?.position ? 0 : undefined,
        top: legend?.position === 'top' ? 0 : undefined,
        left: legend?.position === 'left' ? 0 : undefined,
        right: legend?.position === 'right' ? 0 : undefined,
        textStyle: { color: snapshot.muted },
      },
      series: [
        {
          type: 'pie' as const,
          radius: isDonut ? ['52%', '76%'] : '76%',
          center: ['50%', '50%'],
          avoidLabelOverlap: true,
          label: { show: !isDonut, color: snapshot.muted },
          labelLine: { show: !isDonut },
          data: this.slices().map((s) => ({
            id: s.id,
            name: s.label,
            value: s.value,
            ...(s.color ? { itemStyle: { color: s.color } } : {}),
          })),
        },
      ],
    };
    return option;
  });
}
