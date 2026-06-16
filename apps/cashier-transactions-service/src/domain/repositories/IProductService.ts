export interface IProductService {
  getProductName(productId: string): Promise<string | null>;
}
