'use client';

import { useRouter } from 'next/navigation';
import { CreateProductPage } from '../../../../presentation/pages/create-product/CreateProductPage';
import { createProductUseCase } from '../../../../presentation/di/container';

export default function ProductCreate() {
  const router = useRouter();

  return (
    <CreateProductPage
      onBack={() => router.push('/products')}
      createProductUseCase={createProductUseCase}
    />
  );
}
