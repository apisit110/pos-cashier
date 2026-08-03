'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, homeRouteFor } from '../presentation/auth/AuthContext';

export default function RootPage() {
  const { staff } = useAuth();
  const router = useRouter();

  useEffect(() => {
    router.replace(staff ? homeRouteFor(staff.roleId) : '/login');
  }, [staff, router]);

  return null;
}
