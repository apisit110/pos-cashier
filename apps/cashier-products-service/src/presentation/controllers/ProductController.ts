import { Controller, Get, Post, Param, NotFoundException, InternalServerErrorException, UseGuards } from '@nestjs/common';
import { GetProductByBarcodeUseCase } from '../../application/use-cases/GetProductByBarcodeUseCase';
import { SyncProductsUseCase } from '../../application/use-cases/SyncProductsUseCase';
import { JwtAuthGuard } from '../../infrastructure/guards/JwtAuthGuard';

@Controller('v1/products')
@UseGuards(JwtAuthGuard)
export class ProductController {
  constructor(
    private readonly getProductByBarcodeUseCase: GetProductByBarcodeUseCase,
    private readonly syncProductsUseCase: SyncProductsUseCase,
  ) {}

  @Get('barcode/:barcode')
  async getProductByBarcode(@Param('barcode') barcode: string) {
    try {
      return await this.getProductByBarcodeUseCase.execute(barcode);
    } catch (error) {
      throw new NotFoundException((error as Error).message);
    }
  }

  @Post('sync')
  async syncProducts() {
    try {
      return await this.syncProductsUseCase.execute();
    } catch (error) {
      throw new InternalServerErrorException((error as Error).message);
    }
  }
}
