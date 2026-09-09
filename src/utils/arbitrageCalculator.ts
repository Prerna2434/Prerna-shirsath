import { CompetingPharmacy } from '../types';

export interface WeightFactors {
  price: number;
  eta: number;
  quality: number;
  margin: number;
}

export interface ArbitrageSavingsResult {
  monthlySavings: number;
  totalSavings: number;
  savingsPercentage: number;
  savingsPercentageFormatted: string;
}

/**
 * Calculates patient dollar and percentage savings comparing brand vs generic drug prices.
 */
export function calculateSavings(
  brandPrice: number,
  genericPrice: number,
  months: number = 1
): ArbitrageSavingsResult {
  const safeBrand = Math.max(0, brandPrice);
  const safeGeneric = Math.max(0, genericPrice);
  const safeMonths = Math.max(1, months);

  const monthlySavings = Math.max(0, safeBrand - safeGeneric);
  const totalSavings = monthlySavings * safeMonths;
  const savingsPercentage = safeBrand > 0 ? (monthlySavings / safeBrand) * 100 : 0;

  return {
    monthlySavings: Number(monthlySavings.toFixed(2)),
    totalSavings: Number(totalSavings.toFixed(2)),
    savingsPercentage: Number(savingsPercentage.toFixed(1)),
    savingsPercentageFormatted: savingsPercentage.toFixed(1) + '%',
  };
}

/**
 * Computes multi-attribute composite optimization score (0-100) for a pharmacy route.
 */
export function computePharmacyScore(
  pharmacy: CompetingPharmacy,
  weights: WeightFactors = { price: 50, eta: 25, quality: 15, margin: 10 }
): number {
  // Lower price gives higher score (capped at 100)
  const priceScore = Math.max(0, 100 - pharmacy.patientPrice * 3);

  // Faster SLA gives higher score
  const slaLower = pharmacy.fulfillmentSla.toLowerCase();
  const etaScore = slaLower.includes('45')
    ? 95
    : slaLower.includes('same') || slaLower.includes('express')
    ? 85
    : 70;

  // Quality rating out of 5 scaled to 0-100
  const qualityScore = (Math.min(5, Math.max(0, pharmacy.rating)) / 5) * 100;

  // Standard dispensary margin benchmark score
  const marginScore = 75;

  const totalWeight = (weights.price + weights.eta + weights.quality + weights.margin) || 100;

  const composite =
    (priceScore * weights.price +
      etaScore * weights.eta +
      qualityScore * weights.quality +
      marginScore * weights.margin) /
    totalWeight;

  return Number(composite.toFixed(2));
}

/**
 * Reranks generic fulfillment pharmacies dynamically based on composite multi-attribute score.
 */
export function rankPharmacies(
  pharmacies: CompetingPharmacy[],
  weights: WeightFactors = { price: 50, eta: 25, quality: 15, margin: 10 }
): (CompetingPharmacy & { compositeScore: number })[] {
  const genericPharmacies = pharmacies.filter((p) => !p.isBrandOnly);
  const brandPharmacies = pharmacies.filter((p) => p.isBrandOnly);

  const scored = genericPharmacies.map((p) => ({
    ...p,
    compositeScore: computePharmacyScore(p, weights),
  }));

  // Sort descending by compositeScore, secondary sort by lowest price
  scored.sort((a, b) => {
    if (b.compositeScore !== a.compositeScore) {
      return b.compositeScore - a.compositeScore;
    }
    return a.patientPrice - b.patientPrice;
  });

  const reranked = scored.map((p, idx) => ({
    ...p,
    rank: idx + 1,
    isDefault: idx === 0,
  }));

  const brandRanked = brandPharmacies.map((b) => ({
    ...b,
    rank: reranked.length + 1,
    compositeScore: computePharmacyScore(b, weights),
  }));

  return [...reranked, ...brandRanked];
}
