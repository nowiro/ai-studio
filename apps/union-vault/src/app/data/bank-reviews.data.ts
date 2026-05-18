export interface BankReviewData {
  bankId: string;
  bankName: string;
  ratingAvg: number;
  reviewCount: number;
  recommendPct: number;
  sourceName: string;
}

export const BANK_REVIEWS: readonly BankReviewData[] = [
  {
    bankId: 'pl-santander',
    bankName: 'Santander Bank Polska',
    ratingAvg: 3.8,
    reviewCount: 1247,
    recommendPct: 89,
    sourceName: 'Trustpilot',
  },
  {
    bankId: 'pl-mbank',
    bankName: 'mBank',
    ratingAvg: 4.1,
    reviewCount: 2034,
    recommendPct: 92,
    sourceName: 'Trustpilot',
  },
  {
    bankId: 'pl-ing',
    bankName: 'ING Bank Śląski',
    ratingAvg: 3.9,
    reviewCount: 876,
    recommendPct: 87,
    sourceName: 'Trustpilot',
  },
  {
    bankId: 'de-db',
    bankName: 'Deutsche Bank',
    ratingAvg: 3.4,
    reviewCount: 3412,
    recommendPct: 74,
    sourceName: 'Trustpilot',
  },
  {
    bankId: 'de-commerzbank',
    bankName: 'Commerzbank',
    ratingAvg: 3.6,
    reviewCount: 1890,
    recommendPct: 78,
    sourceName: 'Trustpilot',
  },
  {
    bankId: 'fr-bnp',
    bankName: 'BNP Paribas',
    ratingAvg: 3.5,
    reviewCount: 4521,
    recommendPct: 76,
    sourceName: 'Trustpilot',
  },
  {
    bankId: 'es-caixabank',
    bankName: 'CaixaBank',
    ratingAvg: 3.7,
    reviewCount: 2145,
    recommendPct: 81,
    sourceName: 'Trustpilot',
  },
  {
    bankId: 'es-bbva',
    bankName: 'BBVA',
    ratingAvg: 3.9,
    reviewCount: 5678,
    recommendPct: 85,
    sourceName: 'Trustpilot',
  },
  {
    bankId: 'it-unicredit',
    bankName: 'UniCredit',
    ratingAvg: 3.3,
    reviewCount: 3102,
    recommendPct: 71,
    sourceName: 'Trustpilot',
  },
  {
    bankId: 'nl-ing',
    bankName: 'ING Netherlands',
    ratingAvg: 4.0,
    reviewCount: 1567,
    recommendPct: 88,
    sourceName: 'Trustpilot',
  },
  {
    bankId: 'ie-boi',
    bankName: 'Bank of Ireland',
    ratingAvg: 3.6,
    reviewCount: 982,
    recommendPct: 79,
    sourceName: 'Trustpilot',
  },
  {
    bankId: 'cz-ceska',
    bankName: 'Česká spořitelna',
    ratingAvg: 3.7,
    reviewCount: 743,
    recommendPct: 82,
    sourceName: 'Trustpilot',
  },
];

export function findBankReview(offerId: string): BankReviewData | undefined {
  return BANK_REVIEWS.find((review) => offerId.startsWith(review.bankId));
}
