import type { BondInput } from '@bond-yield/shared';
import { CouponFrequency } from '@bond-yield/shared';
import { InputField } from './InputField';

const FREQUENCY_OPTIONS: Array<{ value: BondInput['couponFrequency']; label: string }> = [
  { value: CouponFrequency.ANNUAL, label: 'Annual' },
  { value: CouponFrequency.SEMI_ANNUAL, label: 'Semi-Annual' },
];

interface BondFormProps {
  value: BondInput;
  onChange: (value: BondInput) => void;
  onSubmit: () => void;
  loading?: boolean;
  errors?: Record<string, string>;
}

export function BondForm({
  value,
  onChange,
  onSubmit,
  loading = false,
  errors = {},
}: BondFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit}>
      <fieldset disabled={loading}>
        <InputField
          id="faceValue"
          label="Face value"
          value={value.faceValue}
          onChange={(v) => onChange({ ...value, faceValue: Number(v) || 0 })}
          error={errors.faceValue}
          min={0.01}
        />
        <InputField
          id="annualCouponRate"
          label="Annual coupon rate (%)"
          value={value.annualCouponRate}
          onChange={(v) => onChange({ ...value, annualCouponRate: Number(v) || 0 })}
          error={errors.annualCouponRate}
          min={0}
          max={100}
          step={0.01}
        />
        <InputField
          id="marketPrice"
          label="Market price"
          value={value.marketPrice}
          onChange={(v) => onChange({ ...value, marketPrice: Number(v) || 0 })}
          error={errors.marketPrice}
          min={0.01}
        />
        <InputField
          id="yearsToMaturity"
          label="Years to maturity"
          value={value.yearsToMaturity}
          onChange={(v) => onChange({ ...value, yearsToMaturity: Number(v) || 0 })}
          error={errors.yearsToMaturity}
          min={0.01}
          max={100}
          step={0.01}
        />
        <div>
          <label htmlFor="couponFrequency">Coupon frequency</label>
          <select
            id="couponFrequency"
            value={value.couponFrequency}
            onChange={(e) =>
              onChange({
                ...value,
                couponFrequency: e.target.value as BondInput['couponFrequency'],
              })
            }
          >
            {FREQUENCY_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Calculating…' : 'Calculate'}
        </button>
      </fieldset>
    </form>
  );
}
