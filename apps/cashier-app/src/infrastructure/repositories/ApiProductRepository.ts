import { Product } from '../../domain/entities/Product';
import type { ProductRepository, CreateProductInput, UpdateProductInput } from '../../domain/repositories/ProductRepository';
import api from '../api/axiosInstance';

export class ApiProductRepository implements ProductRepository {
  async findByBarcode(barcode: string): Promise<Product | null> {
    try {
      const response = await api.get(`/products/barcode/${barcode}`);
      const data = response.data;
      return new Product(data.id, data.barcode, data.name, data.price, data.imageUrl, data.brand);
    } catch (error: any) {
      if (error.response?.status === 404) return null;
      throw error;
    }
  }

  async getAllProducts(filters?: any): Promise<Product[]> {
    try {
      const response = await api.get('/products', { params: filters });
      return response.data.map(
        (item: any) => new Product(item.id, item.barcode, item.name, item.price, item.imageUrl, item.brand)
      );
    } catch {
      return [];
    }
  }

  async syncProducts(mid: string, sid: string): Promise<{ success: boolean; count: number }> {
    const response = await api.post('/products/sync', { mid, sid });
    return response.data;
  }

  async createProduct(input: CreateProductInput): Promise<Product> {
    const response = await api.post('/products', input);
    const data = response.data;
    return new Product(data.id, data.barcode, data.name, data.price, data.imageUrl, data.brand);
  }

  async updateProduct(id: string, input: UpdateProductInput): Promise<Product> {
    const response = await api.put(`/products/${id}`, input);
    const data = response.data;
    return new Product(data.id, data.barcode, data.name, data.price, data.imageUrl, data.brand);
  }
}
