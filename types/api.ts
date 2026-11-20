/**
 * Types & Error Classes for Nirvaha API Client
 */

export type ApiErrorCode =
  | 'VALIDATION_ERROR'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CAPACITY_EXCEEDED'
  | 'DUPLICATE_BOOKING'
  | 'SERVER_ERROR'
  | 'NETWORK_ERROR'
  | 'TIMEOUT_ERROR'
  | 'UNKNOWN_ERROR';

export interface ApiErrorResponse {
  success: false;
  error: string;
  code?: ApiErrorCode | string;
  details?: Record<string, any>;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data?: T;
  [key: string]: any;
}

/**
 * Custom error thrown when backend returns a non-2xx HTTP status.
 * Supports both (status, code, message, details) and (message, status, code, details) signatures.
 */
export class BookingApiError extends Error {
  readonly status: number;
  readonly code: ApiErrorCode | string;
  readonly details?: Record<string, any>;

  constructor(
    arg1: number | string,
    arg2?: ApiErrorCode | string | number,
    arg3?: string,
    arg4?: Record<string, any>
  ) {
    let status: number;
    let code: ApiErrorCode | string;
    let message: string;
    let details: Record<string, any> | undefined;

    if (typeof arg1 === 'number') {
      status = arg1;
      code = (arg2 as ApiErrorCode | string) || 'UNKNOWN_ERROR';
      message = arg3 || `API Error with status ${status}`;
      details = arg4;
    } else {
      message = arg1;
      status = typeof arg2 === 'number' ? arg2 : 500;
      code = typeof arg3 === 'string' ? (arg3 as ApiErrorCode | string) : 'UNKNOWN_ERROR';
      details = arg4;
    }

    super(message);
    this.name = 'BookingApiError';
    this.status = status;
    this.code = code;
    this.details = details;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BookingApiError);
    }
  }

  get isCapacityExceeded(): boolean {
    return this.status === 409 || this.code === 'CAPACITY_EXCEEDED';
  }

  get isDuplicateBooking(): boolean {
    return this.code === 'DUPLICATE_BOOKING';
  }

  get isUnauthorized(): boolean {
    return this.status === 401 || this.code === 'UNAUTHORIZED';
  }

  get isForbidden(): boolean {
    return this.status === 403 || this.code === 'FORBIDDEN';
  }

  get isNotFound(): boolean {
    return this.status === 404 || this.code === 'NOT_FOUND';
  }

  get isValidationError(): boolean {
    return this.status === 400 || this.code === 'VALIDATION_ERROR';
  }

  get isServerError(): boolean {
    return this.status >= 500;
  }
}

/**
 * Thrown when network connection fails (offline, DNS, socket drop).
 */
export class NetworkError extends Error {
  readonly originalError?: unknown;

  constructor(
    message = 'Network connection failed. Please check your internet connection.',
    originalError?: unknown
  ) {
    super(message);
    this.name = 'NetworkError';
    this.originalError = originalError;
  }
}

/**
 * Thrown when an HTTP request exceeds the configured timeout threshold.
 */
export class TimeoutError extends NetworkError {
  constructor(message = 'Request timed out. Please try again.') {
    super(message);
    this.name = 'TimeoutError';
  }
}

/**
 * Thrown locally before calling API when an action requires authentication but currentUser is null.
 */
export class UnauthenticatedError extends Error {
  constructor(message = 'You must be signed in to perform this action.') {
    super(message);
    this.name = 'UnauthenticatedError';
  }
}
