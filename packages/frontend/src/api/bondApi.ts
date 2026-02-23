import type { BondInput, BondOutput } from '@bond-yield/shared';

const API_BASE = import.meta.env.VITE_API_URL ?? '';

export interface BondApiError {
  type: string;
  title: string;
  status: number;
  detail?: string;
  errors?: Array<{ field: string; messages: string[] }>;
}

export class BondCalculationError extends Error {
  constructor(
    message: string,
    public readonly apiError: BondApiError
  ) {
    super(message);
    this.name = 'BondCalculationError';
  }

  getFieldErrors(): Record<string, string> {
    const err = this.apiError.errors;
    if (!err || err.length === 0) return {};
    const out: Record<string, string> = {};
    for (const { field, messages } of err) {
      out[field] = messages[0] ?? 'Invalid';
    }
    return out;
  }
}

export async function calculateBond(input: BondInput): Promise<BondOutput> {
  const base = API_BASE || '';
  const url = base ? `${base.replace(/\/$/, '')}/api/v1/bond/calculate` : '/api/v1/bond/calculate';
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  const data = (await res.json()) as BondOutput | BondApiError;

  if (!res.ok) {
    const apiErr = data as BondApiError;
    const msg = apiErr.detail ?? apiErr.title ?? 'Calculation failed';
    throw new BondCalculationError(msg, apiErr);
  }

  return data as BondOutput;
}
