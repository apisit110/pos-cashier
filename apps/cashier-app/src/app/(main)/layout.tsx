'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../presentation/auth/AuthContext';
import { MainLayout } from '../../presentation/layouts/MainLayout';

export default function ManagerAreaLayout({ children }: { children: React.ReactNode }) {
  const { staff } = useAuth();
  const router = useRouter();
  const isManager = staff?.role === 'manager';

  useEffect(() => {
    if (!staff) {
      router.replace('/login');
    } else if (!isManager) {
      router.replace('/pos');
    }
  }, [staff, isManager, router]);

  if (!isManager) {
    return null;
  }

  return <MainLayout>{children}</MainLayout>;
}
