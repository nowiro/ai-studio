import { TestBed } from '@angular/core/testing';

import { EMPTY } from 'rxjs';

import { CURRENCY_PROVIDERS, EU_CURRENCIES } from '../data/eu-exchange-rates';
import { CurrencyApiService } from './currency-api.service';
import { CurrencyService } from './currency.service';

describe('CurrencyService', () => {
  let service: CurrencyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: CurrencyApiService, useValue: { fetchRates: () => EMPTY } }],
    });
    service = TestBed.inject(CurrencyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should expose all configured currencies and providers', () => {
    expect(service.currencies()).toHaveLength(EU_CURRENCIES.length);
    expect(service.providers()).toHaveLength(CURRENCY_PROVIDERS.length);
    expect(service.rates()).toHaveLength(EU_CURRENCIES.length);
  });

  it('should build ratesMap with correct codes', () => {
    const map = service.ratesMap();
    expect(map.has('EUR')).toBe(true);
    expect(map.has('PLN')).toBe(true);
    expect(map.has('CZK')).toBe(true);
  });

  it('should default to aggregate provider', () => {
    expect(service.selectedProviderId()).toBe('aggregate');
    expect(service.source()).toContain('średnia');
  });

  it('should return same amount when converting same currency', () => {
    expect(service.convert(100, 'EUR', 'EUR')).toBe(100);
    expect(service.convert(200, 'PLN', 'PLN')).toBe(200);
  });

  it('should return same amount when amount is 0', () => {
    expect(service.convert(0, 'EUR', 'PLN')).toBe(0);
  });

  it('should correctly convert EUR to PLN using the aggregate view', () => {
    const result = service.convert(1, 'EUR', 'PLN');
    const expected =
      CURRENCY_PROVIDERS.reduce((sum, provider) => sum + provider.rates['PLN'].rateToEur, 0) /
      CURRENCY_PROVIDERS.length;
    expect(result).toBeCloseTo(expected, 4);
  });

  it('should correctly convert PLN to EUR', () => {
    const result = service.convert(100, 'PLN', 'EUR');
    const plnRate = service.ratesMap().get('PLN')!.rateToEur;
    expect(result).toBeCloseTo(100 / plnRate, 4);
  });

  it('should return rate of 1 for same currency', () => {
    expect(service.getRate('EUR', 'EUR')).toBe(1);
  });

  it('should return correct cross rate EUR/PLN', () => {
    const rate = service.getRate('EUR', 'PLN');
    const plnRate = service.ratesMap().get('PLN')!.rateToEur;
    expect(rate).toBeCloseTo(plnRate, 4);
  });

  it('should allow switching to a concrete provider', () => {
    service.setSelectedProvider('ecb');

    expect(service.selectedProviderId()).toBe('ecb');
    expect(service.source()).toContain('ECB');
    expect(service.getRate('EUR', 'PLN')).toBeCloseTo(CURRENCY_PROVIDERS[0].rates['PLN'].rateToEur, 4);
  });

  it('should return 0 for unknown currency in convert', () => {
    expect(service.convert(100, 'UNKNOWN', 'EUR')).toBe(0);
    expect(service.convert(100, 'EUR', 'UNKNOWN')).toBe(0);
  });

  it('should return 0 for unknown currency in getRate', () => {
    expect(service.getRate('UNKNOWN', 'EUR')).toBe(0);
  });

  it('should return currency by code via getCurrency', () => {
    const eur = service.getCurrency('EUR');
    expect(eur).toBeDefined();
    expect(eur!.code).toBe('EUR');
    expect(eur!.symbol).toBe('€');
  });

  it('should return undefined for unknown currency in getCurrency', () => {
    expect(service.getCurrency('UNKNOWN')).toBeUndefined();
  });

  it('should have a valid lastUpdated date', () => {
    expect(service.lastUpdated()).toBeInstanceOf(Date);
  });

  it('should have a non-empty source', () => {
    expect(service.source().length).toBeGreaterThan(0);
  });

  it('should expose comparison rows with provider breakdown and spread', () => {
    const rows = service.getComparisonRows('EUR', ['PLN', 'CZK']);

    expect(rows).toHaveLength(2);
    expect(rows[0].providerRates['ecb']).toBeGreaterThan(0);
    expect(rows[0].providerRates['frankfurter']).toBeGreaterThan(0);
    expect(rows[0].providerRates['floatrates']).toBeGreaterThan(0);
    expect(rows[0].spreadPercent).toBeGreaterThanOrEqual(0);
  });

  it('should expose trend series aligned with current rate', () => {
    const series = service.getTrendSeries('EUR', ['PLN']);

    expect(series).toHaveLength(1);
    expect(series[0].points.length).toBeGreaterThan(2);
    expect(series[0].points[series[0].points.length - 1].value).toBeCloseTo(service.getRate('EUR', 'PLN'), 4);
  });
});
