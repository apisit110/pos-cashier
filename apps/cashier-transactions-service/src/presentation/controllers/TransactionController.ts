import { Controller, Get, Post, Body, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { GetTransactionsUseCase } from '../../application/use-cases/GetTransactionsUseCase';
import { CreateTransactionUseCase, CreateTransactionDto } from '../../application/use-cases/CreateTransactionUseCase';

@Controller('v1/transactions')
export class TransactionController {
  constructor(
    private readonly getTransactionsUseCase: GetTransactionsUseCase,
    private readonly createTransactionUseCase: CreateTransactionUseCase,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getTransactions(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.getTransactionsUseCase.execute(parseInt(page), parseInt(limit));
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createTransaction(@Body() data: CreateTransactionDto) {
    return this.createTransactionUseCase.execute(data);
  }
}
