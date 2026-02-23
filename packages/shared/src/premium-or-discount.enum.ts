/**
 * Indicates whether bond trades above, below, or at face value.
 */
export enum PremiumOrDiscount {
  PREMIUM = 'premium',
  DISCOUNT = 'discount',
  PAR = 'par',
}

export const PREMIUM_OR_DISCOUNT_LABELS: Record<PremiumOrDiscount, string> = {
  [PremiumOrDiscount.PREMIUM]: 'Trading above face value',
  [PremiumOrDiscount.DISCOUNT]: 'Trading below face value',
  [PremiumOrDiscount.PAR]: 'Trading at par',
};
