import { Injectable } from '@nestjs/common';
import type { BondInput, BondOutput } from '@bond-yield/shared';
import { calculateBond } from './domain/bond-calculator';

@Injectable()
export class BondService {
  calculate(input: BondInput): BondOutput {
    return calculateBond(input);
  }
}
