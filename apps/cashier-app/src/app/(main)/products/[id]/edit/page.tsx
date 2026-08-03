'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { EditProductPage } from '../../../../../presentation/pages/edit-product/EditProductPage';
import { getProductsUseCase, updateProductUseCase } from '../../../../../presentation/di/container';
import type { Product } from '../../../../../domain/entities/Product';
import { useTranslation } from '../../../../../presentation/i18n/LanguageContext';

export default function ProductEdit() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { t } = useTranslation();
  const [product, setProduct] = useState<Product | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;

    getProductsUseCase.execute().then((products) => {
      if (cancelled) return;
      setProduct(products.find((p) => p.id === params.id) ?? null);
    });

    return () => {
      cancelled = true;
    };
  }, [params.id]);

  if (product === undefined) {
    return null;
  }

  if (product === null) {
    return <div>{t.common.error}</div>;
  }

  return (
    <EditProductPage
      onBack={() => router.push('/products')}
      product={product}
      updateProductUseCase={updateProductUseCase}
    />
  );
}
