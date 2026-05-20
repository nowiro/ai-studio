import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { ChartHostComponent } from './chart-host.component.js';
import type { EChartsOption } from './echarts-import.js';
import { toHeatmapOption } from './option-builders.js';
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
  styles: [':host { display: block; width: 100%; height: 100%; }'],
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

  protected readonly option = computed<EChartsOption>(() =>
    toHeatmapOption({
      rows: this.rows(),
      columns: this.columns(),
      cells: this.cells(),
      min: this.min(),
      max: this.max(),
      unit: this.unit(),
      theme: this.theme.snapshot(),
    }),
  );
}
