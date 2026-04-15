import { Controller, Post, Body, InternalServerErrorException, UseGuards } from '@nestjs/common';
import { ProcessPaymentUseCase, ProcessPaymentDto } from '../../application/use-cases/ProcessPaymentUseCase';
import { JwtAuthGuard } from '../../infrastructure/guards/JwtAuthGuard';
import { InternalGuard } from '../../infrastructure/guards/InternalGuard';

@Controller('v1/payments')
export class PaymentController {
  constructor(private readonly processPaymentUseCase: ProcessPaymentUseCase) {}

  // External (or Gateway) route - requires User JWT
  @Post()
  @UseGuards(JwtAuthGuard)
  async processPayment(@Body() processPaymentDto: ProcessPaymentDto) {
    try {
      return await this.processPaymentUseCase.execute(processPaymentDto);
    } catch (error) {
      throw new InternalServerErrorException((error as Error).message);
    }
  }

  // Internal route - requires Service Secret
  @Post('internal')
  @UseGuards(InternalGuard)
  async processInternalPayment(@Body() processPaymentDto: ProcessPaymentDto) {
    try {
      return await this.processPaymentUseCase.execute(processPaymentDto);
    } catch (error) {
      throw new InternalServerErrorException((error as Error).message);
    }
  }
}
