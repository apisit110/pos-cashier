import { Injectable } from '@nestjs/common';

export class CalculateOrderDto {
  items: { productId: string; quantity: number; price: number }[];
  memberId?: string;
}

export interface CalculateOrderResult {
  total: number;
  appliedPromotions: string[];
}

@Injectable()
export class CalculateOrderUseCase {
  constructor() {}

  async execute(data: CalculateOrderDto): Promise<CalculateOrderResult> {
    const total = data.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    return {
      total,
      appliedPromotions: []
    };
  }
}
