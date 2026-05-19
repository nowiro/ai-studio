/**
 * Bulk-pricing tiers for the tools shop demo.
 *
 * A {@link BulkPricingScheme} declares a base unit price plus a sorted list of
 * volume discounts (tiers). When the requested quantity reaches a tier's
 * `minQty`, the per-unit price drops to that tier's `unitPriceGrosze`.
 *
 * All prices are stored in *grosze* (1/100 PLN) as integers — the same unit
 * convention used by {@link Tool.priceCents} in `@ai-studio/shop-core`.
 *
 * @packageDocumentation
 */

/** A single bulk-discount step. `minQty` activates `unitPriceGrosze`. */
export interface BulkPricingTier {
  /** Minimum quantity required for this tier to apply. Must be ≥ 1 and integer. */
  readonly minQty: number;
  /** Per-unit price (grosze, integer) once `minQty` is reached. Must be ≥ 0. */
  readonly unitPriceGrosze: number;
}

/** Complete pricing scheme: base price + zero-or-more sorted discount tiers. */
export interface BulkPricingScheme {
  /** Per-unit price (grosze, integer) when no tier applies. */
  readonly basePriceGrosze: number;
  /** Tiers sorted by `minQty` ascending; prices must be strictly decreasing. */
  readonly tiers: readonly BulkPricingTier[];
}

/** Result of applying a {@link BulkPricingScheme} to a given quantity. */
export interface AppliedPricing {
  /** Effective per-unit price after tier selection. */
  readonly unitPriceGrosze: number;
  /** Total = `unitPriceGrosze * qty`. */
  readonly totalGrosze: number;
  /** Zero-based index of the applied tier, or `null` when base price is used. */
  readonly tierApplied: number | null;
  /** `(basePriceGrosze - unitPriceGrosze) * qty`. Always ≥ 0. */
  readonly savingsGrosze: number;
}

/**
 * Apply a bulk-pricing scheme to a quantity.
 *
 * Picks the highest-`minQty` tier whose threshold is ≤ `qty`. Falls back to
 * the base price when no tier qualifies (or when there are no tiers).
 *
 * @throws RangeError when `qty` is negative or non-integer.
 */
export function applyBulkPricing(scheme: BulkPricingScheme, qty: number): AppliedPricing {
  if (!Number.isInteger(qty) || qty < 0) {
    throw new RangeError(`qty must be a non-negative integer, received: ${qty}`);
  }

  if (qty === 0) {
    return { unitPriceGrosze: scheme.basePriceGrosze, totalGrosze: 0, tierApplied: null, savingsGrosze: 0 };
  }

  // Tiers are sorted ascending by `minQty` — walk backwards for the highest applicable tier.
  let appliedIndex: number | null = null;
  for (let i = scheme.tiers.length - 1; i >= 0; i -= 1) {
    const tier = scheme.tiers[i];
    if (qty >= tier.minQty) {
      appliedIndex = i;
      break;
    }
  }

  const unitPriceGrosze = appliedIndex === null ? scheme.basePriceGrosze : scheme.tiers[appliedIndex].unitPriceGrosze;
  const totalGrosze = unitPriceGrosze * qty;
  const savingsGrosze = (scheme.basePriceGrosze - unitPriceGrosze) * qty;

  return { unitPriceGrosze, totalGrosze, tierApplied: appliedIndex, savingsGrosze };
}

/**
 * Build a Polish-language UI badge label for the first (cheapest-threshold) tier.
 *
 * Example: `{ basePriceGrosze: 10000, tiers: [{ minQty: 10, unitPriceGrosze: 9500 }] }`
 * yields `"Od 10 szt. - 5% taniej"`.
 *
 * Returns `null` when the scheme has no tiers (nothing to advertise).
 */
export function formatPricingBadge(scheme: BulkPricingScheme): string | null {
  if (scheme.tiers.length === 0) {
    return null;
  }
  const firstTier = scheme.tiers[0];

  if (scheme.basePriceGrosze <= 0) {
    // Cannot compute a meaningful percentage from a zero/negative base — bail out.
    return null;
  }

  const discountRatio = (scheme.basePriceGrosze - firstTier.unitPriceGrosze) / scheme.basePriceGrosze;
  const percent = Math.round(discountRatio * 100);
  return `Od ${firstTier.minQty} szt. - ${percent}% taniej`;
}

/**
 * Validate a {@link BulkPricingScheme}.
 *
 * Returns a list of human-readable error messages (English; these are
 * developer-facing). An empty array means the scheme is valid.
 */
export function validateScheme(scheme: BulkPricingScheme): string[] {
  const errors: string[] = [];

  if (!Number.isFinite(scheme.basePriceGrosze) || scheme.basePriceGrosze < 0) {
    errors.push(`basePriceGrosze must be a non-negative finite number, received: ${scheme.basePriceGrosze}`);
  }
  if (!Number.isInteger(scheme.basePriceGrosze)) {
    errors.push(`basePriceGrosze must be an integer, received: ${scheme.basePriceGrosze}`);
  }

  let previousMinQty = 0;
  let previousUnitPrice = scheme.basePriceGrosze;

  scheme.tiers.forEach((tier, index) => {
    if (!Number.isInteger(tier.minQty) || tier.minQty < 1) {
      errors.push(`tier[${index}].minQty must be an integer ≥ 1, received: ${tier.minQty}`);
    }
    if (!Number.isInteger(tier.unitPriceGrosze) || tier.unitPriceGrosze < 0) {
      errors.push(`tier[${index}].unitPriceGrosze must be a non-negative integer, received: ${tier.unitPriceGrosze}`);
    }

    if (index > 0 && tier.minQty <= previousMinQty) {
      errors.push(
        `tier[${index}].minQty (${tier.minQty}) must be greater than previous tier minQty (${previousMinQty}) — tiers must be sorted ascending`,
      );
    }

    if (tier.unitPriceGrosze >= previousUnitPrice) {
      errors.push(
        `tier[${index}].unitPriceGrosze (${tier.unitPriceGrosze}) must be strictly less than previous price (${previousUnitPrice}) — prices must be monotonically decreasing`,
      );
    }

    previousMinQty = tier.minQty;
    previousUnitPrice = tier.unitPriceGrosze;
  });

  return errors;
}
