import type { BondOutput } from '@bond-yield/shared';

const STATUS_LABELS: Record<string, string> = {
  premium: 'Trading above face value',
  discount: 'Trading below face value',
  par: 'Trading at par',
};
import { formatCurrency, formatPercent } from '../utils/format';

interface BondResultsProps {
  output: BondOutput;
}

export function BondResults({ output }: BondResultsProps) {
  return (
    <section aria-labelledby="results-heading">
      <h2 id="results-heading">Results</h2>
      <dl>
        <div>
          <dt>Current yield</dt>
          <dd>{formatPercent(output.currentYield)}</dd>
        </div>
        <div>
          <dt>Yield to maturity</dt>
          <dd>{formatPercent(output.ytm)}</dd>
        </div>
        <div>
          <dt>Total interest earned</dt>
          <dd>{formatCurrency(output.totalInterestEarned)}</dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd>
            <span data-status={output.premiumOrDiscount}>
              {STATUS_LABELS[output.premiumOrDiscount] ?? output.premiumOrDiscount}
            </span>
          </dd>
        </div>
      </dl>
    </section>
  );
}
