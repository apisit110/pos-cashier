import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { PageHeader, Badge, PageContainer, PageContent, DataTable } from '@apisit110/pos-ui';
import { Card } from './Card';
import { DetailGrid } from './DetailGrid';
import { DetailItem } from './DetailItem';
import { LoadingState } from './LoadingState';
import { Spinner } from './Spinner';
import type { GetTransactionByIdUseCase } from '../../../domain/use-cases/GetTransactionByIdUseCase';
import type { Transaction, OrderItem } from '../../../domain/repositories/TransactionRepository';
import { formatDateTime } from '../../utils/date';

type IndexedOrderItem = OrderItem & { _rowIndex: number };

const SectionTitle = styled.h3`
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${({ theme }) => theme.semantics.colors.text.secondary};
  margin: 0 0 1rem 0;
`;

const orderItemColumns = [
  {
    header: '#',
    key: '_rowIndex',
    width: '60px',
    render: (item: IndexedOrderItem) => (
      <span style={{ opacity: 0.5, fontVariantNumeric: 'tabular-nums' }}>
        {item._rowIndex + 1}
      </span>
    ),
  },
  {
    header: 'Product',
    key: 'productName',
    render: (item: IndexedOrderItem) => (
      <div>
        <div style={{ fontWeight: 600 }}>{item.productName}</div>
        <div style={{ fontSize: '0.75rem', opacity: 0.5, fontFamily: 'monospace' }}>{item.productId}</div>
      </div>
    ),
  },
  {
    header: 'Unit Price',
    key: 'unitPrice',
    textAlign: 'right' as const,
    render: (item: IndexedOrderItem) => (
      <span style={{ fontVariantNumeric: 'tabular-nums' }}>฿{item.unitPrice.toFixed(2)}</span>
    ),
  },
  {
    header: 'Qty',
    key: 'quantity',
    textAlign: 'center' as const,
    width: '80px',
    render: (item: IndexedOrderItem) => <span style={{ fontWeight: 600 }}>{item.quantity}</span>,
  },
  {
    header: 'Total',
    key: 'total',
    textAlign: 'right' as const,
    render: (item: IndexedOrderItem) => (
      <span style={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>฿{item.total.toFixed(2)}</span>
    ),
  },
];

interface TransactionDetailPageProps {
  transactionId: string;
  onBack: () => void;
  getTransactionByIdUseCase: GetTransactionByIdUseCase;
}

export const TransactionDetailPage: React.FC<TransactionDetailPageProps> = ({
  transactionId,
  onBack,
  getTransactionByIdUseCase
}) => {
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransaction = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getTransactionByIdUseCase.execute(transactionId);
      setTransaction(result);
    } catch (err) {
      console.error('Failed to fetch transaction:', err);
      setError('Could not find transaction details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [getTransactionByIdUseCase, transactionId]);

  useEffect(() => {
    fetchTransaction();
  }, [fetchTransaction]);

  const indexedOrderItems: IndexedOrderItem[] = (transaction?.orderItems ?? []).map(
    (item, i) => ({ ...item, _rowIndex: i })
  );

  return (
    <PageContainer>
      <PageHeader title="Transaction Details" onBack={onBack} />

      <PageContent>
        {isLoading ? (
          <LoadingState>
            <Spinner />
            <p>Loading transaction details...</p>
          </LoadingState>
        ) : error ? (
          <Card>
            <p style={{ color: '#ef4444', textAlign: 'center' }}>{error}</p>
          </Card>
        ) : transaction ? (
          <>
            <Card>
              <DetailItem>
                <label>Amount Total</label>
                <span className="amount">฿{transaction.amount.toFixed(2)}</span>
              </DetailItem>

              <DetailGrid>
                <DetailItem>
                  <label>Transaction ID</label>
                  <span style={{ fontFamily: 'monospace' }}>#{transaction.id}</span>
                </DetailItem>
                <DetailItem>
                  <label>Order Reference</label>
                  <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{transaction.orderId}</span>
                </DetailItem>
                <DetailItem>
                  <label>Date & Time</label>
                  <span>{formatDateTime(transaction.createdAt)}</span>
                </DetailItem>
                <DetailItem>
                  <label>Staff Member</label>
                  <span>{transaction.staffName}</span>
                </DetailItem>
                <DetailItem>
                  <label>Payment Method</label>
                  <div>
                    <Badge $variant="info" $size="md">
                      {transaction.paymentMethod.replace('_', ' ')}
                    </Badge>
                  </div>
                </DetailItem>
                <DetailItem>
                  <label>Status</label>
                  <div>
                    <Badge
                      $variant={transaction.status.toLowerCase() === 'success' ? 'success' : 'error'}
                      $shape="pill"
                      $size="md"
                    >
                      {transaction.status}
                    </Badge>
                  </div>
                </DetailItem>
              </DetailGrid>
            </Card>

            <div style={{ marginTop: '2rem' }}>
              <SectionTitle>Order Items ({indexedOrderItems.length})</SectionTitle>
              <DataTable
                columns={orderItemColumns}
                data={indexedOrderItems}
                emptyMessage="No order items available."
              />
            </div>
          </>
        ) : null}
      </PageContent>
    </PageContainer>
  );
};
