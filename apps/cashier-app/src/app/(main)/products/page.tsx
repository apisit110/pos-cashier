'use client';

import { useRouter } from 'next/navigation';
import { ProductListPage } from '../../../presentation/pages/product-list/ProductListPage';
import { getProductsUseCase, syncProductsUseCase } from '../../../presentation/di/container';

export default function ProductList() {
  const router = useRouter();

  return (
    <ProductListPage
      onBack={() => router.push('/dashboard')}
      onNavigateToCreateProduct={() => router.push('/products/create')}
      onNavigateToEditProduct={(product) => router.push(`/products/${product.id}/edit`)}
      getProductsUseCase={getProductsUseCase}
      syncProductsUseCase={syncProductsUseCase}
    />
  );
}
