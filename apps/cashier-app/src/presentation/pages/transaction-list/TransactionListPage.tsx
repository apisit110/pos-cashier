import React, { useState, useEffect, useCallback } from 'react';
import dayjs, { formatDateTime } from '../../utils/date';
import { PageHeader } from '../../components/PageHeader';
import { DataTable } from '../../components/DataTable';
import { Container } from './Container';
import { Content } from './Content';
import { MethodBadge } from './MethodBadge';
import { StatusBadge } from './StatusBadge';
import { FilterBar } from './FilterBar';
import { FormGroup } from './FormGroup';
import { ClearButton } from './ClearButton';
import type { GetTransactionsUseCase } from '../../../application/use-cases/GetTransactionsUseCase';
import type { Transaction, TransactionFilter } from '../../../domain/repositories/TransactionRepository';

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
          emptyMessage="No transactions found."
        />
      </Content>
    </Container>
  );
};
