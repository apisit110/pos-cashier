import React, { useState, useEffect, useCallback } from 'react';
import dayjs, { formatDateTime } from '../../utils/date';
import {
  PageHeader, DataTable, Badge, PageContainer, PageContent,
  FilterBar, DateFilter, TextFilter, SelectFilter, ClearFilterButton,
} from '@apisit110/pos-ui';
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
    <PageContainer>
      <PageHeader
        title="Sales History"
        onBack={onBack}
        extraContent={<span className="total-count">Total: {total} Transactions</span>}
      />

      <PageContent>
        <FilterBar>
          <DateFilter
            label="Start Date"
            value={filters.startDate || ''}
            onChange={(value) => handleFilterChange('startDate', value)}
          />

          <DateFilter
            label="End Date"
            value={filters.endDate || ''}
            onChange={(value) => handleFilterChange('endDate', value)}
          />

          <TextFilter
            label="Transaction ID"
            placeholder="Enter ID"
            value={filters.id || ''}
            onChange={(value) => handleFilterChange('id', value)}
          />

          <SelectFilter
            label="Method"
            value={filters.method || ''}
            onChange={(value) => handleFilterChange('method', value)}
            placeholder="All Methods"
            options={[
              { value: 'CASH', label: 'Cash' },
              { value: 'CREDIT', label: 'Credit Card' },
              { value: 'QR', label: 'QR PromptPay' },
            ]}
          />

          <SelectFilter
            label="Amount Range"
            value={filters.amountRange || ''}
            onChange={(value) => handleFilterChange('amountRange', value)}
            placeholder="Any Amount"
            options={[
              { value: '0-99', label: '0 - 99' },
              { value: '100-299', label: '100 - 299' },
              { value: '300-499', label: '300 - 499' },
              { value: '500+', label: '500 ++' },
            ]}
          />

          <SelectFilter
            label="Status"
            value={filters.status || ''}
            onChange={(value) => handleFilterChange('status', value)}
            placeholder="All Status"
            options={[
              { value: 'SUCCESS', label: 'Success' },
              { value: 'FAILED', label: 'Failed' },
              { value: 'REFUNDED', label: 'Refunded' },
            ]}
          />

          <ClearFilterButton onClick={clearFilters}>Clear Filters</ClearFilterButton>
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
                <Badge $variant="info">
                  {tx.paymentMethod.replace('_', ' ')}
                </Badge>
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
              render: (tx) => (
                <Badge $variant={tx.status.toLowerCase() === 'success' ? 'success' : 'error'}>
                  {tx.status}
                </Badge>
              )
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
      </PageContent>
    </PageContainer>
  );
};
