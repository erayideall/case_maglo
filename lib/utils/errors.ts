// Error types
export enum ErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

// Error severity levels
export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

// Custom error class
export class AppError extends Error {
  type: ErrorType;
  severity: ErrorSeverity;
  statusCode?: number;
  details?: unknown;
  timestamp: Date;

  constructor(
    message: string,
    type: ErrorType = ErrorType.UNKNOWN_ERROR,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    statusCode?: number,
    details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.severity = severity;
    this.statusCode = statusCode;
    this.details = details;
    this.timestamp = new Date();

    // Maintains proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}

// Error messages
export const ERROR_MESSAGES = {
  NETWORK: 'Network connection failed. Please check your internet connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  SESSION_EXPIRED: 'Your session has expired. Please login again.',
  SERVER: 'Server error occurred. Please try again later.',
  VALIDATION: 'Please check your input and try again.',
  NOT_FOUND: 'The requested resource was not found.',
  TIMEOUT: 'Request timeout. Please try again.',
  UNKNOWN: 'An unexpected error occurred. Please try again.',
} as const;

// HTTP Status Code to Error Type mapping
export function getErrorTypeFromStatus(statusCode: number): ErrorType {
  if (statusCode === 401) return ErrorType.AUTHENTICATION_ERROR;
  if (statusCode === 403) return ErrorType.AUTHORIZATION_ERROR;
  if (statusCode === 404) return ErrorType.NOT_FOUND;
  if (statusCode === 408) return ErrorType.TIMEOUT_ERROR;
  if (statusCode >= 400 && statusCode < 500) return ErrorType.VALIDATION_ERROR;
  if (statusCode >= 500) return ErrorType.SERVER_ERROR;
  return ErrorType.UNKNOWN_ERROR;
}

// Get error severity from status code
export function getErrorSeverityFromStatus(statusCode: number): ErrorSeverity {
  if (statusCode === 401 || statusCode === 403) return ErrorSeverity.HIGH;
  if (statusCode >= 500) return ErrorSeverity.CRITICAL;
  if (statusCode >= 400 && statusCode < 500) return ErrorSeverity.MEDIUM;
  return ErrorSeverity.LOW;
}

// Get user-friendly error message
export function getUserFriendlyMessage(error: AppError | Error): string {
  if (error instanceof AppError) {
    switch (error.type) {
      case ErrorType.NETWORK_ERROR:
        return ERROR_MESSAGES.NETWORK;
      case ErrorType.AUTHENTICATION_ERROR:
        return ERROR_MESSAGES.SESSION_EXPIRED;
      case ErrorType.AUTHORIZATION_ERROR:
        return ERROR_MESSAGES.UNAUTHORIZED;
      case ErrorType.VALIDATION_ERROR:
        return error.message || ERROR_MESSAGES.VALIDATION;
      case ErrorType.SERVER_ERROR:
        return ERROR_MESSAGES.SERVER;
      case ErrorType.NOT_FOUND:
        return ERROR_MESSAGES.NOT_FOUND;
      case ErrorType.TIMEOUT_ERROR:
        return ERROR_MESSAGES.TIMEOUT;
      default:
        return error.message || ERROR_MESSAGES.UNKNOWN;
    }
  }
  return error.message || ERROR_MESSAGES.UNKNOWN;
}
