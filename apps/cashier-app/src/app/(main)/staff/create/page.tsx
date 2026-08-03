'use client';

import { useRouter } from 'next/navigation';
import { CreateStaffPage } from '../../../../presentation/pages/create-staff/CreateStaffPage';
import { createStaffUseCase } from '../../../../presentation/di/container';

export default function StaffCreate() {
  const router = useRouter();

  return (
    <CreateStaffPage
      onBack={() => router.push('/staff')}
      createStaffUseCase={createStaffUseCase}
    />
  );
}
