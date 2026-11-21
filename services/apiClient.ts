import Constants from 'expo-constants';
import { auth } from '../config/firebase';
import {
  BookingApiError,
  NetworkError,
  TimeoutError,
  UnauthenticatedError,
  ApiErrorCode,
} from '../types/api';

const DEFAULT_BACKEND_URL = 'https://admin-nirvaha.vercel.app';
const DEFAULT_TIMEOUT_MS = 15000;

/**
 * Resolves API Base URL with prioritized fallback:
 * 1. process.env.EXPO_PUBLIC_API_BASE_URL (Metro inlined)
 * 2. Constants.expoConfig?.extra?.EXPO_PUBLIC_API_BASE_URL (Expo config)
 * 3. Default production URL (https://admin-nirvaha.vercel.app)
 */
export function getApiBaseUrl(): string {
  const envUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
  if (typeof envUrl === 'string' && envUrl.trim().length > 0) {
    return sanitizeUrl(envUrl.trim());
  }

  const extra = Constants.expoConfig?.extra as Record<string, any> | undefined;
  const extraUrl = extra?.EXPO_PUBLIC_API_BASE_URL;
  if (typeof extraUrl === 'string' && extraUrl.trim().length > 0) {
    return sanitizeUrl(extraUrl.trim());
  }

  return sanitizeUrl(DEFAULT_BACKEND_URL);
}

function sanitizeUrl(url: string): string {
  let cleaned = url.trim();
  if (!/^https?:\/\//i.test(cleaned)) {
    cleaned = `https://${cleaned}`;
  }
  return cleaned.replace(/\/+$/, '');
}

/**
 * Map HTTP status code to canonical ApiErrorCode
 */
function mapStatusToCode(status: number): ApiErrorCode {
  switch (status) {
    case 400:
      return 'VALIDATION_ERROR';
    case 401:
      return 'UNAUTHORIZED';
    case 403:
      return 'FORBIDDEN';
    case 404:
      return 'NOT_FOUND';
    case 409:
      return 'CAPACITY_EXCEEDED';
    default:
      if (status >= 500) return 'SERVER_ERROR';
      return 'UNKNOWN_ERROR';
  }
}

/**
 * Extracts a sanitized, human-readable error string from various body formats.
 * Guarantees that neither an object nor '[object Object]' is returned.
 */
function extractErrorMessage(body: any, status: number, statusText?: string): string {
  if (body) {
    if (typeof body.error === 'string' && body.error.trim().length > 0 && body.error !== '[object Object]') {
      return body.error.trim();
    }
    if (body.error && typeof body.error.message === 'string' && body.error.message.trim().length > 0) {
      return body.error.message.trim();
    }
    if (typeof body.message === 'string' && body.message.trim().length > 0 && body.message !== '[object Object]') {
      const trimmed = body.message.trim();
      if (trimmed.includes('NOT_FOUND') || trimmed.includes('<!DOCTYPE') || trimmed.includes('<html')) {
        return status === 404
          ? 'The requested booking service endpoint could not be found.'
          : `Server responded with status ${status}. Please try again later.`;
      }
      return trimmed;
    }
    if (body.message && typeof body.message.message === 'string' && body.message.message.trim().length > 0) {
      return body.message.message.trim();
    }
  }

  if (statusText && statusText.trim().length > 0) {
    return statusText.trim();
  }

  switch (status) {
    case 400:
      return 'Invalid booking request. Please check attendee details.';
    case 401:
      return 'Your session has expired. Please sign in again to book.';
    case 403:
      return 'You do not have permission to perform this booking action.';
    case 404:
      return 'The requested event or booking could not be found.';
    case 409:
      return 'Requested seats are no longer available. Please select fewer seats.';
    default:
      if (status >= 500) {
        return 'The booking service is temporarily unavailable. Please try again shortly.';
      }
      return `Request failed with status ${status}`;
  }
}

/**
 * Safely parse HTTP response (JSON or plain text) and extract error or payload.
 */
async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');

  let body: any = null;
  if (isJson) {
    try {
      body = await response.json();
    } catch {
      body = null;
    }
  } else {
    try {
      const text = await response.text();
      body = { message: text };
    } catch {
      body = null;
    }
  }

  if (!response.ok) {
    const status = response.status;
    const message = extractErrorMessage(body, status, response.statusText);
    const code = (typeof body?.code === 'string' ? body.code : null) || mapStatusToCode(status);
    throw new BookingApiError(status, code, message, body?.details);
  }

  if (body && typeof body === 'object' && body.success === false) {
    const message = extractErrorMessage(body, response.status, response.statusText);
    const code = (typeof body.code === 'string' ? body.code : null) || mapStatusToCode(response.status);
    throw new BookingApiError(response.status, code, message, body.details);
  }

  return body as T;
}

/**
 * Fetch wrapper with timeout abort control
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs = DEFAULT_TIMEOUT_MS
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } catch (err: any) {
    if (err.name === 'AbortError') {
      throw new TimeoutError(`Request timed out after ${timeoutMs / 1000}s`);
    }
    throw new NetworkError(err.message || 'Network request failed', err);
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Executes a public HTTP request without auth headers.
 */
export async function publicRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  timeoutMs = DEFAULT_TIMEOUT_MS
): Promise<T> {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetchWithTimeout(url, { ...options, headers }, timeoutMs);
  return parseResponse<T>(response);
}

/**
 * Executes an authenticated HTTP request with automatic Bearer token injection and 401 refresh retry.
 */
export async function authenticatedRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  timeoutMs = DEFAULT_TIMEOUT_MS
): Promise<T> {
  const user = auth.currentUser;
  if (!user) {
    throw new UnauthenticatedError('User must be signed in to perform this action.');
  }

  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  // 1. Acquire current valid token
  let token = await user.getIdToken(false);

  const makeHeaders = (bearer: string) => ({
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${bearer}`,
    ...options.headers,
  });

  let response = await fetchWithTimeout(
    url,
    { ...options, headers: makeHeaders(token) },
    timeoutMs
  );

  // 2. Token refresh & single-retry on 401 Unauthorized
  if (response.status === 401) {
    try {
      token = await user.getIdToken(true); // Force token refresh
      response = await fetchWithTimeout(
        url,
        { ...options, headers: makeHeaders(token) },
        timeoutMs
      );
    } catch {
      throw new BookingApiError(401, 'UNAUTHORIZED', 'Session expired. Please sign in again.');
    }
  }

  return parseResponse<T>(response);
}
