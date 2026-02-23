/**
 * Format numbers for display.
 * Reuse across BondResults and CashFlowTable.
 */

export function formatPercent(value: number, decimals = 4): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

export function formatCurrency(value: number, decimals = 2): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}
