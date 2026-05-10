import { Controller, Get, Patch, Param, InternalServerErrorException } from '@nestjs/common';
import { GetOrderByIdUseCase } from '../../application/use-cases/GetOrderByIdUseCase';
import { MarkOrderSyncedUseCase } from '../../application/use-cases/MarkOrderSyncedUseCase';

@Controller('internal/v1/orders')
export class InternalOrderController {
  constructor(
    private readonly getOrderByIdUseCase: GetOrderByIdUseCase,
    private readonly markOrderSyncedUseCase: MarkOrderSyncedUseCase,
  ) {}

  @Get(':id')
  async getOrderById(@Param('id') id: string) {
    try {
      return await this.getOrderByIdUseCase.execute(id);
    } catch (error) {
      throw new InternalServerErrorException((error as Error).message);
    }
  }

  @Patch(':id/synced')
  async markSynced(@Param('id') id: string) {
    try {
      return await this.markOrderSyncedUseCase.execute(id);
    } catch (error) {
      throw new InternalServerErrorException((error as Error).message);
    }
  }
}
