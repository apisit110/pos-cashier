import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import dayjs, { formatDateTime } from '@lightning-pos/datetime';
import {
  PageHeader, DataTable, Badge, Button, PageContainer, PageContent,
  FilterBar, DateFilter, TextFilter, SelectFilter, ClearFilterButton,
} from '@apisit110/pos-ui';
import type { GetTransactionsUseCase } from '../../../domain/use-cases/GetTransactionsUseCase';
import type { Transaction, TransactionFilter } from '../../../domain/repositories/TransactionRepository';
import { useTranslation } from '../../i18n/LanguageContext';
import { formatAmount } from '../../utils/formatAmount';

declare module '@apisit110/pos-ui' {
  interface Column<T> {
    subHeader?: string;
    subRender?: (item: T) => React.ReactNode;
  }
}

const SearchFilterBar = styled(FilterBar)`
  grid-template-columns: repeat(7, minmax(0, 1fr)) 120px;
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

interface TransactionListPageProps {
  onBack: () => void;
  onViewDetail: (id: string) => void;
  getTransactionsUseCase: GetTransactionsUseCase;
}

const RANGE_DAYS = 31;

const getDefaultFilters = (): TransactionFilter => {
  const today = dayjs().tz('Asia/Bangkok');
  return {
    startDate: today.subtract(RANGE_DAYS - 1, 'day').format('YYYY-MM-DD'),
    endDate: today.format('YYYY-MM-DD'),
  };
};

export const TransactionListPage: React.FC<TransactionListPageProps> = ({ onBack, onViewDetail, getTransactionsUseCase }) => {
  const { t } = useTranslation();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<TransactionFilter>(getDefaultFilters);

  const [appliedFilters, setAppliedFilters] = useState<TransactionFilter>(filters);

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    try {
      const apiFilters = { ...appliedFilters };

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
  }, [getTransactionsUseCase, currentPage, pageSize, appliedFilters]);

  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

  const handleFilterChange = (key: keyof TransactionFilter, value: string) => {
    setFilters(prev => {
      const newFilters = { ...prev, [key]: value || undefined };
      if (!value) delete newFilters[key];
      return newFilters;
    });
  };

  const handleSearch = () => {
    setIsLoading(true);
    setAppliedFilters(filters);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setIsLoading(true);
    const defaults = getDefaultFilters();
    setFilters(defaults);
    setAppliedFilters(defaults);
    setCurrentPage(1);
  };

  return (
    <PageContainer>
      <PageHeader
        title={t.transactionList.title}
        onBack={onBack}
      />

      <PageContent>
        <SearchFilterBar>
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

          <SearchButtonWrapper>
            <Button variant="primary" style={{ width: '120px', height: '36px', padding: 0 }} disabled={isLoading} onClick={handleSearch}>
              {t.transactionList.search}
            </Button>
          </SearchButtonWrapper>
          <RightClearFilterButton onClick={clearFilters}>{t.transactionList.clearFilters}</RightClearFilterButton>
        </SearchFilterBar>

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
              textAlign: 'right',
              render: (tx) => <span style={{ fontWeight: 700 }}>{formatAmount(tx.amount, '฿')}</span>
            },
            {
              header: t.transactionList.columnStatus,
              key: 'status',
              textAlign: 'center',
              render: (tx) => (
                <Badge $variant={tx.status.toLowerCase() === 'success' ? 'success' : 'error'}>
                  {tx.status}
                </Badge>
              )
            },
          ]}
          data={transactions}
          onRowClick={(tx) => onViewDetail(tx.id)}
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
