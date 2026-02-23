/**
 * Centralized validation error messages.
 * Reuse in API exception filter and frontend form validation.
 */
export const VALIDATION_MESSAGES = {
  FACE_VALUE: {
    NOT_NUMBER: 'Face value must be a number',
    NOT_POSITIVE: 'Face value must be positive',
  },
  ANNUAL_COUPON_RATE: {
    NOT_NUMBER: 'Annual coupon rate must be a number',
    MIN: 'Annual coupon rate must be at least 0%',
    MAX: 'Annual coupon rate must not exceed 100%',
  },
  MARKET_PRICE: {
    NOT_NUMBER: 'Market price must be a number',
    NOT_POSITIVE: 'Market price must be positive',
  },
  YEARS_TO_MATURITY: {
    NOT_NUMBER: 'Years to maturity must be a number',
    NOT_POSITIVE: 'Years to maturity must be positive',
    MIN: 'Years to maturity must be at least 0.01',
    MAX: 'Years to maturity must not exceed 100',
  },
  COUPON_FREQUENCY: {
    INVALID: (validValues: string) =>
      `Coupon frequency must be one of: ${validValues}`,
  },
} as const;
