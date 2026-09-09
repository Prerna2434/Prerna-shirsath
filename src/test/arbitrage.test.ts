import { describe, it, expect } from 'vitest';
import {
  calculateSavings,
  computePharmacyScore,
  rankPharmacies,
  WeightFactors,
} from '../utils/arbitrageCalculator';
import { COMPETING_PHARMACIES, LIVE_ARBITRAGE_TRANSACTIONS } from '../data/mockData';
import { CompetingPharmacy } from '../types';

describe('Clinical Arbitrage Calculator & Economic Engine', () => {
  describe('calculateSavings', () => {
    it('calculates monthly savings and percentage correctly for Lipitor vs Atorvastatin', () => {
      const result = calculateSavings(88.00, 9.20, 1);
      expect(result.monthlySavings).toBe(78.80);
      expect(result.totalSavings).toBe(78.80);
      expect(result.savingsPercentage).toBe(89.5);
      expect(result.savingsPercentageFormatted).toBe('89.5%');
    });

    it('calculates multi-month cumulative savings (12 months chronic maintenance)', () => {
      const result = calculateSavings(88.00, 9.20, 12);
      expect(result.monthlySavings).toBe(78.80);
      expect(result.totalSavings).toBe(945.60);
      expect(result.savingsPercentage).toBe(89.5);
    });

    it('handles zero or negative price edge cases safely without division by zero', () => {
      const zeroResult = calculateSavings(0, 0, 1);
      expect(zeroResult.monthlySavings).toBe(0);
      expect(zeroResult.totalSavings).toBe(0);
      expect(zeroResult.savingsPercentage).toBe(0);

      const negativeResult = calculateSavings(-50, 10, 1);
      expect(negativeResult.monthlySavings).toBe(0);
      expect(negativeResult.savingsPercentage).toBe(0);
    });

    it('handles generic price higher than brand without negative savings', () => {
      const result = calculateSavings(50.00, 75.00, 1);
      expect(result.monthlySavings).toBe(0);
      expect(result.totalSavings).toBe(0);
      expect(result.savingsPercentage).toBe(0);
    });
  });

  describe('computePharmacyScore', () => {
    const samplePharmacy: CompetingPharmacy = {
      rank: 1,
      name: 'Metro Health Central Rx',
      license: 'License: #TX-98441',
      rating: 4.9,
      reviewCount: 3400,
      genericProduct: 'Atorvastatin Calcium 20mg',
      manufacturer: 'Mylan Pharmaceuticals Inc.',
      ndc: '0378-3952-77',
      patientPrice: 9.20,
      copay: 1.84,
      savingsPercentage: 90.1,
      savingsDollars: 83.30,
      fulfillmentSla: 'Same-Day Courier',
      distanceOrCarrier: 'Avg 2.4 hrs',
      isDefault: true,
    };

    it('generates high score for low price, high rating, and same-day delivery', () => {
      const weights: WeightFactors = { price: 50, eta: 25, quality: 15, margin: 10 };
      const score = computePharmacyScore(samplePharmacy, weights);
      expect(score).toBeCloseTo(79.65, 1);
      expect(score).toBeLessThanOrEqual(100);
    });

    it('weights delivery speed higher when SLA weight is increased', () => {
      const expressPharmacy: CompetingPharmacy = {
        ...samplePharmacy,
        patientPrice: 15.00,
        fulfillmentSla: '45 Mins Express',
      };
      const standardPharmacy: CompetingPharmacy = {
        ...samplePharmacy,
        patientPrice: 15.00,
        fulfillmentSla: 'Standard Next-Day',
      };

      const highSpeedWeights: WeightFactors = { price: 10, eta: 70, quality: 10, margin: 10 };
      const expressScore = computePharmacyScore(expressPharmacy, highSpeedWeights);
      const standardScore = computePharmacyScore(standardPharmacy, highSpeedWeights);

      expect(expressScore).toBeGreaterThan(standardScore);
    });
  });

  describe('rankPharmacies', () => {
    it('ranks lowest cost generic route first with default weights', () => {
      const defaultWeights: WeightFactors = { price: 50, eta: 25, quality: 15, margin: 10 };
      const ranked = rankPharmacies(COMPETING_PHARMACIES, defaultWeights);

      expect(ranked.length).toBe(COMPETING_PHARMACIES.length);
      expect(ranked[0].rank).toBe(1);
      expect(ranked[0].isDefault).toBe(true);
      expect(ranked[0].isBrandOnly).toBeFalsy();
    });

    it('dynamically promotes 45 Mins Express pharmacy when speed is prioritized 80%', () => {
      const speedWeights: WeightFactors = { price: 10, eta: 80, quality: 5, margin: 5 };
      const ranked = rankPharmacies(COMPETING_PHARMACIES, speedWeights);

      const topRoute = ranked[0];
      expect(topRoute.fulfillmentSla).toContain('45 Mins');
      expect(topRoute.isDefault).toBe(true);
      expect(topRoute.rank).toBe(1);
    });

    it('keeps brand-only pharmacies at the lowest priority tier', () => {
      const ranked = rankPharmacies(COMPETING_PHARMACIES);
      const last = ranked[ranked.length - 1];
      expect(last.isBrandOnly).toBe(true);
    });
  });

  describe('Live Arbitrage Feed Transactions', () => {
    it('verifies all live transactions contain valid savings rates above 80%', () => {
      for (const tx of LIVE_ARBITRAGE_TRANSACTIONS) {
        expect(tx.patientSavingsPercent).toBeGreaterThan(80);
        expect(tx.genericPrice).toBeLessThan(tx.brandPrice);
        expect(tx.platformFee).toBeGreaterThan(0);
        expect(tx.isSettled).toBe(true);
      }
    });

    it('verifies calculated fee proportion is within acceptable platform spread', () => {
      for (const tx of LIVE_ARBITRAGE_TRANSACTIONS) {
        const spread = tx.brandPrice - tx.genericPrice;
        expect(tx.platformFee).toBeLessThan(spread * 0.1);
      }
    });
  });
});
