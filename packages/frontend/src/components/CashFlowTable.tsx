import type { CashFlowScheduleItem } from '@bond-yield/shared';
import { formatCurrency } from '../utils/format';

interface CashFlowTableProps {
  items: CashFlowScheduleItem[];
}

export function CashFlowTable({ items }: CashFlowTableProps) {
  if (items.length === 0) return null;

  return (
    <section aria-labelledby="cashflow-heading">
      <h2 id="cashflow-heading">Cash flow schedule</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Period</th>
              <th>Payment date</th>
              <th>Coupon payment</th>
              <th>Cumulative interest</th>
              <th>Remaining principal</th>
            </tr>
          </thead>
          <tbody>
            {items.map((row) => (
              <tr key={row.period}>
                <td>{row.period}</td>
                <td>{row.paymentDate}</td>
                <td>{formatCurrency(row.couponPayment)}</td>
                <td>{formatCurrency(row.cumulativeInterest)}</td>
                <td>{formatCurrency(row.remainingPrincipal)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
