'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { homeRouteFor, useAuth } from './AuthContext';
import { isPathAllowed } from './pageAccess';

/**
 * Redirects to /login when no staff is signed in, or to the staff's
 * home route when the current path is not allowed for their role.
 * Returns `allowed: true` only once both checks pass, so callers can
 * hold off rendering the page until then.
 */
export function useAuthGuard() {
  const { staff } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const allowed = isPathAllowed(pathname, staff?.scope);

  useEffect(() => {
    if (!staff) {
      router.replace('/login');
    } else if (!allowed) {
      router.replace(homeRouteFor(staff.roleId));
    }
  }, [staff, allowed, router]);

  return { staff, allowed: Boolean(staff) && allowed };
}
