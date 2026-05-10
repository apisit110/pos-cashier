import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { PageHeader } from '../../components/PageHeader';
import type { GetTransactionByIdUseCase } from '../../../application/use-cases/GetTransactionByIdUseCase';
import type { Transaction } from '../../../domain/repositories/TransactionRepository';
import { formatDateTime } from '../../utils/date';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.semantics.colors.bg.main};
  color: ${({ theme }) => theme.semantics.colors.text.primary};
  padding: 2rem;
`;

const Content = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
`;

const Card = styled.div`
  background: ${({ theme }) => theme.semantics.colors.bg.card};
  border: 1px solid ${({ theme }) => theme.semantics.colors.border.subtle};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: 2rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 2rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const DetailItem = styled.div`
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

  span {
    font-size: 1.125rem;
    font-weight: 500;
  }

  .amount {
    font-size: 2rem;
    font-weight: 700;
    color: ${({ theme }) => theme.semantics.colors.accent.primary};
  }
`;

const StatusBadge = styled.span<{ $status: string }>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: uppercase;
  background: ${({ $status }) => $status.toLowerCase() === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)'};
  color: ${({ $status }) => $status.toLowerCase() === 'success' ? '#22c55e' : '#ef4444'};
  border: 1px solid ${({ $status }) => $status.toLowerCase() === 'success' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'};
`;

const MethodBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: uppercase;
  background: rgba(99, 102, 241, 0.1);
  color: #818cf8;
`;

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  gap: 1rem;
  color: ${({ theme }) => theme.semantics.colors.text.secondary};
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top-color: ${({ theme }) => theme.semantics.colors.accent.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

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
                  <MethodBadge>{transaction.paymentMethod.replace('_', ' ')}</MethodBadge>
                </div>
              </DetailItem>
              <DetailItem>
                <label>Status</label>
                <div>
                  <StatusBadge $status={transaction.status}>{transaction.status}</StatusBadge>
                </div>
              </DetailItem>
            </DetailGrid>
          </Card>
        ) : null}
      </Content>
    </Container>
  );
};
