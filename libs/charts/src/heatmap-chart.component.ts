import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { ChartHostComponent } from './chart-host.component.js';
import type { EChartsOption } from './echarts-import.js';
import { ChartThemeBridge } from './theme.js';
import type { ChartHeatCell } from './types.js';

/**
 * Two-axis heatmap (e.g. hour × day, region × product). Colour ramp is
 * derived from the Material 3 primary palette (low) → tertiary (high).
 */
@Component({
  selector: 'ais-heatmap-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ChartHostComponent],
  template: `
    <ais-chart-host
      [option]="option()"
      [testId]="testId() ?? 'heatmap-chart'"
      [ariaLabel]="ariaLabel()"
    />
  `,
  host: { class: 'block h-full w-full' },
})
export class HeatmapChartComponent {
  readonly rows = input.required<readonly string[]>();
  readonly columns = input.required<readonly string[]>();
  readonly cells = input.required<readonly ChartHeatCell[]>();
  readonly min = input<number>(0);
  readonly max = input<number>(100);
  readonly unit = input<string>('');
  readonly testId = input<string | null>(null);
  readonly ariaLabel = input<string | null>(null);

  private readonly theme = inject(ChartThemeBridge);

  protected readonly option = computed<EChartsOption>(() => {
    const snapshot = this.theme.snapshot();
    const low = snapshot.palette[4] ?? snapshot.palette[0] ?? '#a7c7ff';
    const high = snapshot.palette[1] ?? snapshot.palette[0] ?? '#1e40af';
    return {
      tooltip: {
        backgroundColor: snapshot.background,
        textStyle: { color: snapshot.foreground, fontFamily: snapshot.fontFamily },
        formatter: (params: unknown) => {
          const point = params as { value?: readonly [number, number, number] };
          if (!point?.value) return '';
          const [col, row, value] = point.value;
          const colLabel = this.columns()[col] ?? col;
          const rowLabel = this.rows()[row] ?? row;
          return `${rowLabel} × ${colLabel}: ${value}${this.unit()}`;
        },
      },
      grid: { left: 60, right: 12, top: 12, bottom: 60, containLabel: true },
      xAxis: {
        type: 'category' as const,
        data: [...this.columns()],
        splitArea: { show: true },
        axisLabel: { color: snapshot.muted },
        axisLine: { lineStyle: { color: snapshot.grid } },
      },
      yAxis: {
        type: 'category' as const,
        data: [...this.rows()],
        splitArea: { show: true },
        axisLabel: { color: snapshot.muted },
        axisLine: { lineStyle: { color: snapshot.grid } },
      },
      visualMap: {
        min: this.min(),
        max: this.max(),
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: 0,
        textStyle: { color: snapshot.muted },
        inRange: { color: [low, high] },
      },
      series: [
        {
          type: 'heatmap' as const,
          data: this.cells().map((c) => [c.col, c.row, c.value] as const),
          label: { show: false },
          emphasis: { itemStyle: { shadowBlur: 8, shadowColor: 'rgba(0,0,0,0.4)' } },
        },
      ],
    };
  });
}
