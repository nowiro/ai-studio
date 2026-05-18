/**
 * Domain model for a tire SKU as displayed in the catalogue.
 * Prices are stored in minor units (grosze) to avoid floating-point bugs.
 */
export interface Tire {
  readonly id: string;
  readonly brand: string;
  readonly model: string;
  readonly size: TireSize;
  readonly season: TireSeason;
  readonly speedIndex: SpeedIndex;
  readonly loadIndex: number;
  readonly euLabel: EuLabel;
  readonly priceCents: number;
  readonly oldPriceCents: number | null;
  readonly stock: number;
  readonly rating: number;
  readonly reviewCount: number;
  readonly imageUrl: string;
  readonly description: string;
}

/** Three numbers shoppers learn off the tire sidewall: 205 / 55 R 16. */
export interface TireSize {
  readonly width: number; // millimetres
  readonly profile: number; // height as % of width
  readonly diameter: number; // inches (rim)
}

export type TireSeason = 'summer' | 'winter' | 'all-season';

/**
 * Speed-index letter from the EU tire-marking standard. We restrict to the
 * passenger-car range a casual buyer will encounter. Order matters for sort.
 */
export type SpeedIndex = 'T' | 'H' | 'V' | 'W' | 'Y';

export const SPEED_INDEX_ORDER: readonly SpeedIndex[] = ['T', 'H', 'V', 'W', 'Y'];

/** EU-label component grades. `noiseDb` is the drive-by noise emission. */
export interface EuLabel {
  readonly fuel: EuLabelGrade;
  readonly wet: EuLabelGrade;
  readonly noiseDb: number;
}

export type EuLabelGrade = 'A' | 'B' | 'C' | 'D' | 'E';

export const EU_LABEL_GRADES: readonly EuLabelGrade[] = ['A', 'B', 'C', 'D', 'E'];
