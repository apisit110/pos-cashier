/**
 * Permission key required per route (matches the `scope` claim issued by
 * cashier-authen-service's LoginUseCase, sourced from packages/database's
 * seeded role permissions). A route also matches its sub-paths (e.g.
 * '/products' covers '/products/create', '/products/123/edit').
 * Add new pages here so useAuthGuard can enforce access for them.
 */
export const PAGE_PERMISSIONS: Record<string, string> = {
  '/dashboard': 'dashboard:view',
  '/products': 'products:view',
  '/staff': 'staff:view',
  '/transactions': 'transaction:view',
  '/pos': 'sell:create',
};

export function isPathAllowed(pathname: string, scope: string[] | undefined): boolean {
  if (!scope) return false;

  const matchedKey = Object.keys(PAGE_PERMISSIONS)
    .filter((key) => pathname === key || pathname.startsWith(`${key}/`))
    .sort((a, b) => b.length - a.length)[0];

  if (!matchedKey) return true;

  return scope.includes(PAGE_PERMISSIONS[matchedKey]);
}
