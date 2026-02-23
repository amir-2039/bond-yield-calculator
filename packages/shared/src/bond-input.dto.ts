import { IsEnum, IsNumber, Max, Min, IsPositive } from 'class-validator';
import { CouponFrequency } from './coupon-frequency.enum';

/**
 * Input for bond yield calculations.
 * Use BondInputDto (class) for validation; BondInput (type) for type signatures.
 */
export interface BondInput {
  faceValue: number;
  annualCouponRate: number;
  marketPrice: number;
  yearsToMaturity: number;
  couponFrequency: CouponFrequency;
}

/**
 * DTO class with validation decorators.
 * Use with NestJS ValidationPipe or validate() from class-validator.
 */
export class BondInputDto implements BondInput {
  @IsNumber({}, { message: 'Face value must be a number' })
  @IsPositive({ message: 'Face value must be positive' })
  faceValue!: number;

  @IsNumber({}, { message: 'Annual coupon rate must be a number' })
  @Min(0, { message: 'Annual coupon rate must be at least 0%' })
  @Max(100, { message: 'Annual coupon rate must not exceed 100%' })
  annualCouponRate!: number;

  @IsNumber({}, { message: 'Market price must be a number' })
  @IsPositive({ message: 'Market price must be positive' })
  marketPrice!: number;

  @IsNumber({}, { message: 'Years to maturity must be a number' })
  @IsPositive({ message: 'Years to maturity must be positive' })
  @Min(0.01, { message: 'Years to maturity must be at least 0.01' })
  @Max(100, { message: 'Years to maturity must not exceed 100' })
  yearsToMaturity!: number;

  @IsEnum(CouponFrequency, {
    message: `Coupon frequency must be one of: ${Object.values(CouponFrequency).join(', ')}`,
  })
  couponFrequency!: CouponFrequency;
}
