import React, { useState, useEffect, useCallback } from 'react';
import { PageHeader, DataTable, type Column, Button, PageContainer, PageContent, FilterBar, TextFilter } from '@apisit110/pos-ui';
import { PriceTag } from '../../components/PriceTag';
import { ProductImage } from '../../components/ProductImage';
import { ImageFallback } from '../../components/ImageFallback';
import { SyncButton } from '../../components/SyncButton';
import { BrandBadge } from '../../components/BrandBadge';
import { Loading } from '../../components/Loading';
import { AlertDialog } from '../../components/AlertDialog';
import type { GetProductsUseCase } from '../../../domain/use-cases/GetProductsUseCase';
import type { SyncProductsUseCase } from '../../../domain/use-cases/SyncProductsUseCase';
import type { Product } from '../../../domain/entities/Product';
import { useTranslation } from '../../i18n/LanguageContext';
import { formatMessage } from '../../i18n/format';

const ProductImageCell: React.FC<{ product: Product }> = ({ product }) => {
  const [error, setError] = React.useState(false);

  if (product.image && !error) {
    return (
      <ProductImage
        src={product.image}
        alt={product.name}
        onError={() => setError(true)}
      />
    );
  }

  return (
    <ImageFallback>
      {product.name.charAt(0).toUpperCase()}
    </ImageFallback>
  );
};

interface ProductListPageProps {
  onBack: () => void;
  onNavigateToCreateProduct: () => void;
  onNavigateToEditProduct: (product: Product) => void;
  getProductsUseCase: GetProductsUseCase;
  syncProductsUseCase: SyncProductsUseCase;
}

export const ProductListPage: React.FC<ProductListPageProps> = ({ onBack, onNavigateToCreateProduct, onNavigateToEditProduct, getProductsUseCase, syncProductsUseCase }) => {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [filters, setFilters] = useState({
    barcode: '',
    name: '',
    price: '',
    brand: '',
  });

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const activeFilters = Object.entries(filters).reduce((acc, [key, value]) => {
        if (value !== '') {
          acc[key as keyof typeof filters] = value;
        }
        return acc;
      }, {} as any);

      const result = await getProductsUseCase.execute(activeFilters);
      setProducts(result);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setIsLoading(false);
    }
  }, [getProductsUseCase, filters]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      fetchProducts();
    }, 500);

    return () => clearTimeout(timer);
  }, [filters, fetchProducts]);

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncError(null);
    try {
      const mid = process.env.NEXT_PUBLIC_MID;
      const sid = process.env.NEXT_PUBLIC_SID;

      if (!mid || !sid) {
        throw new Error('MID or SID not configured in environment');
      }

      const result = await syncProductsUseCase.execute(mid, sid);
      if (!result.success) {
        throw new Error('Sync failed: server returned unsuccessful response');
      }
      await fetchProducts();
    } catch (error) {
      console.error('Failed to sync products:', error);
      setSyncError(error instanceof Error ? error.message : 'Failed to sync products');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const columns: Column<Product>[] = [
    {
      header: t.productList.columnImage,
      key: 'image',
      width: '80px',
      render: (product) => <ProductImageCell product={product} />
    },
    {
      header: t.productList.columnBarcode,
      key: 'barcode',
      width: '180px',
      render: (product) => <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#94a3b8' }}>{product.barcode}</span>
    },
    { header: t.productList.columnName, key: 'name' },
    {
      header: t.productList.columnBrand,
      key: 'brand',
      width: '150px',
      render: (product) => product.brand ? <BrandBadge>{product.brand}</BrandBadge> : '-'
    },
    {
      header: t.productList.columnPrice,
      key: 'price',
      width: '150px',
      textAlign: 'right',
      render: (product) => <PriceTag>฿{product.price.toFixed(2)}</PriceTag>
    },
    {
      header: t.productList.columnActions,
      key: 'id',
      width: '100px',
      textAlign: 'center',
      render: (product) => (
        <SyncButton onClick={() => onNavigateToEditProduct(product)} disabled={isSyncing || isLoading}>
          {t.common.edit}
        </SyncButton>
      ),
    },
  ];

  const paginatedProducts = products.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <PageContainer>
      <PageHeader
        title={t.productList.title}
        onBack={onBack}
        extraContent={
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span className="total-count">
              {formatMessage(t.productList.totalProducts, { count: products.length })}
            </span>
            <Button variant="primary" style={{ width: 'auto' }} disabled={isSyncing || isLoading} onClick={onNavigateToCreateProduct}>
              {t.productList.createProduct}
            </Button>
            <Button variant="primary" style={{ width: 'auto' }} isLoading={isSyncing} disabled={isLoading} onClick={handleSync}>
              {isSyncing ? t.productList.syncing : t.productList.syncProducts}
            </Button>
          </div>
        }
      />

      <PageContent>
        <FilterBar>
          <TextFilter
            label={t.productList.filterBarcode}
            placeholder={t.productList.filterBarcodePlaceholder}
            value={filters.barcode}
            onChange={(value) => handleFilterChange('barcode', value)}
          />
          <TextFilter
            label={t.productList.filterName}
            placeholder={t.productList.filterNamePlaceholder}
            value={filters.name}
            onChange={(value) => handleFilterChange('name', value)}
          />
          <TextFilter
            label={t.productList.filterBrand}
            placeholder={t.productList.filterBrandPlaceholder}
            value={filters.brand}
            onChange={(value) => handleFilterChange('brand', value)}
          />
          <TextFilter
            label={t.productList.filterPrice}
            placeholder={t.productList.filterPricePlaceholder}
            value={filters.price}
            onChange={(value) => handleFilterChange('price', value)}
          />
        </FilterBar>

        <DataTable
          columns={columns}
          data={paginatedProducts}
          isLoading={isLoading}
          totalItems={products.length}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
          emptyMessage={t.productList.emptyMessage}
        />
      </PageContent>

      {isSyncing && <Loading fullscreen label={t.productList.syncingLabel} />}

      <AlertDialog
        open={syncError !== null}
        title={t.productList.syncFailedTitle}
        description={syncError ?? ''}
        buttons={[
          { label: t.common.ok, variant: 'primary', onClick: () => setSyncError(null) },
        ]}
        autoCloseSeconds={5}
        closeOnOverlayClick
        onClose={() => setSyncError(null)}
      />
    </PageContainer>
  );
};
