import React, { useState, useEffect, useCallback } from 'react';
import { PageHeader, Badge } from '@apisit110/pos-ui';
import { Container } from './Container';
import { Content } from './Content';
import { Card } from './Card';
import { DetailGrid } from './DetailGrid';
import { DetailItem } from './DetailItem';
import { LoadingState } from './LoadingState';
import { Spinner } from './Spinner';
import type { GetTransactionByIdUseCase } from '../../../application/use-cases/GetTransactionByIdUseCase';
import type { Transaction } from '../../../domain/repositories/TransactionRepository';
import { formatDateTime } from '../../utils/date';

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

  return (
    <Container>
      <PageHeader
        title="Transaction Details"
        onBack={onBack}
      />

      <Content>
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
        ) : null}
      </Content>
    </Container>
  );
};
