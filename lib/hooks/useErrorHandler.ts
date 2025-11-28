'use client';

import { useCallback } from 'react';
import { toast } from 'react-toastify';
import { AppError, getUserFriendlyMessage, ErrorSeverity } from '../utils/errors';
import { logError } from '../utils/errorLogger';

export interface UseErrorHandlerOptions {
  showToast?: boolean;
  logError?: boolean;
  onError?: (error: Error | AppError) => void;
}

/**
 * Custom hook for handling errors consistently across the app
 */
export function useErrorHandler(options: UseErrorHandlerOptions = {}) {
  const {
    showToast: shouldShowToast = true,
    logError: shouldLogError = true,
    onError,
  } = options;

  const handleError = useCallback(
    (error: Error | AppError, context?: Record<string, unknown>) => {
      // Log the error if enabled
      if (shouldLogError) {
        logError(error, context);
      }

      // Show toast notification if enabled
      if (shouldShowToast) {
        const message = getUserFriendlyMessage(error);

        // Use different toast types based on severity
        if (error instanceof AppError) {
          switch (error.severity) {
            case ErrorSeverity.CRITICAL:
            case ErrorSeverity.HIGH:
              toast.error(message, { autoClose: 5000 });
              break;
            case ErrorSeverity.MEDIUM:
              toast.warning(message, { autoClose: 4000 });
              break;
            case ErrorSeverity.LOW:
              toast.info(message, { autoClose: 3000 });
              break;
          }
        } else {
          toast.error(message);
        }
      }

      // Call custom error handler if provided
      onError?.(error);
    },
    [shouldShowToast, shouldLogError, onError]
  );

  /**
   * Wrap async functions to handle errors automatically
   */
  const wrapAsync = useCallback(
    <T extends (...args: any[]) => Promise<any>>(fn: T) => {
      return async (...args: Parameters<T>): Promise<ReturnType<T> | undefined> => {
        try {
          return await fn(...args);
        } catch (error) {
          handleError(error as Error);
          return undefined;
        }
      };
    },
    [handleError]
  );

  /**
   * Safe async executor - executes async function and handles errors
   */
  const safeAsync = useCallback(
    async <T>(
      fn: () => Promise<T>,
      fallback?: T
    ): Promise<T | undefined> => {
      try {
        return await fn();
      } catch (error) {
        handleError(error as Error);
        return fallback;
      }
    },
    [handleError]
  );

  return {
    handleError,
    wrapAsync,
    safeAsync,
  };
}

export default useErrorHandler;
