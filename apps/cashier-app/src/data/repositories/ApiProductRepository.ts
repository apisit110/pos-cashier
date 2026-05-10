import { Product } from '../../domain/entities/Product';
import type { ProductRepository } from '../../domain/repositories/ProductRepository';
import api from '../../infrastructure/api/axiosInstance';

export class ApiProductRepository implements ProductRepository {
  private readonly baseUrl = 'http://localhost:3001/v1';

  async findByBarcode(barcode: string): Promise<Product | null> {
    try {
      const response = await api.get(`${this.baseUrl}/products/barcode/${barcode}`);
      const data = response.data;
      return new Product(
        data.id,
        data.barcode,
        data.name,
        data.price,
        data.imageUrl,
        data.brand
      );
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      console.error('Error fetching product by barcode:', error);
      throw error;
    }
  }

  async getAllProducts(filters?: any): Promise<Product[]> {
    try {
      const response = await api.get(`${this.baseUrl}/products`, {
        params: filters,
      });
      return response.data.map((item: any) => new Product(
        item.id,
        item.barcode,
        item.name,
        item.price,
        item.imageUrl,
        item.brand
      ));
    } catch (error) {
      console.error('Error fetching all products:', error);
      return [];
    }
  }

  async syncProducts(mid: string, sid: string): Promise<{ success: boolean; count: number }> {
    try {
      const response = await api.post(`${this.baseUrl}/products/sync`, {
        mid,
        sid,
      });
      return response.data;
    } catch (error) {
      console.error('Error syncing products:', error);
      throw error;
    }
  }
}
