'use client';

import { useRouter } from 'next/navigation';
import { TransactionListPage } from '../../../presentation/pages/transaction-list/TransactionListPage';
import { getTransactionsUseCase } from '../../../presentation/di/container';

export default function TransactionList() {
  const router = useRouter();

  return (
    <TransactionListPage
      onBack={() => router.push('/dashboard')}
      onViewDetail={(id) => router.push(`/transactions/${id}`)}
      getTransactionsUseCase={getTransactionsUseCase}
    />
  );
}
