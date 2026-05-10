import React, { useState, useEffect, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { PageHeader } from '../../components/PageHeader';
import { DataTable, type Column } from '../../components/DataTable';
import type { GetProductsUseCase } from '../../../application/use-cases/GetProductsUseCase';
import type { SyncProductsUseCase } from '../../../application/use-cases/SyncProductsUseCase';
import type { Product } from '../../../domain/entities/Product';

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.semantics.colors.bg.main};
  color: ${({ theme }) => theme.semantics.colors.text.primary};
  padding: 2rem;

  .total-count {
    font-size: 0.875rem;
    color: ${({ theme }) => theme.semantics.colors.text.secondary};
    background: rgba(255, 255, 255, 0.05);
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
  }
`;

const Content = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const StatusMessage = styled.div<{ $type: 'success' | 'error' }>`
  margin-bottom: 1.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: 500;
  font-size: 0.875rem;
  background-color: ${({ $type }) => $type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)'};
  color: ${({ $type }) => $type === 'success' ? '#16a34a' : '#dc2626'};
  border: 1px solid ${({ $type }) => $type === 'success' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'};
`;

const PriceTag = styled.span`
  font-weight: 700;
  color: ${({ theme }) => theme.semantics.colors.accent.primary};
`;

const ProductImage = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 10px;
  object-fit: cover;
  background: rgba(255, 255, 255, 0.03);
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
  }
`;

const ImageFallback = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.semantics.colors.text.secondary};
  font-size: 1rem;
  font-weight: 700;
  border: 1px dashed ${({ theme }) => theme.semantics.colors.border.subtle};
`;

const SyncButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${({ theme }) => theme.semantics.colors.accent.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    filter: brightness(1.1);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Loader = styled.div`
  width: 24px;
  height: 24px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  display: inline-block;
  margin-right: 0.75rem;
  vertical-align: middle;
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  backdrop-filter: blur(4px);
  font-weight: 600;
  color: ${({ theme }) => theme.semantics.colors.accent.primary};
`;

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
  getProductsUseCase: GetProductsUseCase;
  syncProductsUseCase: SyncProductsUseCase;
}

const FilterSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
  background: rgba(255, 255, 255, 0.03);
  padding: 1.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 1px solid ${({ theme }) => theme.semantics.colors.border.subtle};
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: ${({ theme }) => theme.semantics.colors.text.secondary};
  }

  input {
    background: rgba(15, 23, 42, 0.5);
    border: 1px solid ${({ theme }) => theme.semantics.colors.border.subtle};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    padding: 0.625rem 1rem;
    color: ${({ theme }) => theme.semantics.colors.text.primary};
    font-size: 0.875rem;
    transition: all 0.2s;

    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.semantics.colors.accent.primary};
      box-shadow: 0 0 0 2px ${({ theme }) => theme.semantics.colors.accent.primary}20;
      background: rgba(15, 23, 42, 0.8);
    }

    &::placeholder {
      color: ${({ theme }) => theme.semantics.colors.text.secondary}80;
    }
  }
`;

const BrandBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid ${({ theme }) => theme.semantics.colors.border.subtle};
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ theme }) => theme.semantics.colors.text.secondary};
`;

export const ProductListPage: React.FC<ProductListPageProps> = ({ onBack, getProductsUseCase, syncProductsUseCase }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filter states
  const [filters, setFilters] = useState({
    barcode: '',
    name: '',
    price: '',
    brand: '',
  });

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      // Create a clean filter object (remove empty strings)
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

  // Debounced effect for filtering
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      fetchProducts();
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [filters, fetchProducts]);

  const handleSync = async () => {
    setIsSyncing(true);
    setMessage(null);
    try {
      const mid = import.meta.env.VITE_MID;
      const sid = import.meta.env.VITE_SID;

      if (!mid || !sid) {
        throw new Error('MID or SID not configured in environment');
      }

      const result = await syncProductsUseCase.execute(mid, sid);
      setMessage({ text: `Products synced! ${result.count} items updated.`, type: 'success' });
      await fetchProducts();
    } catch (error: any) {
      console.error('Failed to sync products:', error);
      setMessage({ text: error.message || 'Failed to sync products', type: 'error' });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filtering
  };

  const columns: Column<Product>[] = [
    { 
      header: 'Image', 
      key: 'image', 
      width: '80px',
      render: (product) => <ProductImageCell product={product} />
    },
    { 
      header: 'Barcode', 
      key: 'barcode',
      width: '180px',
      render: (product) => <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#94a3b8' }}>{product.barcode}</span>
    },
    { header: 'Product Name', key: 'name' },
    { 
      header: 'Brand', 
      key: 'brand',
      width: '150px',
      render: (product) => product.brand ? <BrandBadge>{product.brand}</BrandBadge> : '-'
    },
    { 
      header: 'Price', 
      key: 'price',
      width: '150px',
      textAlign: 'right',
      render: (product) => <PriceTag>฿{product.price.toFixed(2)}</PriceTag>
    },
  ];

  const paginatedProducts = products.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <Container>
      <PageHeader
        title="Products Inventory"
        onBack={onBack}
        extraContent={
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span className="total-count">
              Total: {products.length} Products
            </span>
            <SyncButton onClick={handleSync} disabled={isSyncing || isLoading}>
              {isSyncing ? <Loader style={{ width: 14, height: 14, margin: 0 }} /> : null}
              {isSyncing ? 'Syncing...' : 'Sync Products'}
            </SyncButton>
          </div>
        }
      />

      <Content>
        {message && (
          <StatusMessage $type={message.type}>
            {message.text}
          </StatusMessage>
        )}

        <FilterSection>
          <FilterGroup>
            <label htmlFor="filter-barcode">Barcode</label>
            <input 
              id="filter-barcode"
              type="text" 
              placeholder="Search barcode..." 
              value={filters.barcode}
              onChange={(e) => handleFilterChange('barcode', e.target.value)}
            />
          </FilterGroup>
          <FilterGroup>
            <label htmlFor="filter-name">Product Name</label>
            <input 
              id="filter-name"
              type="text" 
              placeholder="Search product name..." 
              value={filters.name}
              onChange={(e) => handleFilterChange('name', e.target.value)}
            />
          </FilterGroup>
          <FilterGroup>
            <label htmlFor="filter-brand">Brand</label>
            <input 
              id="filter-brand"
              type="text" 
              placeholder="Search brand..." 
              value={filters.brand}
              onChange={(e) => handleFilterChange('brand', e.target.value)}
            />
          </FilterGroup>
          <FilterGroup>
            <label htmlFor="filter-price">Price</label>
            <input 
              id="filter-price"
              type="text" 
              placeholder="Search price..." 
              value={filters.price}
              onChange={(e) => handleFilterChange('price', e.target.value)}
            />
          </FilterGroup>
        </FilterSection>
        
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
          loadingMessage="Loading products..."
          emptyMessage="No products found matching your filters."
        />
        
        {isSyncing && <LoadingOverlay>Synchronizing data...</LoadingOverlay>}
      </Content>
    </Container>
  );
};
