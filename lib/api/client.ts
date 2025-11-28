import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'react-toastify';
import {
  AppError,
  ErrorType,
  getErrorTypeFromStatus,
  getErrorSeverityFromStatus,
  getUserFriendlyMessage
} from '../utils/errors';
import { logAPIError } from '../utils/errorLogger';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

// Custom config type for toast control
declare module 'axios' {
  export interface AxiosRequestConfig {
    showToast?: boolean;
  }
}

// Create Axios instance
export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // For cookies
});

// Request interceptor - Add token to every request
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Token refresh and error management
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => {
    // Show success message only for requests with showToast: true
    if (response.config.showToast && response.data?.success && response.data?.message) {
      toast.success(response.data.message);
    }
    return response;
  },
  async (error: AxiosError<{ message?: string; success?: boolean }>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Create AppError instance
    let appError: AppError;

    if (error.response) {
      // Server responded with error
      const statusCode = error.response.status;
      const errorType = getErrorTypeFromStatus(statusCode);
      const errorSeverity = getErrorSeverityFromStatus(statusCode);
      const errorMessage = error.response.data?.message || error.message;

      appError = new AppError(
        errorMessage,
        errorType,
        errorSeverity,
        statusCode,
        error.response.data
      );
    } else if (error.request) {
      // Request made but no response received (network error)
      appError = new AppError(
        'Network connection failed',
        ErrorType.NETWORK_ERROR,
        getErrorSeverityFromStatus(0),
        0,
        { originalError: error.message }
      );
    } else {
      // Something else happened
      appError = new AppError(
        error.message,
        ErrorType.UNKNOWN_ERROR,
        getErrorSeverityFromStatus(0)
      );
    }

    // Log the error
    logAPIError(
      appError,
      originalRequest.url || 'unknown',
      originalRequest.method?.toUpperCase() || 'unknown',
      appError.statusCode
    );

    // Show error message only for requests with showToast: true
    if (originalRequest.showToast) {
      const userMessage = getUserFriendlyMessage(appError);
      toast.error(userMessage);
    }

    // 401 error and token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.post(
          `${BASE_URL}/users/refresh-token`,
          {},
          { withCredentials: true }
        );

        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);

        processQueue(null, accessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as AxiosError, null);

        // Token could not be refreshed, perform logout
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');

        // Redirect to login page
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Return the AppError instance instead of raw axios error
    return Promise.reject(appError);
  }
);

// API Response Types
export interface WalletCard {
  id: string;
  name: string;
  type: string;
  cardNumber: string;
  bank: string;
  network: string;
  expiryMonth: number;
  expiryYear: number;
  color: string;
  isDefault: boolean;
}

export interface WalletResponse {
  success: boolean;
  message: string;
  data: {
    cards: WalletCard[];
  };
}

export interface FinancialSummaryResponse {
  success: boolean;
  message: string;
  data: {
    totalBalance: {
      amount: number;
      currency: string;
      change: {
        percentage: number;
        trend: 'up' | 'down';
      };
    };
    totalExpense: {
      amount: number;
      currency: string;
      change: {
        percentage: number;
        trend: 'up' | 'down';
      };
    };
    totalSavings: {
      amount: number;
      currency: string;
      change: {
        percentage: number;
        trend: 'up' | 'down';
      };
    };
    lastUpdated: string;
  };
}

// API Functions
export const walletAPI = {
  getWallet: async (): Promise<WalletResponse> => {
    const response = await apiClient.get<WalletResponse>('/financial/wallet');
    return response.data;
  },
};

export interface Transaction {
  id: string;
  name: string;
  business: string;
  image: string;
  type: string;
  amount: number;
  currency: string;
  date: string;
  status: string;
}

export interface RecentTransactionsResponse {
  success: boolean;
  message: string;
  data: {
    transactions: Transaction[];
    summary: {
      totalIncome: number;
      totalExpense: number;
      count: number;
    };
  };
}

export interface ScheduledTransfer {
  id: string;
  name: string;
  image: string;
  date: string;
  amount: number;
  currency: string;
  status: string;
}

export interface ScheduledTransfersResponse {
  success: boolean;
  message: string;
  data: {
    transfers: ScheduledTransfer[];
    summary: {
      totalScheduledAmount: number;
      count: number;
    };
  };
}

export interface WorkingCapitalData {
  month: string;
  income: number;
  expense: number;
  net: number;
}

export interface WorkingCapitalResponse {
  success: boolean;
  message: string;
  data: {
    period: string;
    currency: string;
    data: WorkingCapitalData[];
    summary: {
      totalIncome: number;
      totalExpense: number;
      netBalance: number;
    };
  };
}

export const financialAPI = {
  getSummary: async (): Promise<FinancialSummaryResponse> => {
    const response = await apiClient.get<FinancialSummaryResponse>('/financial/summary');
    return response.data;
  },
  getRecentTransactions: async (limit?: number): Promise<RecentTransactionsResponse> => {
    const params = limit ? { limit } : {};
    const response = await apiClient.get<RecentTransactionsResponse>('/financial/transactions/recent', { params });
    return response.data;
  },
  getScheduledTransfers: async (limit?: number): Promise<ScheduledTransfersResponse> => {
    const params = limit ? { limit } : {};
    const response = await apiClient.get<ScheduledTransfersResponse>('/financial/transfers/scheduled', { params });
    return response.data;
  },
  getWorkingCapital: async (period?: string): Promise<WorkingCapitalResponse> => {
    const params = period ? { period } : {};
    const response = await apiClient.get<WorkingCapitalResponse>('/financial/working-capital', { params });
    return response.data;
  },
};

export default apiClient;
