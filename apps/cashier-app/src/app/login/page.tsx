'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoginPage } from '../../presentation/pages/login/LoginPage';
import { useAuth, homeRouteFor } from '../../presentation/auth/AuthContext';

export default function Login() {
  const { staff, login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (staff) {
      router.replace(homeRouteFor(staff.roleId));
    }
  }, [staff, router]);

  if (staff) {
    return null;
  }

  return <LoginPage onLoginSuccess={login} />;
}
