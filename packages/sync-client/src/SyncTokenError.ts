/**
 * pos-sync-service rejected the token request: 401 = wrong merchant credential, 429 = too many failed attempts.
 * Retrying before `retryAt` cannot succeed, so callers should postpone the work (not count it as a failed attempt).
 */
export class SyncTokenError extends Error {
  constructor(
    public readonly status: number,
    /** epoch ms, the client does not request a token again before this */
    public readonly retryAt: number,
  ) {
    super(status === 429 ? 'Too many sync token requests' : 'Invalid sync credential');
    this.name = 'SyncTokenError';
  }
}

// checks the name too, instanceof fails when two copies of this package are loaded
export const isSyncTokenError = (error: unknown): error is SyncTokenError =>
  error instanceof SyncTokenError || (error instanceof Error && error.name === 'SyncTokenError');
