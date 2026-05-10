import { Controller, Get, Post, Param, Body, NotFoundException, InternalServerErrorException, UseGuards } from '@nestjs/common';
import { GetProductByBarcodeUseCase } from '../../application/use-cases/GetProductByBarcodeUseCase';
import { GetProductsUseCase } from '../../application/use-cases/GetProductsUseCase';
import { SyncProductsUseCase } from '../../application/use-cases/SyncProductsUseCase';
import { JwtAuthGuard } from '../../infrastructure/guards/JwtAuthGuard';

@Controller('v1/products')
@UseGuards(JwtAuthGuard)
export class ProductController {
  constructor(
    private readonly getProductByBarcodeUseCase: GetProductByBarcodeUseCase,
    private readonly getProductsUseCase: GetProductsUseCase,
    private readonly syncProductsUseCase: SyncProductsUseCase,
  ) {}

  @Get()
  async getProducts() {
    try {
      return await this.getProductsUseCase.execute();
    } catch (error) {
      throw new InternalServerErrorException((error as Error).message);
    }
  }

  @Get('barcode/:barcode')
  async getProductByBarcode(@Param('barcode') barcode: string) {
    try {
      return await this.getProductByBarcodeUseCase.execute(barcode);
    } catch (error) {
      throw new NotFoundException((error as Error).message);
    }
  }

  @Post('sync')
  async syncProducts(
    @Body('mid') mid?: string,
    @Body('sid') sid?: string,
  ) {
    try {
      return await this.syncProductsUseCase.execute(mid, sid);
    } catch (error) {
      throw new InternalServerErrorException((error as Error).message);
    }
  }
}
