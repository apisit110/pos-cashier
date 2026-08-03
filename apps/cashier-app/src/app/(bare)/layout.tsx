'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../presentation/auth/AuthContext';
import { BareLayout } from '../../presentation/layouts/BareLayout';

export default function BareAreaLayout({ children }: { children: React.ReactNode }) {
  const { staff } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!staff) {
      router.replace('/login');
    }
  }, [staff, router]);

  if (!staff) {
    return null;
  }

  return <BareLayout>{children}</BareLayout>;
}
