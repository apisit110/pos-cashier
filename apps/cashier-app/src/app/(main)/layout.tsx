'use client';

import { useAuthGuard } from '../../presentation/auth/useAuthGuard';
import { MainLayout } from '../../presentation/layouts/MainLayout';

export default function ManagerAreaLayout({ children }: { children: React.ReactNode }) {
  const { allowed } = useAuthGuard();

  if (!allowed) {
    return null;
  }

  return <MainLayout>{children}</MainLayout>;
}
