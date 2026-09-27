/**
 * Reads the space-delimited `scope` claim out of a JWT's payload, without
 * verifying the signature (verification is the backend's job — this is
 * only used client-side to decide which pages/nav items to show).
 */
export function decodeJwtScopes(token: string | undefined): string[] {
  if (!token) return [];

  try {
    const payloadSegment = token.split('.')[1];
    const base64 = payloadSegment.replace(/-/g, '+').replace(/_/g, '/');
    const json = atob(base64);
    const payload = JSON.parse(json) as { scope?: string };
    return payload.scope ? payload.scope.split(' ').filter(Boolean) : [];
  } catch {
    return [];
  }
}
