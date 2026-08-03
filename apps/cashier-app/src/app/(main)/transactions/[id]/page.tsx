'use client';

import { useParams, useRouter } from 'next/navigation';
import { TransactionDetailPage } from '../../../../presentation/pages/transaction-detail/TransactionDetailPage';
import { getTransactionByIdUseCase } from '../../../../presentation/di/container';

export default function TransactionDetail() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  return (
    <TransactionDetailPage
      transactionId={params.id}
      onBack={() => router.push('/transactions')}
      getTransactionByIdUseCase={getTransactionByIdUseCase}
    />
  );
}
