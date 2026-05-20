import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { ChartHostComponent } from './chart-host.component.js';
import type { EChartsOption } from './echarts-import.js';
import { toGaugeOption } from './option-builders.js';
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
  styles: [':host { display: block; width: 100%; height: 100%; }'],
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

  protected readonly option = computed<EChartsOption>(() =>
    toGaugeOption({
      value: this.value(),
      label: this.label(),
      min: this.min(),
      max: this.max(),
      unit: this.unit(),
      theme: this.theme.snapshot(),
    }),
  );
}
