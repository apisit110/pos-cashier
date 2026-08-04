'use client';

import { useRouter } from 'next/navigation';
import { StaffListPage } from '../../../presentation/pages/staff-list/StaffListPage';
import { getStaffsUseCase, syncStaffUseCase } from '../../../presentation/di/container';

export default function StaffList() {
  const router = useRouter();

  return (
    <StaffListPage
      onBack={() => router.push('/dashboard')}
      onNavigateToCreateStaff={() => router.push('/staff/create')}
      getStaffsUseCase={getStaffsUseCase}
      syncStaffUseCase={syncStaffUseCase}
    />
  );
}
