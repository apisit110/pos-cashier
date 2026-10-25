import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { PageHeader, DataTable, type Column, Button, PageContainer, PageContent, FilterBar, TextFilter, ClearFilterButton } from '@apisit110/pos-ui';
import { PriceTag } from '../../components/PriceTag';
import { SyncButton } from '../../components/SyncButton';
import { BrandBadge } from '../../components/BrandBadge';
import { Loading } from '../../components/Loading';
import { AlertDialog } from '../../components/AlertDialog';
import type { GetProductsUseCase } from '../../../domain/use-cases/GetProductsUseCase';
import type { SyncProductsUseCase } from '../../../domain/use-cases/SyncProductsUseCase';
import type { Product } from '../../../domain/entities/Product';
import { useTranslation } from '../../i18n/LanguageContext';
import { useAuth } from '../../auth/AuthContext';
import { formatAmount } from '../../utils/formatAmount';

const SearchFilterBar = styled(FilterBar)`
  grid-template-columns: repeat(4, minmax(0, 1fr)) 120px;
`;

const SearchButtonWrapper = styled.div`
  grid-row: 1;
  grid-column: -2 / -1;
  align-self: end;
  justify-self: end;
  margin-bottom: 8px;
`;

const RightClearFilterButton = styled(ClearFilterButton)`
  grid-row: 2;
  grid-column: -2 / -1;
  justify-self: end;
  width: 120px;
  height: 36px;
  padding-top: 0;
  padding-bottom: 0;
`;

interface ProductListPageProps {
  onBack: () => void;
  onNavigateToCreateProduct: () => void;
  onNavigateToEditProduct: (product: Product) => void;
  getProductsUseCase: GetProductsUseCase;
  syncProductsUseCase: SyncProductsUseCase;
}

export const ProductListPage: React.FC<ProductListPageProps> = ({ onBack, onNavigateToCreateProduct, onNavigateToEditProduct, getProductsUseCase, syncProductsUseCase }) => {
  const { t } = useTranslation();
  const { staff } = useAuth();
  const canCreate = staff?.scope.includes('product:create') ?? false;
  const canEdit = staff?.scope.includes('product:edit') ?? false;
  const canSync = staff?.scope.includes('products:sync') ?? false;
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

  const [appliedFilters, setAppliedFilters] = useState(filters);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const activeFilters = Object.entries(appliedFilters).reduce((acc, [key, value]) => {
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
  }, [getProductsUseCase, appliedFilters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncError(null);
    try {
      const result = await syncProductsUseCase.execute();
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
  };

  const handleSearch = () => {
    setAppliedFilters(filters);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    const empty = { barcode: '', name: '', price: '', brand: '' };
    setFilters(empty);
    setAppliedFilters(empty);
    setCurrentPage(1);
  };

  const allColumns: Column<Product>[] = [
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
      render: (product) => <PriceTag>{formatAmount(product.price, '฿')}</PriceTag>
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
  const columns = allColumns.filter((column) => canEdit || column.key !== 'id');

  const paginatedProducts = products.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <PageContainer>
      <PageHeader
        title={t.productList.title}
        onBack={onBack}
        extraContent={
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {canCreate && (
              <Button variant="primary" style={{ width: 'auto' }} disabled={isSyncing || isLoading} onClick={onNavigateToCreateProduct}>
                {t.productList.createProduct}
              </Button>
            )}
            {canSync && (
              <Button variant="primary" style={{ width: 'auto' }} isLoading={isSyncing} disabled={isLoading} onClick={handleSync}>
                {isSyncing ? t.productList.syncing : t.productList.syncProducts}
              </Button>
            )}
          </div>
        }
      />

      <PageContent>
        <SearchFilterBar>
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
          <SearchButtonWrapper>
            <Button variant="primary" style={{ width: '120px', height: '36px', padding: 0 }} disabled={isLoading} onClick={handleSearch}>
              {t.productList.search}
            </Button>
          </SearchButtonWrapper>
          <RightClearFilterButton onClick={clearFilters}>{t.productList.clearFilters}</RightClearFilterButton>
        </SearchFilterBar>

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
