/**
 * @bond-yield/shared
 *
 * Shared types and enums for bond yield calculations.
 * Used by both frontend (form, display) and backend (API, validation).
 *
 * Re-exports everything for clean imports:
 *   import { BondInput, BondOutput, CouponFrequency } from '@bond-yield/shared';
 */

export type { BondInput } from './bond-input.dto';
export { BondInputDto } from './bond-input.dto';
export type { BondOutput, CashFlowScheduleItem } from './bond-output.dto';
export { CouponFrequency, COUPON_FREQUENCY_LABELS } from './coupon-frequency.enum';
export {
  PremiumOrDiscount,
  PREMIUM_OR_DISCOUNT_LABELS,
} from './premium-or-discount.enum';
export { VALIDATION_MESSAGES } from './validation-messages';
