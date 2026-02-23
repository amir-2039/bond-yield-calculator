/**
 * Coupon payment frequency.
 * Used by both frontend and backend for bond calculations.
 */
export enum CouponFrequency {
  ANNUAL = 'annual',
  SEMI_ANNUAL = 'semi_annual',
}

export const COUPON_FREQUENCY_LABELS: Record<CouponFrequency, string> = {
  [CouponFrequency.ANNUAL]: 'Annual',
  [CouponFrequency.SEMI_ANNUAL]: 'Semi-Annual',
};
