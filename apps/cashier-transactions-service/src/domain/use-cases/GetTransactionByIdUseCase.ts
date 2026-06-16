import { ITransactionRepository } from '../repositories/ITransactionRepository';
import { IOrderService } from '../repositories/IOrderService';
import { IProductService } from '../repositories/IProductService';
import { OrderItem } from '../entities/Transaction';

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class GetTransactionByIdUseCase {
  constructor(
    private readonly transactionRepository: ITransactionRepository,
    private readonly orderService: IOrderService,
    private readonly productService: IProductService,
  ) {}

  async execute(id: string) {
    const transaction = await this.transactionRepository.findById(id);
    if (!transaction) {
      throw new NotFoundError(`Transaction with ID ${id} not found`);
    }

    const rawItems = await this.orderService.getOrderItems(transaction.orderId);

    const orderItems: OrderItem[] = await Promise.all(
      rawItems.map(async (item) => {
        const productName = await this.productService.getProductName(item.productId);
        return {
          productId: item.productId,
          productName: productName ?? item.productId,
          quantity: item.quantity,
          unitPrice: item.price,
          total: item.quantity * item.price,
        };
      }),
    );

    return { ...transaction, orderItems };
  }
}
