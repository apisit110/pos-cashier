import { Controller, Post, Body, Patch, Param, InternalServerErrorException, UseGuards, Req } from '@nestjs/common';
import { CreateOrderUseCase, CreateOrderDto } from '../../application/use-cases/CreateOrderUseCase';
import { UpdateOrderStatusUseCase, UpdateOrderStatusDto } from '../../application/use-cases/UpdateOrderStatusUseCase';
import { CalculateOrderUseCase, CalculateOrderDto } from '../../application/use-cases/CalculateOrderUseCase';
import { CheckoutUseCase, CheckoutDto } from '../../application/use-cases/CheckoutUseCase';
import { JwtAuthGuard } from '../../infrastructure/guards/JwtAuthGuard';

@Controller('v1/orders')
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly updateOrderStatusUseCase: UpdateOrderStatusUseCase,
    private readonly calculateOrderUseCase: CalculateOrderUseCase,
    private readonly checkoutUseCase: CheckoutUseCase,
  ) {}

  @Post('calculate')
  async calculate(@Body() calculateOrderDto: CalculateOrderDto) {
    try {
      return await this.calculateOrderUseCase.execute(calculateOrderDto);
    } catch (error) {
      throw new InternalServerErrorException((error as Error).message);
    }
  }

  @Post('checkout')
  async checkout(@Body() checkoutDto: CheckoutDto, @Req() req: any) {
    try {
      return await this.checkoutUseCase.execute(checkoutDto, parseInt(req.user.sub));
    } catch (error) {
      throw new InternalServerErrorException((error as Error).message);
    }
  }

  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto, @Req() req: any) {
    try {
      return await this.createOrderUseCase.execute(createOrderDto, req.user.sub.toString());
    } catch (error) {
      throw new InternalServerErrorException((error as Error).message);
    }
  }

  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body() updateStatusDto: UpdateOrderStatusDto) {
    try {
      return await this.updateOrderStatusUseCase.execute(id, updateStatusDto);
    } catch (error) {
      throw new InternalServerErrorException((error as Error).message);
    }
  }
}
