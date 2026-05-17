import { Controller, Patch, Param, HttpCode, HttpStatus, Get, Post, Body, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { MarkTransactionSyncedUseCase } from '../../application/use-cases/MarkTransactionSyncedUseCase';
import { GetTransactionByIdUseCase } from '../../application/use-cases/GetTransactionByIdUseCase';
import { CreateTransactionUseCase } from '../../application/use-cases/CreateTransactionUseCase';
import { CreateTransactionDto } from '../dto/transaction.dto';

@Controller('internal/v1/transactions')
@UsePipes(ZodValidationPipe)
export class InternalTransactionController {
  constructor(
    private readonly markTransactionSyncedUseCase: MarkTransactionSyncedUseCase,
    private readonly getTransactionByIdUseCase: GetTransactionByIdUseCase,
    private readonly createTransactionUseCase: CreateTransactionUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createTransaction(@Body() data: CreateTransactionDto) {
    return this.createTransactionUseCase.execute(data);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.getTransactionByIdUseCase.execute(id);
  }

  @Patch(':id/synced')
  @HttpCode(HttpStatus.OK)
  async markSynced(@Param('id') id: string) {
    return this.markTransactionSyncedUseCase.execute(id);
  }
}
