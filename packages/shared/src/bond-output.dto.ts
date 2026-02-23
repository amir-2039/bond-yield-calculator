import { PremiumOrDiscount } from './premium-or-discount.enum';

/**
 * Single row in the cash flow schedule.
 */
export interface CashFlowScheduleItem {
  /** Period number (1-based) */
  period: number;
  /** Payment date (ISO 8601 string) */
  paymentDate: string;
  /** Coupon payment for this period */
  couponPayment: number;
  /** Cumulative interest up to this period */
  cumulativeInterest: number;
  /** Remaining principal (face value until maturity) */
  remainingPrincipal: number;
}

/**
 * Output of bond yield calculations.
 * Single source of truth for API response and results display.
 */
export interface BondOutput {
  /** Current yield (annual coupon payment / market price) */
  currentYield: number;
  /** Yield to maturity (annualized) */
  ytm: number;
  /** Total interest earned over life of bond */
  totalInterestEarned: number;
  /** Whether bond trades at premium, discount, or par */
  premiumOrDiscount: PremiumOrDiscount;
  /** Cash flow schedule */
  cashFlowSchedule: CashFlowScheduleItem[];
}
