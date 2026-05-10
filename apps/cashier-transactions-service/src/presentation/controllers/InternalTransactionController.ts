import { Controller, Patch, Param, HttpCode, HttpStatus, Get } from '@nestjs/common';
import { MarkTransactionSyncedUseCase } from '../../application/use-cases/MarkTransactionSyncedUseCase';
import { GetTransactionByIdUseCase } from '../../application/use-cases/GetTransactionByIdUseCase';

@Controller('internal/v1/transactions')
export class InternalTransactionController {
  constructor(
    private readonly markTransactionSyncedUseCase: MarkTransactionSyncedUseCase,
    private readonly getTransactionByIdUseCase: GetTransactionByIdUseCase,
  ) {}

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
