import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

import { CurrencyProviderId, DEFAULT_COMPARE_CODES } from '../../data/eu-exchange-rates';
import { CountryService } from '../../services/country.service';
import { CurrencyService } from '../../services/currency.service';
import { LocalizationService } from '../../services/localization.service';

const CHART_WIDTH = 860;
const CHART_HEIGHT = 320;
const CHART_PADDING = {
  top: 18,
  right: 24,
  bottom: 44,
  left: 62,
};

const CHART_COLORS = ['#003399', '#2f6fed', '#f0b400', '#00897b', '#ad1457', '#6d4c41'];

@Component({
  selector: 'ais-currency',
  imports: [
    DatePipe,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatTooltipModule,
  ],
  templateUrl: './currency.component.html',
  styleUrl: './currency.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrencyPageComponent {
  protected readonly currencyService = inject(CurrencyService);
  protected readonly countryService = inject(CountryService);
  protected readonly localizationService = inject(LocalizationService);

  protected readonly amount = signal<number>(100);
  protected readonly fromCode = signal<string>('EUR');
  protected readonly toCode = signal<string>(DEFAULT_COMPARE_CODES[0] ?? 'PLN');
  protected readonly compareCodes = signal<string[]>(DEFAULT_COMPARE_CODES);
  protected readonly visibleProviderIds = signal<string[]>(
    this.currencyService.providers().map((provider) => provider.id),
  );

  protected readonly providerOptions = this.currencyService.providerOptions;
  protected readonly availableCurrencies = this.currencyService.currencies;
  protected readonly providerColumns = computed(() =>
    this.currencyService.providers().filter((provider) => this.visibleProviderIds().includes(provider.id)),
  );

  protected readonly resolvedCompareCodes = computed(() => {
    const available = this.availableCurrencies()
      .map((currency) => currency.code)
      .filter((code) => code !== this.fromCode());
    const picked = Array.from(new Set(this.compareCodes().filter((code) => available.includes(code))));

    return picked.length ? picked : available.slice(0, 4);
  });

  protected readonly convertedAmount = computed(() =>
    this.currencyService.convert(this.amount(), this.fromCode(), this.toCode()),
  );

  protected readonly fromCurrency = computed(() => this.currencyService.getCurrency(this.fromCode()));

  protected readonly toCurrency = computed(() => this.currencyService.getCurrency(this.toCode()));

  protected readonly rate = computed(() => this.currencyService.getRate(this.fromCode(), this.toCode()));

  protected readonly comparisonRows = computed(() =>
    this.currencyService.getComparisonRows(this.fromCode(), this.resolvedCompareCodes()),
  );

  protected readonly trendSeries = computed(() =>
    this.currencyService.getTrendSeries(this.fromCode(), this.resolvedCompareCodes()).map((series, index) => ({
      ...series,
      color: CHART_COLORS[index % CHART_COLORS.length],
    })),
  );

  protected readonly selectedProvider = this.currencyService.selectedProvider;

  protected readonly insights = computed(() => {
    const rows = this.comparisonRows();
    if (!rows.length) {
      return null;
    }

    const topMover = [...rows].sort((left, right) => Math.abs(right.changePercent) - Math.abs(left.changePercent))[0];
    const widestSpread = [...rows].sort((left, right) => right.spreadPercent - left.spreadPercent)[0];
    const lowestSpread = [...rows].sort((left, right) => left.spreadPercent - right.spreadPercent)[0];

    return {
      topMover,
      widestSpread,
      lowestSpread,
    };
  });

  protected readonly chartModel = computed(() => {
    const series = this.trendSeries();
    if (!series.length) {
      return null;
    }

    const values = series.flatMap((item) => item.points.map((point) => point.value));
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const range = maxValue - minValue || maxValue || 1;
    const innerWidth = CHART_WIDTH - CHART_PADDING.left - CHART_PADDING.right;
    const innerHeight = CHART_HEIGHT - CHART_PADDING.top - CHART_PADDING.bottom;
    const referencePoints = series[0]?.points ?? [];
    const xStep = referencePoints.length > 1 ? innerWidth / (referencePoints.length - 1) : innerWidth;

    const positionedSeries = series.map((item) => {
      const coordinates = item.points.map((point, index) => {
        const normalized = (point.value - minValue) / range;
        return {
          x: CHART_PADDING.left + xStep * index,
          y: CHART_PADDING.top + innerHeight - normalized * innerHeight,
          timestamp: point.timestamp,
          value: point.value,
        };
      });

      return {
        ...item,
        path: coordinates
          .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
          .join(' '),
        lastPoint: coordinates[coordinates.length - 1],
        lastValue: item.points[item.points.length - 1]?.value ?? 0,
      };
    });

    const yTicks = Array.from({ length: 5 }, (_, index) => {
      const value = maxValue - (range * index) / 4;
      const normalized = (value - minValue) / range;
      return {
        label: this.formatRate(value, value >= 10 ? 2 : 4),
        y: CHART_PADDING.top + innerHeight - normalized * innerHeight,
      };
    });

    const xTicks = referencePoints
      .map((point, index) => ({ point, index }))
      .filter(({ index }) => {
        if (referencePoints.length <= 4) {
          return true;
        }

        return index === 0 || index === referencePoints.length - 1 || index % 2 === 0;
      })
      .map(({ point, index }) => ({
        label: new Intl.DateTimeFormat(this.localizationService.currentLocale(), {
          day: 'numeric',
          month: 'short',
        }).format(point.timestamp),
        x: CHART_PADDING.left + xStep * index,
      }));

    return {
      series: positionedSeries,
      yTicks,
      xTicks,
      baselineY: CHART_HEIGHT - CHART_PADDING.bottom,
    };
  });

  constructor() {
    // Reactively update default FROM/TO currencies whenever the selected country changes.
    // Non-eurozone countries use their own currency as the base (e.g. PL → PLN→EUR),
    // while eurozone countries default to EUR as the base.
    effect(() => {
      const country = this.countryService.selectedCountry();
      const countryCurrency = country.currencyCode;
      const isNonEuroAndKnown = countryCurrency !== 'EUR' && !!this.currencyService.getCurrency(countryCurrency);

      if (isNonEuroAndKnown) {
        this.fromCode.set(countryCurrency);
        this.toCode.set('EUR');
        const compareCodes = ['EUR', ...DEFAULT_COMPARE_CODES.filter((c) => c !== countryCurrency)].slice(0, 6);
        this.compareCodes.set(compareCodes);
      } else {
        this.fromCode.set('EUR');
        this.toCode.set(DEFAULT_COMPARE_CODES[0] ?? 'PLN');
        this.compareCodes.set(DEFAULT_COMPARE_CODES.slice(0, 6));
      }
    });
  }

  protected swapCurrencies(): void {
    const tmp = this.fromCode();
    this.setFromCode(this.toCode());
    this.toCode.set(tmp);
  }

  protected setAmount(value: string): void {
    const parsed = parseFloat(value);
    this.amount.set(isNaN(parsed) || parsed < 0 ? 0 : parsed);
  }

  protected setFromCode(code: string): void {
    this.fromCode.set(code);
    this.setCompareCodes(this.compareCodes());

    if (this.toCode() === code) {
      const fallback = this.resolvedCompareCodes().find((candidate) => candidate !== code) ?? 'EUR';
      this.toCode.set(fallback === code ? 'PLN' : fallback);
    }
  }

  protected setProvider(id: CurrencyProviderId): void {
    this.currencyService.setSelectedProvider(id);
  }

  protected setCompareCodes(codes: string[]): void {
    const sanitized = Array.from(new Set(codes.filter((code) => code !== this.fromCode()))).slice(0, 6);
    this.compareCodes.set(sanitized);
  }

  protected setVisibleProviders(ids: string[]): void {
    const availableIds = this.currencyService.providers().map((provider) => provider.id);
    const nextIds = ids.filter((id): id is (typeof availableIds)[number] =>
      availableIds.includes(id as (typeof availableIds)[number]),
    );
    this.visibleProviderIds.set(nextIds.length ? nextIds : availableIds);
  }

  protected formatAmount(value: number, digits = 2): string {
    return new Intl.NumberFormat(this.localizationService.currentLocale(), {
      minimumFractionDigits: digits,
      maximumFractionDigits: Math.max(digits, 4),
    }).format(value);
  }

  protected formatRate(value: number, digits = 4): string {
    return new Intl.NumberFormat(this.localizationService.currentLocale(), {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    }).format(value);
  }

  protected formatPercent(value: number): string {
    const prefix = value > 0 ? '+' : '';
    return `${prefix}${this.formatRate(value, 2)}%`;
  }

  protected trendIcon(changePercent: number): string {
    if (changePercent > 0.001) {
      return 'north_east';
    }

    if (changePercent < -0.001) {
      return 'south_east';
    }

    return 'trending_flat';
  }

  protected trendClass(changePercent: number): string {
    if (changePercent > 0.001) {
      return 'trend-up';
    }

    if (changePercent < -0.001) {
      return 'trend-down';
    }

    return 'trend-flat';
  }
}
