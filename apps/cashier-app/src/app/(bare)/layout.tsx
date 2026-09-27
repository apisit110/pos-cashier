'use client';

import { useAuthGuard } from '../../presentation/auth/useAuthGuard';
import { BareLayout } from '../../presentation/layouts/BareLayout';

export default function BareAreaLayout({ children }: { children: React.ReactNode }) {
  const { allowed } = useAuthGuard();

  if (!allowed) {
    return null;
  }

  return <BareLayout>{children}</BareLayout>;
}
