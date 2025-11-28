import { AppError, ErrorSeverity, ErrorType } from './errors';

interface ErrorLogData {
  message: string;
  type?: ErrorType;
  severity?: ErrorSeverity;
  statusCode?: number;
  url?: string;
  method?: string;
  timestamp: Date;
  userAgent?: string;
  userId?: string;
  componentStack?: string;
  errorStack?: string;
  additionalData?: Record<string, unknown>;
}

// Error log storage (in production, this should send to a logging service)
const errorLogs: ErrorLogData[] = [];

/**
 * Log error to console and storage
 */
export function logError(
  error: Error | AppError,
  additionalData?: Record<string, unknown>
): void {
  const errorData: ErrorLogData = {
    message: error.message,
    timestamp: new Date(),
    errorStack: error.stack,
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
    ...additionalData,
  };

  // If it's an AppError, add more details
  if (error instanceof AppError) {
    errorData.type = error.type;
    errorData.severity = error.severity;
    errorData.statusCode = error.statusCode;
    errorData.additionalData = error.details as Record<string, unknown>;
  }

  // Store in memory (in production, send to logging service like Sentry, LogRocket, etc.)
  errorLogs.push(errorData);

  // Console logging based on severity
  if (process.env.NODE_ENV === 'development') {
    const severity = errorData.severity || ErrorSeverity.MEDIUM;

    switch (severity) {
      case ErrorSeverity.CRITICAL:
      case ErrorSeverity.HIGH:
        console.error('🔴 [ERROR]', errorData);
        break;
      case ErrorSeverity.MEDIUM:
        console.warn('🟡 [WARNING]', errorData);
        break;
      case ErrorSeverity.LOW:
        console.info('🔵 [INFO]', errorData);
        break;
    }
  }

  // In production, send to external logging service
  if (process.env.NODE_ENV === 'production') {
    sendToLoggingService(errorData);
  }
}

/**
 * Log API error
 */
export function logAPIError(
  error: Error | AppError,
  url: string,
  method: string,
  statusCode?: number
): void {
  logError(error, {
    url,
    method,
    statusCode,
    type: 'API_ERROR',
  });
}

/**
 * Get all error logs
 */
export function getErrorLogs(): ErrorLogData[] {
  return [...errorLogs];
}

/**
 * Clear error logs
 */
export function clearErrorLogs(): void {
  errorLogs.length = 0;
}

/**
 * Send error to external logging service
 * In production, integrate with services like:
 * - Sentry
 * - LogRocket
 * - Datadog
 * - New Relic
 */
function sendToLoggingService(errorData: ErrorLogData): void {
  // Example: Send to your backend logging endpoint
  if (typeof window !== 'undefined') {
    try {
      fetch('/api/logs/error', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorData),
      }).catch((err) => {
        // Silently fail - don't want logging errors to break the app
        console.error('Failed to send error log:', err);
      });
    } catch (err) {
      // Silently fail
      console.error('Failed to send error log:', err);
    }
  }
}

/**
 * Get error statistics
 */
export function getErrorStats(): {
  total: number;
  bySeverity: Record<ErrorSeverity, number>;
  byType: Record<ErrorType, number>;
} {
  const stats = {
    total: errorLogs.length,
    bySeverity: {
      [ErrorSeverity.LOW]: 0,
      [ErrorSeverity.MEDIUM]: 0,
      [ErrorSeverity.HIGH]: 0,
      [ErrorSeverity.CRITICAL]: 0,
    },
    byType: {
      [ErrorType.NETWORK_ERROR]: 0,
      [ErrorType.AUTHENTICATION_ERROR]: 0,
      [ErrorType.AUTHORIZATION_ERROR]: 0,
      [ErrorType.VALIDATION_ERROR]: 0,
      [ErrorType.SERVER_ERROR]: 0,
      [ErrorType.NOT_FOUND]: 0,
      [ErrorType.TIMEOUT_ERROR]: 0,
      [ErrorType.UNKNOWN_ERROR]: 0,
    },
  };

  errorLogs.forEach((log) => {
    if (log.severity) {
      stats.bySeverity[log.severity]++;
    }
    if (log.type) {
      stats.byType[log.type]++;
    }
  });

  return stats;
}

export default logError;
