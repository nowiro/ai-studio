export type MarketTemperature = 'HOT' | 'BALANCED' | 'COOL';

export interface MarketTemperatureData {
  countryCode: string;
  countryName: string;
  score: number;
  temperature: MarketTemperature;
  avgDaysOnMarket: number;
  listingsGrowth30d: number;
  priceTrendYoy: number;
  medianPricePerSqm: number;
  demandSupplyRatio: number;
  lastUpdated: Date;
}

export function resolveTemperature(score: number): MarketTemperature {
  if (score > 0.7) {
    return 'HOT';
  }

  if (score >= 0.4) {
    return 'BALANCED';
  }

  return 'COOL';
}

export function getTemperatureEmoji(temperature: MarketTemperature): string {
  switch (temperature) {
    case 'HOT':
      return '🔥';
    case 'BALANCED':
      return '🌤️';
    case 'COOL':
      return '❄️';
  }
}

export function getTemperatureLabel(temperature: MarketTemperature): string {
  switch (temperature) {
    case 'HOT':
      return 'Gorący rynek';
    case 'BALANCED':
      return 'Zrównoważony';
    case 'COOL':
      return 'Chłodny rynek';
  }
}

// Snapshot date for the entire dataset — extracted to avoid `no-duplicate-string`
// firing on each entry (every row shares the same daily snapshot).
const SNAPSHOT_DATE = new Date('2026-03-19');

export const MARKET_TEMPERATURE_DATA: readonly MarketTemperatureData[] = [
  {
    countryCode: 'PL',
    countryName: 'Polska',
    score: 0.74,
    temperature: 'HOT',
    avgDaysOnMarket: 38,
    listingsGrowth30d: 12.4,
    priceTrendYoy: 8.2,
    medianPricePerSqm: 2850,
    demandSupplyRatio: 1.45,
    lastUpdated: SNAPSHOT_DATE,
  },
  {
    countryCode: 'DE',
    countryName: 'Niemcy',
    score: 0.52,
    temperature: 'BALANCED',
    avgDaysOnMarket: 62,
    listingsGrowth30d: 3.1,
    priceTrendYoy: -1.4,
    medianPricePerSqm: 3420,
    demandSupplyRatio: 0.98,
    lastUpdated: SNAPSHOT_DATE,
  },
  {
    countryCode: 'FR',
    countryName: 'Francja',
    score: 0.48,
    temperature: 'BALANCED',
    avgDaysOnMarket: 71,
    listingsGrowth30d: 1.8,
    priceTrendYoy: -2.1,
    medianPricePerSqm: 3180,
    demandSupplyRatio: 0.91,
    lastUpdated: SNAPSHOT_DATE,
  },
  {
    countryCode: 'ES',
    countryName: 'Hiszpania',
    score: 0.78,
    temperature: 'HOT',
    avgDaysOnMarket: 34,
    listingsGrowth30d: 15.2,
    priceTrendYoy: 9.6,
    medianPricePerSqm: 2240,
    demandSupplyRatio: 1.62,
    lastUpdated: SNAPSHOT_DATE,
  },
  {
    countryCode: 'IT',
    countryName: 'Włochy',
    score: 0.44,
    temperature: 'BALANCED',
    avgDaysOnMarket: 84,
    listingsGrowth30d: -0.6,
    priceTrendYoy: 1.2,
    medianPricePerSqm: 2080,
    demandSupplyRatio: 0.88,
    lastUpdated: SNAPSHOT_DATE,
  },
  {
    countryCode: 'NL',
    countryName: 'Holandia',
    score: 0.71,
    temperature: 'HOT',
    avgDaysOnMarket: 29,
    listingsGrowth30d: 8.7,
    priceTrendYoy: 6.8,
    medianPricePerSqm: 4150,
    demandSupplyRatio: 1.52,
    lastUpdated: SNAPSHOT_DATE,
  },
  {
    countryCode: 'CZ',
    countryName: 'Czechy',
    score: 0.63,
    temperature: 'BALANCED',
    avgDaysOnMarket: 48,
    listingsGrowth30d: 5.9,
    priceTrendYoy: 4.3,
    medianPricePerSqm: 2680,
    demandSupplyRatio: 1.18,
    lastUpdated: SNAPSHOT_DATE,
  },
  {
    countryCode: 'SE',
    countryName: 'Szwecja',
    score: 0.35,
    temperature: 'COOL',
    avgDaysOnMarket: 92,
    listingsGrowth30d: -3.2,
    priceTrendYoy: -4.1,
    medianPricePerSqm: 3860,
    demandSupplyRatio: 0.74,
    lastUpdated: SNAPSHOT_DATE,
  },
  {
    countryCode: 'RO',
    countryName: 'Rumunia',
    score: 0.58,
    temperature: 'BALANCED',
    avgDaysOnMarket: 55,
    listingsGrowth30d: 4.1,
    priceTrendYoy: 3.8,
    medianPricePerSqm: 1420,
    demandSupplyRatio: 1.06,
    lastUpdated: SNAPSHOT_DATE,
  },
  {
    countryCode: 'HU',
    countryName: 'Węgry',
    score: 0.67,
    temperature: 'BALANCED',
    avgDaysOnMarket: 42,
    listingsGrowth30d: 7.3,
    priceTrendYoy: 5.9,
    medianPricePerSqm: 1980,
    demandSupplyRatio: 1.28,
    lastUpdated: SNAPSHOT_DATE,
  },
  {
    countryCode: 'IE',
    countryName: 'Irlandia',
    score: 0.82,
    temperature: 'HOT',
    avgDaysOnMarket: 22,
    listingsGrowth30d: 18.4,
    priceTrendYoy: 11.2,
    medianPricePerSqm: 4580,
    demandSupplyRatio: 1.78,
    lastUpdated: SNAPSHOT_DATE,
  },
  {
    countryCode: 'PT',
    countryName: 'Portugalia',
    score: 0.76,
    temperature: 'HOT',
    avgDaysOnMarket: 31,
    listingsGrowth30d: 14.1,
    priceTrendYoy: 10.4,
    medianPricePerSqm: 2560,
    demandSupplyRatio: 1.58,
    lastUpdated: SNAPSHOT_DATE,
  },
  {
    countryCode: 'BG',
    countryName: 'Bułgaria',
    score: 0.54,
    temperature: 'BALANCED',
    avgDaysOnMarket: 58,
    listingsGrowth30d: 2.8,
    priceTrendYoy: 2.4,
    medianPricePerSqm: 1120,
    demandSupplyRatio: 1.02,
    lastUpdated: SNAPSHOT_DATE,
  },
  {
    countryCode: 'DK',
    countryName: 'Dania',
    score: 0.38,
    temperature: 'COOL',
    avgDaysOnMarket: 88,
    listingsGrowth30d: -1.9,
    priceTrendYoy: -2.8,
    medianPricePerSqm: 3740,
    demandSupplyRatio: 0.82,
    lastUpdated: SNAPSHOT_DATE,
  },
];

export function findMarketData(countryCode: string): MarketTemperatureData | undefined {
  return MARKET_TEMPERATURE_DATA.find((data) => data.countryCode === countryCode);
}
