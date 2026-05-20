import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { ChartHostComponent } from './chart-host.component.js';
import type { EChartsOption } from './echarts-import.js';
import { ChartThemeBridge } from './theme.js';

/**
 * Single-value gauge — useful for KPI cards (sla %, conversion rate,
 * stock level). The needle and progress bar use Material 3 primary;
 * the track uses outline-variant.
 */
@Component({
  selector: 'ais-gauge-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ChartHostComponent],
  template: `
    <ais-chart-host
      [option]="option()"
      [testId]="testId() ?? 'gauge-chart'"
      [ariaLabel]="ariaLabel()"
    />
  `,
  host: { class: 'block h-full w-full' },
})
export class GaugeChartComponent {
  readonly value = input.required<number>();
  readonly label = input<string>('');
  readonly min = input<number>(0);
  readonly max = input<number>(100);
  readonly unit = input<string>('%');
  readonly testId = input<string | null>(null);
  readonly ariaLabel = input<string | null>(null);

  private readonly theme = inject(ChartThemeBridge);

  protected readonly option = computed<EChartsOption>(() => {
    const snapshot = this.theme.snapshot();
    const primary = snapshot.palette[0] ?? '#4f46e5';
    return {
      series: [
        {
          type: 'gauge' as const,
          startAngle: 210,
          endAngle: -30,
          min: this.min(),
          max: this.max(),
          radius: '90%',
          progress: { show: true, width: 14, itemStyle: { color: primary } },
          axisLine: { lineStyle: { width: 14, color: [[1, snapshot.grid]] } },
          axisTick: { show: false },
          splitLine: { distance: -22, length: 8, lineStyle: { color: snapshot.muted } },
          axisLabel: { color: snapshot.muted, distance: 18 },
          pointer: { show: false },
          anchor: { show: false },
          title: { show: false },
          detail: {
            valueAnimation: true,
            formatter: (v: number) => `${Math.round(v)}${this.unit()}`,
            color: snapshot.foreground,
            fontSize: 28,
            fontFamily: snapshot.fontFamily,
            offsetCenter: [0, '20%'],
          },
          data: [{ value: this.value(), name: this.label() }],
        },
      ],
    };
  });
}
