import { Controller, Get, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { GetTransactionsUseCase } from '../../application/use-cases/GetTransactionsUseCase';

@Controller('v1/transactions')
export class TransactionController {
  constructor(private readonly getTransactionsUseCase: GetTransactionsUseCase) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getTransactions(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.getTransactionsUseCase.execute(parseInt(page), parseInt(limit));
  }
}
