'use client';

import { DashboardPage } from '../../../presentation/pages/dashboard/DashboardPage';
import { useAuth } from '../../../presentation/auth/AuthContext';
import { getTransactionSummaryUseCase } from '../../../presentation/di/container';

export default function Dashboard() {
  const { staff } = useAuth();

  return <DashboardPage staff={staff} getTransactionSummaryUseCase={getTransactionSummaryUseCase} />;
}
