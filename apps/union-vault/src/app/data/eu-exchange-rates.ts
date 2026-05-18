export type CurrencyProviderId = 'aggregate' | 'ecb' | 'frankfurter' | 'floatrates';

export interface CurrencyDefinition {
  code: string;
  name: string;
  nameEn: string;
  symbol: string;
  flag: string;
  flagCode: string;
  isEurozone: boolean;
}

export interface HistoricalRatePoint {
  timestamp: Date;
  rateToEur: number;
}

export interface ProviderRateSnapshot {
  rateToEur: number;
  previousRateToEur: number;
  history: HistoricalRatePoint[];
}

export interface ExchangeRateProvider {
  id: Exclude<CurrencyProviderId, 'aggregate'>;
  name: string;
  shortName: string;
  description: string;
  cadence: string;
  url: string;
  lastUpdated: Date;
  rates: Record<string, ProviderRateSnapshot>;
}

export const EU_CURRENCIES: CurrencyDefinition[] = [
  {
    code: 'EUR',
    name: 'Euro',
    nameEn: 'Euro',
    symbol: '€',
    flag: '🇪🇺',
    flagCode: 'eu',
    isEurozone: true,
  },
  {
    code: 'BGN',
    name: 'Lew bułgarski',
    nameEn: 'Bulgarian Lev',
    symbol: 'лв',
    flag: '🇧🇬',
    flagCode: 'bg',
    isEurozone: false,
  },
  {
    code: 'CZK',
    name: 'Korona czeska',
    nameEn: 'Czech Koruna',
    symbol: 'Kč',
    flag: '🇨🇿',
    flagCode: 'cz',
    isEurozone: false,
  },
  {
    code: 'DKK',
    name: 'Korona duńska',
    nameEn: 'Danish Krone',
    symbol: 'kr',
    flag: '🇩🇰',
    flagCode: 'dk',
    isEurozone: false,
  },
  {
    code: 'HUF',
    name: 'Forint węgierski',
    nameEn: 'Hungarian Forint',
    symbol: 'Ft',
    flag: '🇭🇺',
    flagCode: 'hu',
    isEurozone: false,
  },
  {
    code: 'PLN',
    name: 'Złoty polski',
    nameEn: 'Polish Zloty',
    symbol: 'zł',
    flag: '🇵🇱',
    flagCode: 'pl',
    isEurozone: false,
  },
  {
    code: 'RON',
    name: 'Lej rumuński',
    nameEn: 'Romanian Leu',
    symbol: 'lei',
    flag: '🇷🇴',
    flagCode: 'ro',
    isEurozone: false,
  },
  {
    code: 'SEK',
    name: 'Korona szwedzka',
    nameEn: 'Swedish Krona',
    symbol: 'kr',
    flag: '🇸🇪',
    flagCode: 'se',
    isEurozone: false,
  },
];

export const DEFAULT_COMPARE_CODES = ['PLN', 'CZK', 'SEK', 'RON'];

const HISTORY_TIMESTAMPS = [
  '2026-03-13T12:00:00+01:00',
  '2026-03-14T12:00:00+01:00',
  '2026-03-15T12:00:00+01:00',
  '2026-03-16T12:00:00+01:00',
  '2026-03-17T12:00:00+01:00',
  '2026-03-18T12:00:00+01:00',
  '2026-03-19T11:55:00+01:00',
];

function buildHistory(values: number[]): HistoricalRatePoint[] {
  return HISTORY_TIMESTAMPS.map((timestamp, index) => ({
    timestamp: new Date(timestamp),
    rateToEur: values[index] ?? values[values.length - 1] ?? 0,
  }));
}

function buildSnapshot(values: number[]): ProviderRateSnapshot {
  const history = buildHistory(values);
  const rateToEur = history[history.length - 1]?.rateToEur ?? 0;
  const previousRateToEur = history[history.length - 2]?.rateToEur ?? rateToEur;

  return {
    rateToEur,
    previousRateToEur,
    history,
  };
}

function buildRates(seriesByCurrency: Record<string, number[]>): Record<string, ProviderRateSnapshot> {
  const rates: Record<string, ProviderRateSnapshot> = {};

  for (const currency of EU_CURRENCIES) {
    if (currency.code === 'EUR') {
      const eurOnes: number[] = Array.from({ length: HISTORY_TIMESTAMPS.length }, () => 1);
      rates['EUR'] = buildSnapshot(eurOnes);
      continue;
    }

    const series = seriesByCurrency[currency.code];
    if (!series) {
      throw new Error(`Missing rate series for ${currency.code}`);
    }

    rates[currency.code] = buildSnapshot(series);
  }

  return rates;
}

const ECB_SERIES: Record<string, number[]> = {
  BGN: [1.9558, 1.9558, 1.9558, 1.9558, 1.9558, 1.9558, 1.9558],
  CZK: [24.832, 24.756, 24.688, 24.604, 24.551, 24.512, 24.467],
  DKK: [7.4628, 7.4664, 7.4689, 7.4701, 7.4712, 7.4715, 7.472],
  HUF: [399.4, 398.7, 397.6, 396.2, 394.8, 394.1, 392.83],
  PLN: [4.3321, 4.3198, 4.3062, 4.2955, 4.2891, 4.287, 4.2713],
  RON: [5.0812, 5.0831, 5.0857, 5.0864, 5.0873, 5.0882, 5.0938],
  SEK: [11.183, 11.147, 11.122, 11.108, 11.101, 11.093, 11.0175],
};

const FRANKFURTER_SERIES: Record<string, number[]> = {
  BGN: [1.9558, 1.9558, 1.9558, 1.9558, 1.9558, 1.9558, 1.9558],
  CZK: [24.801, 24.741, 24.671, 24.598, 24.534, 24.498, 24.452],
  DKK: [7.4634, 7.4668, 7.4682, 7.4697, 7.4708, 7.4712, 7.4718],
  HUF: [400.1, 399.1, 397.9, 396.5, 395.2, 394.6, 393.15],
  PLN: [4.3298, 4.3185, 4.3041, 4.2922, 4.2862, 4.2815, 4.2738],
  RON: [5.0795, 5.0818, 5.0842, 5.0851, 5.0863, 5.087, 5.0891],
  SEK: [11.168, 11.135, 11.114, 11.099, 11.087, 11.066, 11.0294],
};

const FLOAT_RATES_SERIES: Record<string, number[]> = {
  BGN: [1.9561, 1.956, 1.956, 1.9559, 1.9559, 1.9559, 1.956],
  CZK: [24.861, 24.792, 24.713, 24.631, 24.576, 24.521, 24.481],
  DKK: [7.4641, 7.4676, 7.4694, 7.4712, 7.4722, 7.4725, 7.4734],
  HUF: [401.3, 400.2, 398.9, 397.2, 396.1, 395.4, 393.72],
  PLN: [4.3355, 4.3231, 4.3095, 4.2987, 4.2918, 4.2864, 4.2679],
  RON: [5.0862, 5.0881, 5.0914, 5.094, 5.0968, 5.0981, 5.1012],
  SEK: [11.196, 11.159, 11.133, 11.117, 11.109, 11.091, 11.0418],
};

export const CURRENCY_PROVIDERS: ExchangeRateProvider[] = [
  {
    id: 'ecb',
    name: 'European Central Bank (ECB)',
    shortName: 'ECB',
    description: 'Oficjalny referencyjny feed kursów euro publikowany przez ECB.',
    cadence: 'Dni robocze, referencyjny snapshot dzienny',
    url: 'https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml',
    lastUpdated: new Date('2026-03-19T10:15:00+01:00'),
    rates: buildRates(ECB_SERIES),
  },
  {
    id: 'frankfurter',
    name: 'Frankfurter API',
    shortName: 'Frankfurter',
    description: 'Darmowe API z aktualnymi i historycznymi kursami, gotowe do użycia po stronie aplikacji.',
    cadence: 'Dni robocze, snapshot dzienny i serie historyczne',
    url: 'https://api.frankfurter.dev/v1/latest',
    lastUpdated: new Date('2026-03-19T10:40:00+01:00'),
    rates: buildRates(FRANKFURTER_SERIES),
  },
  {
    id: 'floatrates',
    name: 'FloatRates JSON Feed',
    shortName: 'FloatRates',
    description: 'Darmowy feed JSON z kursami i szerokim pokryciem walut do porównań i sanity-checków.',
    cadence: 'Około dwa snapshoty dziennie',
    url: 'https://www.floatrates.com/json-feeds.html',
    lastUpdated: new Date('2026-03-19T11:55:00+01:00'),
    rates: buildRates(FLOAT_RATES_SERIES),
  },
];

export const EUROZONE_CURRENCIES: CurrencyDefinition[] = EU_CURRENCIES.filter((currency) => currency.isEurozone);
export const NON_EURO_CURRENCIES: CurrencyDefinition[] = EU_CURRENCIES.filter((currency) => !currency.isEurozone);
export const DEFAULT_PROVIDER_ID: CurrencyProviderId = 'aggregate';
