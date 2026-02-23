import type { BondInput, BondOutput } from '@bond-yield/shared';

const API_BASE = import.meta.env.VITE_API_URL ?? '';

export interface BondApiError {
  type: string;
  title: string;
  status: number;
  detail?: string;
  errors?: Array<{ field: string; messages: string[] }>;
}

export async function calculateBond(input: BondInput): Promise<BondOutput> {
  const base = API_BASE || '';
  const url = base ? `${base.replace(/\/$/, '')}/api/v1/bond/calculate` : '/api/v1/bond/calculate';
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  const data = await res.json();

  if (!res.ok) {
    const err: BondApiError = data;
    throw new Error(err.detail ?? err.title ?? 'Calculation failed');
  }

  return data as BondOutput;
}
