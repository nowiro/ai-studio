export type EcbOutlookStatus = 'GOOD_TIME' | 'NEUTRAL' | 'CAUTION' | 'WAIT';

export interface EcbMeeting {
  date: Date;
  label: string;
}

export interface EcbRateSnapshot {
  date: Date;
  mainRefinancingRate: number;
  depositFacilityRate: number;
}

export interface EcbOutlookData {
  status: EcbOutlookStatus;
  currentRate: number;
  depositRate: number;
  nextMeeting: EcbMeeting;
  meetings: readonly EcbMeeting[];
  rateHistory: readonly EcbRateSnapshot[];
  hintText: string;
  disclaimer: string;
}

export const ECB_MEETINGS: readonly EcbMeeting[] = [
  { date: new Date('2026-04-17'), label: 'Posiedzenie ECB — kwiecień 2026' },
  { date: new Date('2026-06-05'), label: 'Posiedzenie ECB — czerwiec 2026' },
  { date: new Date('2026-07-17'), label: 'Posiedzenie ECB — lipiec 2026' },
  { date: new Date('2026-09-11'), label: 'Posiedzenie ECB — wrzesień 2026' },
  { date: new Date('2026-10-29'), label: 'Posiedzenie ECB — październik 2026' },
  { date: new Date('2026-12-17'), label: 'Posiedzenie ECB — grudzień 2026' },
];

export const ECB_RATE_HISTORY: readonly EcbRateSnapshot[] = [
  { date: new Date('2024-06-06'), mainRefinancingRate: 4.25, depositFacilityRate: 3.75 },
  { date: new Date('2024-09-12'), mainRefinancingRate: 3.65, depositFacilityRate: 3.5 },
  { date: new Date('2024-10-17'), mainRefinancingRate: 3.4, depositFacilityRate: 3.25 },
  { date: new Date('2024-12-12'), mainRefinancingRate: 3.15, depositFacilityRate: 3.0 },
  { date: new Date('2025-01-30'), mainRefinancingRate: 2.9, depositFacilityRate: 2.75 },
  { date: new Date('2025-03-06'), mainRefinancingRate: 2.65, depositFacilityRate: 2.5 },
  { date: new Date('2025-04-17'), mainRefinancingRate: 2.4, depositFacilityRate: 2.25 },
  { date: new Date('2025-12-18'), mainRefinancingRate: 2.15, depositFacilityRate: 2.0 },
  { date: new Date('2026-01-29'), mainRefinancingRate: 2.15, depositFacilityRate: 2.0 },
  { date: new Date('2026-03-05'), mainRefinancingRate: 2.15, depositFacilityRate: 2.0 },
];

export function getNextEcbMeeting(): EcbMeeting {
  const now = new Date();
  return ECB_MEETINGS.find((meeting) => meeting.date > now) ?? ECB_MEETINGS[0];
}

export function getCurrentEcbRate(): EcbRateSnapshot {
  return ECB_RATE_HISTORY[ECB_RATE_HISTORY.length - 1];
}

export function getDaysUntilMeeting(meeting: EcbMeeting): number {
  const now = new Date();
  const diff = meeting.date.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function determineOutlookStatus(rateHistory: readonly EcbRateSnapshot[]): EcbOutlookStatus {
  if (rateHistory.length < 3) {
    return 'NEUTRAL';
  }

  const recent = rateHistory.slice(-3);
  const rateDiffs = recent
    .slice(1)
    .map((snapshot, index) => snapshot.mainRefinancingRate - recent[index].mainRefinancingRate);
  const avgDiff = rateDiffs.reduce((sum, diff) => sum + diff, 0) / rateDiffs.length;

  if (avgDiff < -0.15) {
    return 'GOOD_TIME';
  }

  if (avgDiff > 0.15) {
    return 'WAIT';
  }

  if (avgDiff > 0.05) {
    return 'CAUTION';
  }

  return 'NEUTRAL';
}

export function getOutlookHintText(status: EcbOutlookStatus): string {
  switch (status) {
    case 'GOOD_TIME':
      return 'Stopy procentowe ECB spadają — historycznie to dobry moment na zaciągnięcie kredytu hipotecznego.';
    case 'NEUTRAL':
      return 'Stopy procentowe ECB są stabilne — brak wyraźnego trendu zmian w najbliższym czasie.';
    case 'CAUTION':
      return 'Stopy procentowe ECB wykazują lekką tendencję wzrostową — warto monitorować sytuację.';
    case 'WAIT':
      return 'Stopy procentowe ECB rosną — rozważ poczekanie na stabilizację lub negocjuj stałe oprocentowanie.';
  }
}

export function getEcbOutlookData(): EcbOutlookData {
  const currentRate = getCurrentEcbRate();
  const nextMeeting = getNextEcbMeeting();
  const status = determineOutlookStatus(ECB_RATE_HISTORY);

  return {
    status,
    currentRate: currentRate.mainRefinancingRate,
    depositRate: currentRate.depositFacilityRate,
    nextMeeting,
    meetings: ECB_MEETINGS,
    rateHistory: ECB_RATE_HISTORY,
    hintText: getOutlookHintText(status),
    disclaimer: 'Nie stanowi porady finansowej. Dane mają charakter informacyjny i edukacyjny.',
  };
}
