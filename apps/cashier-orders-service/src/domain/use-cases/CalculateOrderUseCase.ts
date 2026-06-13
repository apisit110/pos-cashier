export interface CalculateOrderInput {
  items: { productId: string; quantity: number; price: number }[];
  memberId?: string;
}

export interface CalculateOrderResult {
  total: number;
  appliedPromotions: string[];
}

export class CalculateOrderUseCase {
  async execute(data: CalculateOrderInput): Promise<CalculateOrderResult> {
    const total = data.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return { total, appliedPromotions: [] };
  }
}
