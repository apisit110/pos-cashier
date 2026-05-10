import React, { useState, useEffect, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { PageHeader } from '../../components/PageHeader';
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

const TableWrapper = styled.div`
  background: ${({ theme }) => theme.semantics.colors.bg.card};
  border: 1px solid ${({ theme }) => theme.semantics.colors.border.subtle};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;

  th, td {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid ${({ theme }) => theme.semantics.colors.border.subtle};
  }

  th {
    background: rgba(255, 255, 255, 0.02);
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: ${({ theme }) => theme.semantics.colors.text.secondary};
  }

  td { font-size: 0.875rem; }

  tr:last-child td { border-bottom: none; }
`;

const PriceTag = styled.span`
  font-weight: 700;
  color: ${({ theme }) => theme.semantics.colors.accent.primary};
`;

const ProductImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  object-fit: cover;
  background: rgba(255, 255, 255, 0.05);
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

interface ProductListPageProps {
  onBack: () => void;
  getProductsUseCase: GetProductsUseCase;
  syncProductsUseCase: SyncProductsUseCase;
}

export const ProductListPage: React.FC<ProductListPageProps> = ({ onBack, getProductsUseCase, syncProductsUseCase }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getProductsUseCase.execute();
      setProducts(result);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setIsLoading(false);
    }
  }, [getProductsUseCase]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

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

  return (
    <Container>
      <PageHeader
        title="Products Inventory"
        onBack={onBack}
        extraContent={
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span className="total-count">Total: {products.length} Products</span>
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
        <TableWrapper>
          <Table>
            <thead>
              <tr>
                <th style={{ width: '60px' }}>Image</th>
                <th>Barcode</th>
                <th>Product Name</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '3rem' }}>
                    <Loader />
                    Loading products...
                  </td>
                </tr>
              ) : products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id}>
                    <td>
                      {product.image ? (
                        <ProductImage src={product.image} alt={product.name} />
                      ) : (
                        <div style={{ width: 40, height: 40, background: 'rgba(255,255,255,0.05)', borderRadius: 8 }} />
                      )}
                    </td>
                    <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{product.barcode}</td>
                    <td>{product.name}</td>
                    <td>
                      <PriceTag>฿{product.price.toFixed(2)}</PriceTag>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>No products found.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </TableWrapper>
        {isSyncing && <LoadingOverlay>Synchronizing data...</LoadingOverlay>}
      </Content>
    </Container>
  );
};
