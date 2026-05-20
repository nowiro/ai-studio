import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  viewChild,
} from '@angular/core';

import { disposeChart, type EChartsInstance, type EChartsOption, initChart, resizeChart } from './echarts-import.js';
import { ChartThemeBridge } from './theme.js';

/**
 * Bare chart container. Holds the ECharts instance, wires up the
 * ResizeObserver, applies the Material 3 theme on theme changes, and
 * exposes a `setOption(option)` input so concrete wrappers can push
 * options computed from their own plain-shape inputs.
 *
 * Consumers should NEVER use this directly — they instantiate a
 * concrete wrapper (LineChart, BarChart, …) which internally produces
 * the option and passes it here.
 */
@Component({
  selector: 'ais-chart-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      [attr.data-testid]="testId() ?? 'chart-host'"
      [attr.role]="ariaLabel() ? 'img' : null"
      [attr.aria-label]="ariaLabel()"
      class="block h-full w-full"
      #host
    ></div>
  `,
  // Tailwind's `h-full` on a custom-element host class doesn't reliably resolve
  // (verified via DOM dump in the dashboard E2E — `ais-chart-host` reported
  // `computedHeight: auto` even with `class="h-full"`). `:host` rule is plain
  // shadow-emulated CSS — bulletproof. The `:host > div` rule covers the inner
  // chart container (ECharts mounts inside it) for the same reason: relying
  // on the `h-full` utility leaves it at 0 height in some builds, and ECharts
  // then paints a canvas with `height="0"`.
  styles: [
    ':host { display: block; width: 100%; height: 100%; }',
    ':host > div { display: block; width: 100%; height: 100%; }',
  ],
})
export class ChartHostComponent implements AfterViewInit, OnDestroy {
  readonly option = input.required<EChartsOption>();
  readonly testId = input<string | null>(null);
  readonly ariaLabel = input<string | null>(null);

  private readonly themeBridge = inject(ChartThemeBridge);
  private readonly hostRef = viewChild.required<ElementRef<HTMLDivElement>>('host');

  private chart: EChartsInstance | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private themeMediaQuery: MediaQueryList | null = null;
  private readonly onThemeChange = (): void => this.applyTheme();

  constructor() {
    // Push fresh options into the live chart whenever the wrapper's signal updates.
    effect(() => {
      const option = this.option();
      if (this.chart) {
        this.chart.setOption(option, { notMerge: true, lazyUpdate: true });
      }
    });
  }

  ngAfterViewInit(): void {
    const hostElement = this.hostRef().nativeElement;
    this.chart = initChart(hostElement);
    this.chart.setOption(this.option(), { notMerge: true });

    // Resize on container changes — without this charts stay at first paint size.
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => resizeChart(this.chart));
      this.resizeObserver.observe(hostElement);
    }

    // Track prefers-color-scheme so dark / light mode keeps charts in sync.
    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      this.themeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      this.themeMediaQuery.addEventListener('change', this.onThemeChange);
    }

    // Some environments (Playwright headless-shell, deferred Angular @if blocks
    // that paint after ngAfterViewInit) compute the host element's layout one
    // tick after init runs — `initChart` then reads `clientHeight === 0` and
    // emits a canvas with `height="0"`. ResizeObserver eventually fires, but
    // the next deferred resize is what guarantees a visible chart on the very
    // first paint. Harmless on browsers that already had layout ready.
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(() => resizeChart(this.chart));
    }
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    this.themeMediaQuery?.removeEventListener('change', this.onThemeChange);
    this.themeMediaQuery = null;
    disposeChart(this.chart);
    this.chart = null;
  }

  /** Re-read tokens and re-apply chart theme — useful when the host page swaps themes. */
  applyTheme(): void {
    const snapshot = this.themeBridge.snapshot(this.hostRef().nativeElement);
    if (!this.chart) return;
    this.chart.setOption(
      {
        backgroundColor: snapshot.background,
        textStyle: { color: snapshot.foreground, fontFamily: snapshot.fontFamily },
      },
      { notMerge: false, lazyUpdate: true },
    );
  }

  /** Test-only — returns the underlying instance for assertion helpers. */
  _instance(): EChartsInstance | null {
    return this.chart;
  }
}
