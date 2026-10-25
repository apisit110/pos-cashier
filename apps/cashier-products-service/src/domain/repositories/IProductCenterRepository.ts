import { Product } from '../entities/Product';

export interface IProductCenterRepository {
  pushProduct(product: Product): Promise<void>;
}
