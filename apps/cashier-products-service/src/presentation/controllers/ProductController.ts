import { Controller, Get, Param, NotFoundException, UseGuards } from '@nestjs/common';
import { GetProductByBarcodeUseCase } from '../../application/use-cases/GetProductByBarcodeUseCase';
import { JwtAuthGuard } from '../../infrastructure/guards/JwtAuthGuard';

@Controller('v1/products')
@UseGuards(JwtAuthGuard)
export class ProductController {
  constructor(private readonly getProductByBarcodeUseCase: GetProductByBarcodeUseCase) {}

  @Get('barcode/:barcode')
  async getProductByBarcode(@Param('barcode') barcode: string) {
    try {
      return await this.getProductByBarcodeUseCase.execute(barcode);
    } catch (error) {
      throw new NotFoundException((error as Error).message);
    }
  }
}
