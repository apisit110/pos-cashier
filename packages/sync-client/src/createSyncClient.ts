import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { SyncClientConfig } from './SyncClientConfig';
import { SyncTokenError } from './SyncTokenError';

// renew the token a bit before it expires so an in-flight request does not get 401
const TOKEN_EXPIRY_MARGIN_MS = 60 * 1000;
// after a rejected token request, wait 30s, 1m, 2m ... up to 10m before requesting again
const TOKEN_BACKOFF_BASE_MS = 30 * 1000;
const TOKEN_BACKOFF_MAX_MS = 10 * 60 * 1000;

// +-20% so terminals sharing a wrong credential do not retry at the same moment
const withJitter = (ms: number) => Math.round(ms * (0.8 + Math.random() * 0.4));

const retryAfterMs = (error: AxiosError): number | null => {
  const seconds = Number(error.response?.headers?.['retry-after']);
  return Number.isFinite(seconds) && seconds > 0 ? seconds * 1000 : null;
};

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retried?: boolean;
}

/**
 * Creates an axios instance for pos-sync-service (`/api/v1/sync`).
 * Requests a token with the merchant credential, keeps it in memory, sends it as `Authorization: Bearer`
 * and on 401 requests a new token and retries once.
 * A rejected token request (401 / 429) throws SyncTokenError and every request fails fast with it
 * until the backoff ends, so a wrong credential does not send one token request per sync request.
 */
export function createSyncClient(config: SyncClientConfig): AxiosInstance {
  let accessToken: string | null = null;
  let expiresAt = 0;
  let pendingToken: Promise<string> | null = null;
  let tokenError: SyncTokenError | null = null;
  let rejectedCount = 0;

  const requestToken = async (): Promise<string> => {
    let response;
    try {
      response = await axios.post<TokenResponse>(
        `${config.baseUrl}/api/v1/sync/auth/token`,
        { tid: config.tid },
        {
          timeout: 10000,
          headers: {
            'Content-Type': 'application/json',
            'x-partner-id': config.partnerId,
            'x-client-id': config.clientId,
            'x-client-secret': config.clientSecret,
          },
        },
      );
    } catch (error) {
      const status = axios.isAxiosError(error) ? error.response?.status : undefined;
      if (status !== 401 && status !== 429) throw error;

      const backoffMs = Math.min(TOKEN_BACKOFF_BASE_MS * 2 ** rejectedCount, TOKEN_BACKOFF_MAX_MS);
      const waitMs = retryAfterMs(error as AxiosError) ?? withJitter(backoffMs);
      rejectedCount++;
      tokenError = new SyncTokenError(status, Date.now() + waitMs);
      console.error(
        `[sync-client] Token request rejected (${status}) for partner ${config.partnerId}, terminal ${config.tid}; ` +
          `not requesting a token again for ${Math.round(waitMs / 1000)}s`,
      );
      throw tokenError;
    }

    tokenError = null;
    rejectedCount = 0;
    accessToken = response.data.access_token;
    expiresAt = Date.now() + response.data.expires_in * 1000 - TOKEN_EXPIRY_MARGIN_MS;
    return accessToken;
  };

  const getToken = async (): Promise<string> => {
    if (accessToken && Date.now() < expiresAt) return accessToken;
    if (tokenError && Date.now() < tokenError.retryAt) throw tokenError;
    pendingToken ??= requestToken().finally(() => {
      pendingToken = null;
    });
    return pendingToken;
  };

  const client = axios.create({
    baseURL: `${config.baseUrl}/api/v1/sync`,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  client.interceptors.request.use(async (request) => {
    request.headers.Authorization = `Bearer ${await getToken()}`;
    return request;
  });

  client.interceptors.response.use(undefined, async (error: AxiosError) => {
    const request = error.config as RetryableRequestConfig | undefined;
    // a 401 from the token request itself means a wrong credential, retrying it would loop forever
    const isTokenRequest = request?.url?.endsWith('/auth/token');
    if (error.response?.status !== 401 || !request || request._retried || isTokenRequest) {
      throw error;
    }

    request._retried = true;
    accessToken = null;
    return client.request(request);
  });

  return client;
}
