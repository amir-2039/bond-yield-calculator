import { CouponFrequency, PremiumOrDiscount } from '@bond-yield/shared';
import { calculateBond } from './bond-calculator';

describe('bond-calculator', () => {
  describe('calculateBond', () => {
    it('computes current yield for par bond', () => {
      const input = {
        faceValue: 1000,
        annualCouponRate: 5,
        marketPrice: 1000,
        yearsToMaturity: 10,
        couponFrequency: CouponFrequency.ANNUAL,
      };
      const result = calculateBond(input);
      expect(result.currentYield).toBeCloseTo(0.05); // 5% = 50/1000
    });

    it('computes premium when market price > face value', () => {
      const input = {
        faceValue: 1000,
        annualCouponRate: 5,
        marketPrice: 1100,
        yearsToMaturity: 10,
        couponFrequency: CouponFrequency.ANNUAL,
      };
      const result = calculateBond(input);
      expect(result.premiumOrDiscount).toBe(PremiumOrDiscount.PREMIUM);
    });

    it('computes discount when market price < face value', () => {
      const input = {
        faceValue: 1000,
        annualCouponRate: 5,
        marketPrice: 900,
        yearsToMaturity: 10,
        couponFrequency: CouponFrequency.ANNUAL,
      };
      const result = calculateBond(input);
      expect(result.premiumOrDiscount).toBe(PremiumOrDiscount.DISCOUNT);
    });

    it('computes par when market price = face value', () => {
      const input = {
        faceValue: 1000,
        annualCouponRate: 5,
        marketPrice: 1000,
        yearsToMaturity: 10,
        couponFrequency: CouponFrequency.ANNUAL,
      };
      const result = calculateBond(input);
      expect(result.premiumOrDiscount).toBe(PremiumOrDiscount.PAR);
    });

    it('computes total interest earned correctly', () => {
      const input = {
        faceValue: 1000,
        annualCouponRate: 5,
        marketPrice: 1000,
        yearsToMaturity: 10,
        couponFrequency: CouponFrequency.ANNUAL,
      };
      const result = calculateBond(input);
      expect(result.totalInterestEarned).toBe(500); // 10 years × 50/year
    });

    it('computes total interest for semi-annual correctly', () => {
      const input = {
        faceValue: 1000,
        annualCouponRate: 6,
        marketPrice: 1000,
        yearsToMaturity: 5,
        couponFrequency: CouponFrequency.SEMI_ANNUAL,
      };
      const result = calculateBond(input);
      expect(result.totalInterestEarned).toBe(300); // 10 periods × 30/period
    });

    it('handles yearsToMaturity < 1 with annual frequency (numPeriods clamped to 1)', () => {
      const input = {
        faceValue: 1000,
        annualCouponRate: 5,
        marketPrice: 1000,
        yearsToMaturity: 0.5,
        couponFrequency: CouponFrequency.ANNUAL,
      };
      const result = calculateBond(input);
      expect(result.cashFlowSchedule).toHaveLength(1);
      expect(result.ytm).toBeGreaterThanOrEqual(-1);
      expect(result.ytm).toBeLessThanOrEqual(1);
    });

    it('YTM stays >= -100% for extreme loss bond (prevents r < -1)', () => {
      const input = {
        faceValue: 90,
        annualCouponRate: 5,
        marketPrice: 1000,
        yearsToMaturity: 10,
        couponFrequency: CouponFrequency.ANNUAL,
      };
      const result = calculateBond(input);
      expect(result.ytm).toBeGreaterThanOrEqual(-1);
      expect(result.ytm).toBeLessThan(0);
    });

    it('YTM equals coupon rate for par bond', () => {
      const input = {
        faceValue: 1000,
        annualCouponRate: 5,
        marketPrice: 1000,
        yearsToMaturity: 10,
        couponFrequency: CouponFrequency.ANNUAL,
      };
      const result = calculateBond(input);
      expect(result.ytm).toBeCloseTo(0.05, 3);
    });

    it('generates correct number of cash flow periods', () => {
      const input = {
        faceValue: 1000,
        annualCouponRate: 5,
        marketPrice: 1000,
        yearsToMaturity: 10,
        couponFrequency: CouponFrequency.SEMI_ANNUAL,
      };
      const result = calculateBond(input);
      expect(result.cashFlowSchedule).toHaveLength(20);
    });

    it('cash flow schedule has correct structure', () => {
      const input = {
        faceValue: 1000,
        annualCouponRate: 5,
        marketPrice: 1000,
        yearsToMaturity: 2,
        couponFrequency: CouponFrequency.ANNUAL,
      };
      const result = calculateBond(input);
      expect(result.cashFlowSchedule[0]).toMatchObject({
        period: 1,
        couponPayment: 50,
        cumulativeInterest: 50,
        remainingPrincipal: 1000,
      });
      expect(result.cashFlowSchedule[1]).toMatchObject({
        period: 2,
        couponPayment: 50,
        cumulativeInterest: 100,
        remainingPrincipal: 0,
      });
      expect(result.cashFlowSchedule[0].paymentDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });
});
