import React, { useState, useEffect, useCallback } from 'react';
import dayjs, { formatDateTime } from '../../utils/date';
import {
  PageHeader, DataTable, Badge, PageContainer, PageContent,
  FilterBar, DateFilter, TextFilter, SelectFilter, ClearFilterButton,
} from '@apisit110/pos-ui';
import type { GetTransactionsUseCase } from '../../../domain/use-cases/GetTransactionsUseCase';
import type { Transaction, TransactionFilter } from '../../../domain/repositories/TransactionRepository';
import { useTranslation } from '../../i18n/LanguageContext';
import { formatMessage } from '../../i18n/format';

declare module '@apisit110/pos-ui' {
  interface Column<T> {
    subHeader?: string;
    subRender?: (item: T) => React.ReactNode;
  }
}

interface TransactionListPageProps {
  onBack: () => void;
  onViewDetail: (id: string) => void;
  getTransactionsUseCase: GetTransactionsUseCase;
}

export const TransactionListPage: React.FC<TransactionListPageProps> = ({ onBack, onViewDetail, getTransactionsUseCase }) => {
  const { t } = useTranslation();
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
        title={t.transactionList.title}
        onBack={onBack}
        extraContent={<span className="total-count">{formatMessage(t.transactionList.totalTransactions, { count: total })}</span>}
      />

      <PageContent>
        <FilterBar>
          <DateFilter
            label={t.transactionList.startDate}
            value={filters.startDate || ''}
            onChange={(value) => handleFilterChange('startDate', value)}
          />

          <DateFilter
            label={t.transactionList.endDate}
            value={filters.endDate || ''}
            onChange={(value) => handleFilterChange('endDate', value)}
          />

          <TextFilter
            label={t.transactionList.transactionId}
            placeholder={t.transactionList.transactionIdPlaceholder}
            value={filters.id || ''}
            onChange={(value) => handleFilterChange('id', value)}
          />

          <TextFilter
            label={t.transactionList.orderId}
            placeholder={t.transactionList.orderIdPlaceholder}
            value={filters.orderId || ''}
            onChange={(value) => handleFilterChange('orderId', value)}
          />

          <SelectFilter
            label={t.transactionList.method}
            value={filters.method || ''}
            onChange={(value) => handleFilterChange('method', value)}
            placeholder={t.transactionList.methodAll}
            options={[
              { value: 'CASH', label: t.transactionList.methodCash },
              { value: 'CREDIT', label: t.transactionList.methodCredit },
              { value: 'QR', label: t.transactionList.methodQr },
            ]}
          />

          <SelectFilter
            label={t.transactionList.amountRange}
            value={filters.amountRange || ''}
            onChange={(value) => handleFilterChange('amountRange', value)}
            placeholder={t.transactionList.amountRangeAny}
            options={[
              { value: '0-99', label: '0 - 99' },
              { value: '100-299', label: '100 - 299' },
              { value: '300-499', label: '300 - 499' },
              { value: '500+', label: '500 ++' },
            ]}
          />

          <SelectFilter
            label={t.transactionList.status}
            value={filters.status || ''}
            onChange={(value) => handleFilterChange('status', value)}
            placeholder={t.transactionList.statusAll}
            options={[
              { value: 'SUCCESS', label: t.transactionList.statusSuccess },
              { value: 'FAILED', label: t.transactionList.statusFailed },
              { value: 'REFUNDED', label: t.transactionList.statusRefunded },
            ]}
          />

          <ClearFilterButton onClick={clearFilters}>{t.transactionList.clearFilters}</ClearFilterButton>
        </FilterBar>

        <DataTable
          columns={[
            {
              header: t.transactionList.columnDate,
              subHeader: t.transactionList.columnTime,
              key: 'createdAt',
              render: (tx) => formatDateTime(tx.createdAt, 'YYYY-MM-DD'),
              subRender: (tx) => formatDateTime(tx.createdAt, 'HH:mm:ss'),
            },
            {
              header: t.transactionList.columnTransactionId,
              key: 'id',
              render: (tx) => <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{tx.id}</span>
            },
            {
              header: t.transactionList.columnOrderId,
              key: 'orderId',
              render: (tx) => <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{tx.orderId}</span>
            },
            {
              header: t.transactionList.columnAmount,
              key: 'amount',
              render: (tx) => <span style={{ fontWeight: 700 }}>฿{tx.amount.toFixed(2)}</span>
            },
            {
              header: t.transactionList.columnStatus,
              key: 'status',
              render: (tx) => (
                <Badge $variant={tx.status.toLowerCase() === 'success' ? 'success' : 'error'}>
                  {tx.status}
                </Badge>
              )
            },
            {
              header: t.transactionList.columnActions,
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
                  {t.transactionList.viewDetails}
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
          emptyMessage={t.transactionList.emptyMessage}
        />
      </PageContent>
    </PageContainer>
  );
};
