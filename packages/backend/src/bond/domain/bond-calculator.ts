/**
 * Pure bond calculation logic. No framework dependencies.
 * Reusable by BondService and unit tests.
 */
import { addMonths } from 'date-fns';
import Decimal from 'decimal.js';
import type { BondInput, BondOutput, CashFlowScheduleItem } from '@bond-yield/shared';
import { CouponFrequency, PremiumOrDiscount } from '@bond-yield/shared';

const PERIODS_PER_YEAR: Record<CouponFrequency, number> = {
  [CouponFrequency.ANNUAL]: 1,
  [CouponFrequency.SEMI_ANNUAL]: 2,
};

const MONTHS_PER_PERIOD: Record<CouponFrequency, number> = {
  [CouponFrequency.ANNUAL]: 12,
  [CouponFrequency.SEMI_ANNUAL]: 6,
};

const YTM_MAX_ITERATIONS = 100;
const YTM_TOLERANCE = 1e-10;
/** Per-period rate floor; keeps YTM > -100% (economically meaningful) */
const YTM_MIN_R = -0.9999;

/**
 * Calculate bond yields and cash flow schedule from input.
 */
export function calculateBond(input: BondInput): BondOutput {
  const periodsPerYear = PERIODS_PER_YEAR[input.couponFrequency];
  const numPeriods = Math.floor(input.yearsToMaturity * periodsPerYear);
  const couponPerPeriod = getCouponPerPeriod(
    input.faceValue,
    input.annualCouponRate,
    periodsPerYear
  );
  const annualCouponPayment = getAnnualCouponPayment(input.faceValue, input.annualCouponRate);

  const currentYield = calculateCurrentYield(annualCouponPayment, input.marketPrice);
  const ytm = calculateYtm(
    input.faceValue,
    couponPerPeriod,
    numPeriods,
    input.marketPrice,
    periodsPerYear
  );
  const totalInterestEarned = calculateTotalInterest(couponPerPeriod, numPeriods);
  const premiumOrDiscount = getPremiumOrDiscount(input.marketPrice, input.faceValue);
  const cashFlowSchedule = generateCashFlowSchedule(
    input.faceValue,
    couponPerPeriod,
    numPeriods,
    input.yearsToMaturity,
    input.couponFrequency
  );

  return {
    currentYield: currentYield.toNumber(),
    ytm: ytm.toNumber(),
    totalInterestEarned: totalInterestEarned.toNumber(),
    premiumOrDiscount,
    cashFlowSchedule,
  };
}

function getCouponPerPeriod(
  faceValue: number,
  annualCouponRatePercent: number,
  periodsPerYear: number
): Decimal {
  const annualCoupon = new Decimal(faceValue).times(annualCouponRatePercent).div(100);
  return annualCoupon.div(periodsPerYear);
}

function getAnnualCouponPayment(faceValue: number, annualCouponRatePercent: number): Decimal {
  return new Decimal(faceValue).times(annualCouponRatePercent).div(100);
}

/**
 * Current Yield = Annual Coupon Payment / Market Price
 */
function calculateCurrentYield(annualCouponPayment: Decimal, marketPrice: number): Decimal {
  return annualCouponPayment.div(marketPrice);
}

/**
 * Total Interest = Coupon per period × Number of periods
 */
function calculateTotalInterest(couponPerPeriod: Decimal, numPeriods: number): Decimal {
  return couponPerPeriod.times(numPeriods);
}

/**
 * Premium/Discount based on market price vs face value.
 */
function getPremiumOrDiscount(marketPrice: number, faceValue: number): PremiumOrDiscount {
  if (marketPrice > faceValue) return PremiumOrDiscount.PREMIUM;
  if (marketPrice < faceValue) return PremiumOrDiscount.DISCOUNT;
  return PremiumOrDiscount.PAR;
}

/**
 * YTM via Newton-Raphson. Solves for per-period rate r where:
 * Market Price = Σ(CashFlow_t / (1+r)^t)
 * Annualizes: YTM = r × periodsPerYear
 */
function calculateYtm(
  faceValue: number,
  couponPerPeriod: Decimal,
  numPeriods: number,
  marketPrice: number,
  periodsPerYear: number
): Decimal {
  const price = new Decimal(marketPrice);
  const fv = new Decimal(faceValue);

  const one = new Decimal(1);
  const zero = new Decimal(0);

  function pv(r: Decimal): Decimal {
    let sum = zero;
    for (let t = 1; t <= numPeriods; t++) {
      const cf = t === numPeriods ? couponPerPeriod.plus(fv) : couponPerPeriod;
      sum = sum.plus(cf.div(one.plus(r).pow(t)));
    }
    return sum;
  }

  function pvDerivative(r: Decimal): Decimal {
    let sum = zero;
    for (let t = 1; t <= numPeriods; t++) {
      const cf = t === numPeriods ? couponPerPeriod.plus(fv) : couponPerPeriod;
      sum = sum.minus(cf.times(t).div(one.plus(r).pow(t + 1)));
    }
    return sum;
  }

  let r = new Decimal(0.05).div(periodsPerYear);

  for (let i = 0; i < YTM_MAX_ITERATIONS; i++) {
    const diff = pv(r).minus(price);
    if (diff.abs().lessThan(YTM_TOLERANCE)) break;
    const deriv = pvDerivative(r);
    if (deriv.abs().lessThan(1e-15)) break;
    r = r.minus(diff.div(deriv));
    if (r.lessThan(YTM_MIN_R)) r = new Decimal(YTM_MIN_R);
  }

  const ytmPeriod = r;
  const ytmAnnual = ytmPeriod.times(periodsPerYear);
  return ytmAnnual;
}

/**
 * Generates cash flow schedule with payment dates from today.
 */
function generateCashFlowSchedule(
  faceValue: number,
  couponPerPeriod: Decimal,
  numPeriods: number,
  _yearsToMaturity: number,
  couponFrequency: CouponFrequency
): CashFlowScheduleItem[] {
  const monthsPerPeriod = MONTHS_PER_PERIOD[couponFrequency];
  const startDate = new Date();
  const schedule: CashFlowScheduleItem[] = [];
  let cumulativeInterest = new Decimal(0);

  for (let period = 1; period <= numPeriods; period++) {
    const paymentDate = addMonths(startDate, period * monthsPerPeriod);
    cumulativeInterest = cumulativeInterest.plus(couponPerPeriod);
    const remainingPrincipal = period === numPeriods ? 0 : faceValue;

    schedule.push({
      period,
      paymentDate: paymentDate.toISOString().slice(0, 10),
      couponPayment: couponPerPeriod.toNumber(),
      cumulativeInterest: cumulativeInterest.toNumber(),
      remainingPrincipal,
    });
  }

  return schedule;
}
