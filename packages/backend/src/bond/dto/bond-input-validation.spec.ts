import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { BondInputDto } from '@bond-yield/shared';
import { CouponFrequency } from '@bond-yield/shared';

describe('BondInputDto validation', () => {
  const validInput = {
    faceValue: 1000,
    annualCouponRate: 5,
    marketPrice: 1000,
    yearsToMaturity: 10,
    couponFrequency: CouponFrequency.ANNUAL,
  };

  async function validateInput(plain: object): Promise<string[]> {
    const dto = plainToInstance(BondInputDto, plain);
    const errors = await validate(dto);
    return errors.flatMap((e) => (e.constraints ? Object.values(e.constraints) : []));
  }

  it('passes for valid input', async () => {
    const errors = await validateInput(validInput);
    expect(errors).toHaveLength(0);
  });

  it('rejects negative face value', async () => {
    const errors = await validateInput({
      ...validInput,
      faceValue: -100,
    });
    expect(errors.some((m) => m.includes('Face value'))).toBe(true);
  });

  it('rejects zero face value', async () => {
    const errors = await validateInput({
      ...validInput,
      faceValue: 0,
    });
    expect(errors.some((m) => m.includes('Face value'))).toBe(true);
  });

  it('rejects annual coupon rate > 100', async () => {
    const errors = await validateInput({
      ...validInput,
      annualCouponRate: 101,
    });
    expect(errors.some((m) => m.includes('100%'))).toBe(true);
  });

  it('rejects negative market price', async () => {
    const errors = await validateInput({
      ...validInput,
      marketPrice: -50,
    });
    expect(errors.some((m) => m.includes('Market price'))).toBe(true);
  });

  it('rejects years to maturity > 100', async () => {
    const errors = await validateInput({
      ...validInput,
      yearsToMaturity: 101,
    });
    expect(errors.some((m) => m.includes('100'))).toBe(true);
  });

  it('rejects invalid coupon frequency', async () => {
    const errors = await validateInput({
      ...validInput,
      couponFrequency: 'invalid',
    });
    expect(errors.some((m) => m.includes('Coupon frequency'))).toBe(true);
  });

  it('accepts valid semi-annual frequency', async () => {
    const errors = await validateInput({
      ...validInput,
      couponFrequency: CouponFrequency.SEMI_ANNUAL,
    });
    expect(errors).toHaveLength(0);
  });
});
