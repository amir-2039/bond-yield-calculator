import { useState } from 'react';
import type { BondInput, BondOutput } from '@bond-yield/shared';
import { CouponFrequency } from '@bond-yield/shared';
import { BondCalculationError, calculateBond } from './api/bondApi';
import { BondForm } from './components/BondForm';
import { BondResults } from './components/BondResults';
import { CashFlowTable } from './components/CashFlowTable';

const DEFAULT_INPUT: BondInput = {
  faceValue: 1000,
  annualCouponRate: 5,
  marketPrice: 1000,
  yearsToMaturity: 10,
  couponFrequency: CouponFrequency.ANNUAL,
};

export function App() {
  const [input, setInput] = useState<BondInput>(DEFAULT_INPUT);
  const [output, setOutput] = useState<BondOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleCalculate = async () => {
    setError(null);
    setFieldErrors({});
    setLoading(true);
    try {
      const result = await calculateBond(input);
      setOutput(result);
    } catch (e) {
      if (e instanceof BondCalculationError) {
        setError(e.message);
        setFieldErrors(e.getFieldErrors());
      } else {
        setError(e instanceof Error ? e.message : 'Calculation failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <h1>Bond Yield Calculator</h1>
      <BondForm
        value={input}
        onChange={setInput}
        onSubmit={handleCalculate}
        loading={loading}
        errors={fieldErrors}
      />
      {error && (
        <div className="alert" role="alert">
          {error}
        </div>
      )}
      {output && (
        <>
          <BondResults output={output} />
          <CashFlowTable items={output.cashFlowSchedule} />
        </>
      )}
    </main>
  );
}
