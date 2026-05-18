export type Quarter = 'Q1' | 'Q2' | 'Q3' | 'Q4';

export interface SeasonalQuarterData {
  quarter: Quarter;
  aprTrend: number;
  propertyPriceTrend: number;
  label: string;
}

export interface CountrySeasonalPattern {
  countryCode: string;
  countryName: string;
  quarters: readonly SeasonalQuarterData[];
  confidenceScore: number;
  yearsAnalyzed: number;
  bestQuarterForMortgage: Quarter;
  bestQuarterForProperty: Quarter;
  nextEcbMeetingImpact: string;
}

export function getCurrentQuarter(): Quarter {
  const month = new Date().getMonth();

  if (month < 3) {
    return 'Q1';
  }

  if (month < 6) {
    return 'Q2';
  }

  if (month < 9) {
    return 'Q3';
  }

  return 'Q4';
}

export function getQuarterLabel(quarter: Quarter): string {
  switch (quarter) {
    case 'Q1':
      return 'I kwartał (sty–mar)';
    case 'Q2':
      return 'II kwartał (kwi–cze)';
    case 'Q3':
      return 'III kwartał (lip–wrz)';
    case 'Q4':
      return 'IV kwartał (paź–gru)';
  }
}

export const SEASONAL_PATTERNS: readonly CountrySeasonalPattern[] = [
  {
    countryCode: 'PL',
    countryName: 'Polska',
    quarters: [
      { quarter: 'Q1', aprTrend: -0.12, propertyPriceTrend: -1.8, label: 'Niższe ceny i RRSO — sezon zimowy' },
      { quarter: 'Q2', aprTrend: 0.05, propertyPriceTrend: 2.4, label: 'Wzrost popytu — sezon wiosenny' },
      { quarter: 'Q3', aprTrend: 0.08, propertyPriceTrend: 3.1, label: 'Szczyt sezonu — najwyższe ceny' },
      { quarter: 'Q4', aprTrend: -0.04, propertyPriceTrend: -0.6, label: 'Spadek aktywności — koniec roku' },
    ],
    confidenceScore: 78,
    yearsAnalyzed: 8,
    bestQuarterForMortgage: 'Q1',
    bestQuarterForProperty: 'Q1',
    nextEcbMeetingImpact: 'ECB może utrzymać stopy — stabilne RRSO w Q2',
  },
  {
    countryCode: 'DE',
    countryName: 'Niemcy',
    quarters: [
      { quarter: 'Q1', aprTrend: -0.08, propertyPriceTrend: -0.9, label: 'Lekkie korekty cenowe' },
      { quarter: 'Q2', aprTrend: 0.03, propertyPriceTrend: 1.6, label: 'Ożywienie rynku' },
      { quarter: 'Q3', aprTrend: 0.06, propertyPriceTrend: 1.2, label: 'Stabilny wzrost' },
      { quarter: 'Q4', aprTrend: -0.02, propertyPriceTrend: -0.4, label: 'Korekta końca roku' },
    ],
    confidenceScore: 82,
    yearsAnalyzed: 10,
    bestQuarterForMortgage: 'Q1',
    bestQuarterForProperty: 'Q4',
    nextEcbMeetingImpact: 'Decyzja ECB może obniżyć marże banków w Q2',
  },
  {
    countryCode: 'FR',
    countryName: 'Francja',
    quarters: [
      { quarter: 'Q1', aprTrend: -0.06, propertyPriceTrend: -1.2, label: 'Niższy popyt — zima' },
      { quarter: 'Q2', aprTrend: 0.04, propertyPriceTrend: 2.8, label: 'Ożywienie wiosenne' },
      { quarter: 'Q3', aprTrend: 0.02, propertyPriceTrend: 1.5, label: 'Lato — stabilizacja' },
      { quarter: 'Q4', aprTrend: -0.03, propertyPriceTrend: -0.8, label: 'Spadek — koniec roku' },
    ],
    confidenceScore: 75,
    yearsAnalyzed: 7,
    bestQuarterForMortgage: 'Q1',
    bestQuarterForProperty: 'Q1',
    nextEcbMeetingImpact: 'ECB utrzymuje trend — stabilne warunki kredytowe',
  },
  {
    countryCode: 'ES',
    countryName: 'Hiszpania',
    quarters: [
      { quarter: 'Q1', aprTrend: -0.1, propertyPriceTrend: -2.1, label: 'Zimowa korekta cen' },
      { quarter: 'Q2', aprTrend: 0.06, propertyPriceTrend: 3.8, label: 'Wiosenny boom — turystyka' },
      { quarter: 'Q3', aprTrend: 0.12, propertyPriceTrend: 4.5, label: 'Szczyt — wakacyjny popyt' },
      { quarter: 'Q4', aprTrend: -0.05, propertyPriceTrend: -1.0, label: 'Sezon niski — okazje' },
    ],
    confidenceScore: 72,
    yearsAnalyzed: 6,
    bestQuarterForMortgage: 'Q1',
    bestQuarterForProperty: 'Q4',
    nextEcbMeetingImpact: 'Możliwe obniżki stóp — korzystne dla kredytobiorców',
  },
  {
    countryCode: 'IT',
    countryName: 'Włochy',
    quarters: [
      { quarter: 'Q1', aprTrend: -0.05, propertyPriceTrend: -0.8, label: 'Stabilna korekta' },
      { quarter: 'Q2', aprTrend: 0.04, propertyPriceTrend: 1.9, label: 'Wzrost aktywności' },
      { quarter: 'Q3', aprTrend: 0.03, propertyPriceTrend: 1.1, label: 'Umiarkowany wzrost' },
      { quarter: 'Q4', aprTrend: -0.02, propertyPriceTrend: -0.5, label: 'Stabilizacja' },
    ],
    confidenceScore: 68,
    yearsAnalyzed: 6,
    bestQuarterForMortgage: 'Q1',
    bestQuarterForProperty: 'Q1',
    nextEcbMeetingImpact: 'Stopy ECB stabilne — warunki kredytowe bez zmian',
  },
  {
    countryCode: 'NL',
    countryName: 'Holandia',
    quarters: [
      { quarter: 'Q1', aprTrend: -0.09, propertyPriceTrend: -1.4, label: 'Korekta po szczycie' },
      { quarter: 'Q2', aprTrend: 0.07, propertyPriceTrend: 3.2, label: 'Silny wzrost popytu' },
      { quarter: 'Q3', aprTrend: 0.05, propertyPriceTrend: 2.1, label: 'Kontynuacja wzrostu' },
      { quarter: 'Q4', aprTrend: -0.03, propertyPriceTrend: -0.7, label: 'Spowolnienie końca roku' },
    ],
    confidenceScore: 80,
    yearsAnalyzed: 9,
    bestQuarterForMortgage: 'Q1',
    bestQuarterForProperty: 'Q1',
    nextEcbMeetingImpact: 'Holenderskie banki reagują szybko na decyzje ECB',
  },
  {
    countryCode: 'CZ',
    countryName: 'Czechy',
    quarters: [
      { quarter: 'Q1', aprTrend: -0.14, propertyPriceTrend: -2.0, label: 'Najniższe RRSO w roku' },
      { quarter: 'Q2', aprTrend: 0.08, propertyPriceTrend: 2.6, label: 'Ożywienie rynku' },
      { quarter: 'Q3', aprTrend: 0.1, propertyPriceTrend: 3.4, label: 'Szczyt sezonu' },
      { quarter: 'Q4', aprTrend: -0.06, propertyPriceTrend: -1.2, label: 'Korekta — okazje' },
    ],
    confidenceScore: 65,
    yearsAnalyzed: 5,
    bestQuarterForMortgage: 'Q1',
    bestQuarterForProperty: 'Q4',
    nextEcbMeetingImpact: 'CNB śledzi ECB — możliwe analogiczne obniżki',
  },
  {
    countryCode: 'SE',
    countryName: 'Szwecja',
    quarters: [
      { quarter: 'Q1', aprTrend: -0.07, propertyPriceTrend: -1.6, label: 'Zimowa korekta' },
      { quarter: 'Q2', aprTrend: 0.05, propertyPriceTrend: 2.2, label: 'Wiosenny wzrost' },
      { quarter: 'Q3', aprTrend: 0.04, propertyPriceTrend: 1.4, label: 'Stabilny okres' },
      { quarter: 'Q4', aprTrend: -0.03, propertyPriceTrend: -0.9, label: 'Korekta końca roku' },
    ],
    confidenceScore: 71,
    yearsAnalyzed: 7,
    bestQuarterForMortgage: 'Q1',
    bestQuarterForProperty: 'Q1',
    nextEcbMeetingImpact: 'Riksbank niezależny od ECB — inna dynamika stóp',
  },
  {
    countryCode: 'RO',
    countryName: 'Rumunia',
    quarters: [
      { quarter: 'Q1', aprTrend: -0.08, propertyPriceTrend: -1.0, label: 'Niski popyt zimowy' },
      { quarter: 'Q2', aprTrend: 0.06, propertyPriceTrend: 2.0, label: 'Ożywienie' },
      { quarter: 'Q3', aprTrend: 0.09, propertyPriceTrend: 2.8, label: 'Wzrost sezonu letniego' },
      { quarter: 'Q4', aprTrend: -0.04, propertyPriceTrend: -0.6, label: 'Stabilizacja' },
    ],
    confidenceScore: 55,
    yearsAnalyzed: 4,
    bestQuarterForMortgage: 'Q1',
    bestQuarterForProperty: 'Q1',
    nextEcbMeetingImpact: 'BNR koreluje z ECB — możliwy wpływ na ROBOR',
  },
  {
    countryCode: 'HU',
    countryName: 'Węgry',
    quarters: [
      { quarter: 'Q1', aprTrend: -0.11, propertyPriceTrend: -1.5, label: 'Korekta zimowa' },
      { quarter: 'Q2', aprTrend: 0.07, propertyPriceTrend: 2.9, label: 'Silne ożywienie' },
      { quarter: 'Q3', aprTrend: 0.08, propertyPriceTrend: 3.0, label: 'Kontynuacja wzrostu' },
      { quarter: 'Q4', aprTrend: -0.05, propertyPriceTrend: -0.8, label: 'Spadek — koniec roku' },
    ],
    confidenceScore: 58,
    yearsAnalyzed: 5,
    bestQuarterForMortgage: 'Q1',
    bestQuarterForProperty: 'Q1',
    nextEcbMeetingImpact: 'MNB może obniżyć stopy niezależnie od ECB',
  },
  {
    countryCode: 'IE',
    countryName: 'Irlandia',
    quarters: [
      { quarter: 'Q1', aprTrend: -0.06, propertyPriceTrend: -0.5, label: 'Lekka korekta' },
      { quarter: 'Q2', aprTrend: 0.04, propertyPriceTrend: 3.5, label: 'Silny popyt' },
      { quarter: 'Q3', aprTrend: 0.06, propertyPriceTrend: 2.8, label: 'Kontynuacja wzrostu' },
      { quarter: 'Q4', aprTrend: -0.02, propertyPriceTrend: -0.3, label: 'Stabilizacja' },
    ],
    confidenceScore: 74,
    yearsAnalyzed: 7,
    bestQuarterForMortgage: 'Q1',
    bestQuarterForProperty: 'Q1',
    nextEcbMeetingImpact: 'Irlandzkie banki szybko reagują na decyzje ECB',
  },
  {
    countryCode: 'PT',
    countryName: 'Portugalia',
    quarters: [
      { quarter: 'Q1', aprTrend: -0.09, propertyPriceTrend: -1.8, label: 'Korekta posezonowa' },
      { quarter: 'Q2', aprTrend: 0.05, propertyPriceTrend: 3.6, label: 'Wzrost — Golden Visa efekt' },
      { quarter: 'Q3', aprTrend: 0.11, propertyPriceTrend: 4.2, label: 'Szczyt turystyczny' },
      { quarter: 'Q4', aprTrend: -0.04, propertyPriceTrend: -0.9, label: 'Spadek aktywności' },
    ],
    confidenceScore: 62,
    yearsAnalyzed: 5,
    bestQuarterForMortgage: 'Q1',
    bestQuarterForProperty: 'Q4',
    nextEcbMeetingImpact: 'ECB wpływa bezpośrednio — Euribor kluczowy',
  },
];

export function findSeasonalPattern(countryCode: string): CountrySeasonalPattern | undefined {
  return SEASONAL_PATTERNS.find((pattern) => pattern.countryCode === countryCode);
}
