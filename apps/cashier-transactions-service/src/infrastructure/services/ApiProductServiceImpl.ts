import { productServiceClient } from '../http/productServiceClient';
import { IProductService } from '../../domain/repositories/IProductService';

export class ApiProductServiceImpl implements IProductService {
  async getProductName(productId: string): Promise<string | null> {
    try {
      const response = await productServiceClient.get<{ name: string }>(`/products/${productId}`);
      return response.data.name ?? null;
    } catch {
      return null;
    }
  }
}
