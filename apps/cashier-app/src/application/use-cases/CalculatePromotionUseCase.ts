import { Product } from '../../domain/entities/Product';

interface OrderItem {
  product: Product;
  quantity: number;
}

export interface PromotionResult {
  appliedPromotions: string[];
  finalTotal: number;
}

export class CalculatePromotionUseCase {
  execute(items: OrderItem[]): PromotionResult {
    const finalTotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    
    return {
      appliedPromotions: [],
      finalTotal
    };
  }
}
