import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import dayjs, { formatDateTime } from '../../utils/date';
import { PageHeader } from '../../components/PageHeader';
import { DataTable } from '../../components/DataTable';
import type { GetTransactionsUseCase } from '../../../application/use-cases/GetTransactionsUseCase';
import type { Transaction, TransactionFilter } from '../../../domain/repositories/TransactionRepository';



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

const MethodBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  background: rgba(99, 102, 241, 0.1);
  color: #818cf8;
`;

const StatusBadge = styled.span<{ $status: string }>`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  background: ${({ $status }) => $status.toLowerCase() === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)'};
  color: ${({ $status }) => $status.toLowerCase() === 'success' ? '#22c55e' : '#ef4444'};
`;

const FilterBar = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
  background: ${({ theme }) => theme.semantics.colors.bg.card};
  border: 1px solid ${({ theme }) => theme.semantics.colors.border.subtle};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    font-size: 0.75rem;
    font-weight: 600;
    color: ${({ theme }) => theme.semantics.colors.text.secondary};
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  input, select {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid ${({ theme }) => theme.semantics.colors.border.subtle};
    border-radius: 8px;
    padding: 0.6rem;
    color: ${({ theme }) => theme.semantics.colors.text.primary};
    font-size: 0.875rem;
    outline: none;
    transition: all 0.2s;

    &:focus {
      border-color: ${({ theme }) => theme.semantics.colors.accent.primary};
      background: rgba(255, 255, 255, 0.05);
    }
    
    &::placeholder {
      color: ${({ theme }) => theme.semantics.colors.text.disabled};
    }
  }

  select {
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.75rem center;
    background-size: 1rem;
    padding-right: 2.5rem;
  }
`;

const ClearButton = styled.button`
  background: none;
  border: 1px solid ${({ theme }) => theme.semantics.colors.border.subtle};
  color: ${({ theme }) => theme.semantics.colors.text.secondary};
  padding: 0.6rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  align-self: flex-end;
  height: 38px;

  &:hover {
    border-color: #ef4444;
    color: #ef4444;
    background: rgba(239, 68, 68, 0.05);
  }
`;

interface TransactionListPageProps {
  onBack: () => void;
  onViewDetail: (id: string) => void;
  getTransactionsUseCase: GetTransactionsUseCase;
}

export const TransactionListPage: React.FC<TransactionListPageProps> = ({ onBack, onViewDetail, getTransactionsUseCase }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<TransactionFilter>({});

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    try {
      const apiFilters = { ...filters };
      
      if (apiFilters.startDate) {
        apiFilters.startDate = dayjs.tz(apiFilters.startDate, 'Asia/Bangkok').startOf('day').utc().toISOString();
      }
      
      if (apiFilters.endDate) {
        apiFilters.endDate = dayjs.tz(apiFilters.endDate, 'Asia/Bangkok').endOf('day').utc().toISOString();
      }

      const result = await getTransactionsUseCase.execute(currentPage, pageSize, apiFilters);
      setTransactions(result.transactions);
      setTotal(result.total);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setIsLoading(false);
    }
  }, [getTransactionsUseCase, currentPage, pageSize, filters]);

  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

  const handleFilterChange = (key: keyof TransactionFilter, value: string) => {
    setIsLoading(true);
    setFilters(prev => {
      const newFilters = { ...prev, [key]: value || undefined };
      if (!value) delete newFilters[key];
      return newFilters;
    });
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setIsLoading(true);
    setFilters({});
    setCurrentPage(1);
  };

  return (
    <Container>
      <PageHeader
        title="Sales History"
        onBack={onBack}
        extraContent={<span className="total-count">Total: {total} Transactions</span>}
      />

      <Content>
        <FilterBar>
          <FormGroup>
            <label>Start Date</label>
            <input 
              type="date" 
              value={filters.startDate || ''} 
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <label>End Date</label>
            <input 
              type="date" 
              value={filters.endDate || ''} 
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <label>Transaction ID</label>
            <input 
              type="text" 
              placeholder="Enter ID" 
              value={filters.id || ''} 
              onChange={(e) => handleFilterChange('id', e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <label>Method</label>
            <select 
              value={filters.method || ''} 
              onChange={(e) => handleFilterChange('method', e.target.value)}
            >
              <option value="">All Methods</option>
              <option value="CASH">Cash</option>
              <option value="CREDIT">Credit Card</option>
              <option value="QR">QR PromptPay</option>
            </select>
          </FormGroup>

          <FormGroup>
            <label>Amount Range</label>
            <select 
              value={filters.amountRange || ''} 
              onChange={(e) => handleFilterChange('amountRange', e.target.value)}
            >
              <option value="">Any Amount</option>
              <option value="0-99">0 - 99</option>
              <option value="100-299">100 - 299</option>
              <option value="300-499">300 - 499</option>
              <option value="500+">500 ++</option>
            </select>
          </FormGroup>

          <FormGroup>
            <label>Status</label>
            <select 
              value={filters.status || ''} 
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">All Status</option>
              <option value="SUCCESS">Success</option>
              <option value="FAILED">Failed</option>
              <option value="REFUNDED">Refunded</option>
            </select>
          </FormGroup>

          <ClearButton onClick={clearFilters}>Clear Filters</ClearButton>
        </FilterBar>

        <DataTable
          columns={[
            { 
              header: 'Order No.', 
              key: 'orderId',
              render: (tx) => <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{tx.orderId}</span>
            },
            { 
              header: 'Date & Time', 
              key: 'createdAt',
              render: (tx) => formatDateTime(tx.createdAt)
            },
            { header: 'Staff', key: 'staffName' },
            { 
              header: 'Method', 
              key: 'paymentMethod',
              render: (tx) => (
                <MethodBadge>
                  {tx.paymentMethod.replace('_', ' ')}
                </MethodBadge>
              )
            },
            { 
              header: 'Amount', 
              key: 'amount',
              render: (tx) => <span style={{ fontWeight: 700 }}>฿{tx.amount.toFixed(2)}</span>
            },
            { 
              header: 'Status', 
              key: 'status',
              render: (tx) => <StatusBadge $status={tx.status}>{tx.status}</StatusBadge>
            },
            { 
              header: 'Actions', 
              key: 'actions', 
              textAlign: 'right',
              render: (tx) => (
                <button 
                  onClick={() => onViewDetail(tx.id)}
                  style={{ 
                    background: 'none', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    color: '#818cf8', 
                    padding: '0.4rem 0.8rem', 
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.borderColor = '#818cf8'; e.currentTarget.style.background = 'rgba(129, 140, 248, 0.05)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.background = 'none'; }}
                >
                  View Details
                </button>
              )
            },
          ]}
          data={transactions}
          isLoading={isLoading}
          totalItems={total}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
          loadingMessage="Loading transactions..."
          emptyMessage="No transactions found."
        />
      </Content>
    </Container>
  );
};
