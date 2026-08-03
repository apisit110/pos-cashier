'use client';

import { useRouter } from 'next/navigation';
import { CreateOrderPage } from '../../../presentation/pages/create-order/CreateOrderPage';
import { useAuth } from '../../../presentation/auth/AuthContext';

export default function Pos() {
  const { staff, logout } = useAuth();
  const router = useRouter();

  return (
    <CreateOrderPage
      onBack={staff?.role === 'manager' ? () => router.push('/dashboard') : undefined}
      onLogout={logout}
      staff={staff}
    />
  );
}
