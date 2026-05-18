import { computed, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
  CURRENCY_PROVIDERS,
  CurrencyDefinition,
  CurrencyProviderId,
  DEFAULT_PROVIDER_ID,
  EU_CURRENCIES,
  ExchangeRateProvider,
  HistoricalRatePoint,
  ProviderRateSnapshot,
} from '../data/eu-exchange-rates';
import { CurrencyApiService } from './currency-api.service';

export interface CurrencyProviderOption {
  id: CurrencyProviderId;
  name: string;
  shortName: string;
  description: string;
}

export interface ExchangeRateView extends CurrencyDefinition {
  rateToEur: number;
  previousRateToEur: number;
  change: number;
  changePercent: number;
  history: HistoricalRatePoint[];
}

export interface CurrencyComparisonRow extends CurrencyDefinition {
  activeRate: number;
  averageRate: number;
  change: number;
  changePercent: number;
  spreadPercent: number;
  providerRates: Record<string, number>;
}

export interface CurrencyTrendSeries {
  code: string;
  name: string;
  points: {
    timestamp: Date;
    value: number;
  }[];
}

interface ResolvedProviderSnapshot {
  id: CurrencyProviderId;
  name: string;
  shortName: string;
  description: string;
  cadence: string;
  lastUpdated: Date;
  rates: Record<string, ProviderRateSnapshot>;
}

@Injectable({ providedIn: 'root' })
export class CurrencyService {
  private readonly apiService = inject(CurrencyApiService);

  readonly currencies = signal<CurrencyDefinition[]>(EU_CURRENCIES);
  readonly providers = signal<ExchangeRateProvider[]>(CURRENCY_PROVIDERS);
  readonly selectedProviderId = signal<CurrencyProviderId>(DEFAULT_PROVIDER_ID);

  readonly providerOptions = computed<CurrencyProviderOption[]>(() => [
    {
      id: 'aggregate',
      name: `Domyślne aplikacji (średnia z ${this.providers().length} feedów)`,
      shortName: 'Średnia',
      description: 'Normalizowana średnia z wielu darmowych źródeł dostępnych w aplikacji.',
    },
    ...this.providers().map((provider) => ({
      id: provider.id,
      name: provider.name,
      shortName: provider.shortName,
      description: provider.description,
    })),
  ]);

  private readonly currencyMap = computed(() => {
    const map = new Map<string, CurrencyDefinition>();
    for (const currency of this.currencies()) {
      map.set(currency.code, currency);
    }
    return map;
  });

  private readonly providerMap = computed(() => {
    const map = new Map<ExchangeRateProvider['id'], ExchangeRateProvider>();
    for (const provider of this.providers()) {
      map.set(provider.id, provider);
    }
    return map;
  });

  private readonly aggregateProvider = computed<ResolvedProviderSnapshot>(() => {
    const providers = this.providers();
    const rates: Record<string, ProviderRateSnapshot> = {};

    for (const currency of this.currencies()) {
      const snapshots = providers.map((provider) => provider.rates[currency.code]).filter(Boolean);
      const historyLength = snapshots[0]?.history.length ?? 0;
      const history: HistoricalRatePoint[] = [];

      for (let index = 0; index < historyLength; index += 1) {
        const timestamp = snapshots[0]?.history[index]?.timestamp ?? new Date();
        const values = snapshots.map((snapshot) => snapshot.history[index]?.rateToEur ?? snapshot.rateToEur);
        history.push({
          timestamp,
          rateToEur: this.average(values),
        });
      }

      rates[currency.code] = {
        rateToEur: this.average(snapshots.map((snapshot) => snapshot.rateToEur)),
        previousRateToEur: this.average(snapshots.map((snapshot) => snapshot.previousRateToEur)),
        history,
      };
    }

    return {
      id: 'aggregate',
      name: `Domyślne aplikacji (średnia z ${providers.length} feedów)`,
      shortName: 'Średnia',
      description:
        'Uśredniony widok kursów z wielu darmowych feedów dla lepszej czytelności i mniejszego ryzyka odchyłek pojedynczego źródła.',
      cadence: 'Normalizowany snapshot aplikacyjny',
      lastUpdated: new Date(Math.max(...providers.map((provider) => provider.lastUpdated.getTime()))),
      rates,
    };
  });

  readonly selectedProvider = computed<ResolvedProviderSnapshot>(() => this.resolveProvider(this.selectedProviderId()));

  readonly rates = computed<ExchangeRateView[]>(() => this.buildRateRows(this.selectedProvider()));
  readonly lastUpdated = computed<Date>(() => this.selectedProvider().lastUpdated);
  readonly source = computed<string>(() => this.selectedProvider().name);
  readonly sourceDescription = computed<string>(() => this.selectedProvider().description);
  readonly sourceCadence = computed<string>(() => this.selectedProvider().cadence);

  readonly ratesMap = computed(() => {
    const map = new Map<string, ExchangeRateView>();
    for (const rate of this.rates()) {
      map.set(rate.code, rate);
    }
    return map;
  });

  constructor() {
    this.apiService
      .fetchRates()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (liveRates) => {
          if (!Object.keys(liveRates).length) return;
          this.providers.update((providers) => providers.map((provider) => this.applyLiveRates(provider, liveRates)));
        },
      });
  }

  setSelectedProvider(id: CurrencyProviderId): void {
    this.selectedProviderId.set(id);
  }

  convert(amount: number, fromCode: string, toCode: string, providerId = this.selectedProviderId()): number {
    if (amount <= 0 || fromCode === toCode) {
      return amount;
    }

    return amount * this.getRate(fromCode, toCode, providerId);
  }

  getRate(fromCode: string, toCode: string, providerId = this.selectedProviderId()): number {
    if (fromCode === toCode) {
      return 1;
    }

    const provider = this.resolveProvider(providerId);
    return this.getPairRate(provider, fromCode, toCode);
  }

  getCurrency(code: string): CurrencyDefinition | undefined {
    return this.currencyMap().get(code);
  }

  getComparisonRows(
    baseCode: string,
    compareCodes: string[],
    providerId = this.selectedProviderId(),
  ): CurrencyComparisonRow[] {
    const activeProvider = this.resolveProvider(providerId);
    const aggregateProvider = this.aggregateProvider();
    const visibleProviders = this.providers();

    return compareCodes
      .filter((code) => code !== baseCode)
      .filter((code) => this.currencyMap().has(code))
      .map((code) => {
        // Existence guaranteed by the `.filter((code) => this.currencyMap().has(code))` step above;
        // the `??` fallback exists only so TypeScript's strict null checks pass.
        const currency = this.currencyMap().get(code) ?? {
          code,
          name: code,
          nameEn: code,
          symbol: code,
          flag: '🇪🇺',
          flagCode: '',
          isEurozone: false,
        };
        const activeRate = this.getPairRate(activeProvider, baseCode, code);
        const previousRate = this.getPreviousPairRate(activeProvider, baseCode, code);
        const providerRates = Object.fromEntries(
          visibleProviders.map((provider) => [provider.id, this.getPairRate(provider, baseCode, code)]),
        );
        const spreadValues = Object.values(providerRates);
        const spreadMid = this.average(spreadValues);
        const change = activeRate - previousRate;

        return {
          ...currency,
          activeRate,
          averageRate: this.getPairRate(aggregateProvider, baseCode, code),
          change,
          changePercent: previousRate === 0 ? 0 : (change / previousRate) * 100,
          spreadPercent:
            spreadMid === 0 ? 0 : ((Math.max(...spreadValues) - Math.min(...spreadValues)) / spreadMid) * 100,
          providerRates,
        };
      });
  }

  getTrendSeries(
    baseCode: string,
    compareCodes: string[],
    providerId = this.selectedProviderId(),
  ): CurrencyTrendSeries[] {
    const provider = this.resolveProvider(providerId);

    return compareCodes
      .filter((code) => code !== baseCode)
      .filter((code) => this.currencyMap().has(code))
      .map((code) => {
        // Existence guaranteed by the `.filter((code) => this.currencyMap().has(code))` step above;
        // the `??` fallback exists only so TypeScript's strict null checks pass.
        const currency = this.currencyMap().get(code) ?? {
          code,
          name: code,
          nameEn: code,
          symbol: code,
          flag: '🇪🇺',
          flagCode: '',
          isEurozone: false,
        };
        const baseHistory = provider.rates[baseCode]?.history ?? [];
        const quoteHistory = provider.rates[code]?.history ?? [];
        const pointCount = Math.min(baseHistory.length, quoteHistory.length);

        return {
          code,
          name: currency.name,
          points: Array.from({ length: pointCount }, (_, index) => ({
            timestamp: quoteHistory[index].timestamp,
            value:
              baseHistory[index].rateToEur === 0 ? 0 : quoteHistory[index].rateToEur / baseHistory[index].rateToEur,
          })),
        };
      });
  }

  private applyLiveRates(provider: ExchangeRateProvider, liveRates: Record<string, number>): ExchangeRateProvider {
    const updatedRates: Record<string, ProviderRateSnapshot> = {};
    for (const [code, snapshot] of Object.entries(provider.rates)) {
      const liveRate = liveRates[code];
      updatedRates[code] =
        liveRate != null && liveRate > 0
          ? {
              rateToEur: liveRate,
              previousRateToEur: snapshot.rateToEur,
              history: snapshot.history.map((point, index, arr) =>
                index === arr.length - 1 ? { timestamp: new Date(), rateToEur: liveRate } : point,
              ),
            }
          : snapshot;
    }
    return { ...provider, rates: updatedRates, lastUpdated: new Date() };
  }

  private resolveProvider(id: CurrencyProviderId): ResolvedProviderSnapshot {
    if (id === 'aggregate') {
      return this.aggregateProvider();
    }

    const provider = this.providerMap().get(id);
    return provider ?? this.aggregateProvider();
  }

  private buildRateRows(provider: ResolvedProviderSnapshot): ExchangeRateView[] {
    return this.currencies().map((currency) => {
      const snapshot = provider.rates[currency.code];
      const change = snapshot.rateToEur - snapshot.previousRateToEur;

      return {
        ...currency,
        rateToEur: snapshot.rateToEur,
        previousRateToEur: snapshot.previousRateToEur,
        change,
        changePercent: snapshot.previousRateToEur === 0 ? 0 : (change / snapshot.previousRateToEur) * 100,
        history: snapshot.history,
      };
    });
  }

  private getPairRate(
    provider: ResolvedProviderSnapshot | ExchangeRateProvider,
    fromCode: string,
    toCode: string,
  ): number {
    const from = provider.rates[fromCode];
    const to = provider.rates[toCode];

    if (!from || !to || from.rateToEur === 0) {
      return 0;
    }

    return to.rateToEur / from.rateToEur;
  }

  private getPreviousPairRate(
    provider: ResolvedProviderSnapshot | ExchangeRateProvider,
    fromCode: string,
    toCode: string,
  ): number {
    const from = provider.rates[fromCode];
    const to = provider.rates[toCode];

    if (!from || !to || from.previousRateToEur === 0) {
      return 0;
    }

    return to.previousRateToEur / from.previousRateToEur;
  }

  private average(values: number[]): number {
    if (!values.length) {
      return 0;
    }

    return values.reduce((sum, value) => sum + value, 0) / values.length;
  }
}
