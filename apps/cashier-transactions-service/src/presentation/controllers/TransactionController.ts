import { Controller, Get, Post, Body, Query, HttpCode, HttpStatus, Param, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { GetTransactionsUseCase } from '../../application/use-cases/GetTransactionsUseCase';
import { GetTransactionByIdUseCase } from '../../application/use-cases/GetTransactionByIdUseCase';
import { CreateTransactionUseCase } from '../../application/use-cases/CreateTransactionUseCase';
import { CreateTransactionDto, GetTransactionsFilterDto } from '../dto/transaction.dto';

@Controller('v1/transactions')
@UsePipes(ZodValidationPipe)
export class TransactionController {
  constructor(
    private readonly getTransactionsUseCase: GetTransactionsUseCase,
    private readonly getTransactionByIdUseCase: GetTransactionByIdUseCase,
    private readonly createTransactionUseCase: CreateTransactionUseCase,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getTransactions(@Query() query: GetTransactionsFilterDto) {
    const { page, limit, ...filter } = query;
    return this.getTransactionsUseCase.execute(page, limit, filter);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getTransactionById(@Param('id') id: string) {
    return this.getTransactionByIdUseCase.execute(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createTransaction(@Body() data: CreateTransactionDto) {
    return this.createTransactionUseCase.execute(data);
  }
}
