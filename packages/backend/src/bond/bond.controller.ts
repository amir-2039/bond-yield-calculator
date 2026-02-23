import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { BondOutput } from '@bond-yield/shared';
import { BondInputDto } from '@bond-yield/shared';
import { BondService } from './bond.service';

@ApiTags('bond')
@Controller('v1/bond')
export class BondController {
  constructor(private readonly bondService: BondService) {}

  @Post('calculate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Calculate bond yields and cash flow schedule' })
  @ApiResponse({ status: 200, description: 'Calculation result' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  calculate(@Body() input: BondInputDto): BondOutput {
    return this.bondService.calculate(input);
  }
}
