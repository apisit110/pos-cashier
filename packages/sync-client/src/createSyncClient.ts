import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { SyncClientConfig } from './SyncClientConfig';

// renew the token a bit before it expires so an in-flight request does not get 401
const TOKEN_EXPIRY_MARGIN_MS = 60 * 1000;

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
 */
export function createSyncClient(config: SyncClientConfig): AxiosInstance {
  let accessToken: string | null = null;
  let expiresAt = 0;
  let pendingToken: Promise<string> | null = null;

  const requestToken = async (): Promise<string> => {
    const response = await axios.post<TokenResponse>(
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

    accessToken = response.data.access_token;
    expiresAt = Date.now() + response.data.expires_in * 1000 - TOKEN_EXPIRY_MARGIN_MS;
    return accessToken;
  };

  const getToken = async (): Promise<string> => {
    if (accessToken && Date.now() < expiresAt) return accessToken;
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
