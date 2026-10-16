import { getApiBaseUrl } from '@/shared/config';
import { ApiError, type ApiErrorBody } from './types';

function joinUrl(base: string, path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${base.replace(/\/$/, '')}${normalizedPath}`;
}

function isApiErrorBody(data: unknown): data is ApiErrorBody {
  return (
    typeof data === 'object' &&
    data !== null &&
    'code' in data &&
    'message' in data &&
    typeof data.code === 'string' &&
    typeof data.message === 'string'
  );
}

/** Reads an `{ code, message }` error body from raw response text; anything else becomes a generic `HTTP_ERROR`. */
export function parseErrorText(text: string, statusText: string): ApiErrorBody {
  try {
    const data: unknown = JSON.parse(text);
    if (isApiErrorBody(data)) {
      return data;
    }
  } catch {
    // fall through to the generic body
  }
  return { code: 'HTTP_ERROR', message: statusText || 'Request failed' };
}

/** Absolute API URL for a path such as `/admin/products`. */
export function buildApiUrl(path: string): string {
  return joinUrl(getApiBaseUrl(), path);
}

async function parseErrorBody(response: Response): Promise<ApiErrorBody> {
  return parseErrorText(await response.text().catch(() => ''), response.statusText);
}

/** Typed fetch wrapper. Errors become `ApiError` with the API `code`. */
export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body !== undefined && !(init.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  let response: Response;
  try {
    response = await fetch(buildApiUrl(path), { ...init, credentials: 'include', headers });
  } catch {
    throw new ApiError(0, { code: 'NETWORK_ERROR', message: 'Network error' });
  }
  if (!response.ok) {
    throw new ApiError(response.status, await parseErrorBody(response));
  }
  if (response.status === 204) {
    return undefined as T;
  }
  const text = await response.text();
  if (!text) {
    return undefined as T;
  }
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new ApiError(response.status, { code: 'HTTP_ERROR', message: 'Invalid response body' });
  }
}
