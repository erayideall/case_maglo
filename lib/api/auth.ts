import apiClient from './client';

// API response types
export interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  isActive: boolean;
  lastLoginAt: string;
  lastLoginIP: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
  };
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    fullName: string;
    email: string;
  };
}

export interface RefreshTokenResponse {
  accessToken: string;
}

export interface ProfileResponse {
  id: string;
  fullName: string;
  email: string;
  role: string;
  isActive: boolean;
  lastLoginAt: string;
  lastLoginIP: string;
  createdAt: string;
  updatedAt: string;
}

// Login function
export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>(
    '/users/login',
    {
      email,
      password,
    },
    {
      showToast: true,
    }
  );
  return response.data;
};

// Register function
export const register = async (
  fullName: string,
  email: string,
  password: string
): Promise<RegisterResponse> => {
  const response = await apiClient.post<RegisterResponse>(
    '/users/register',
    {
      fullName,
      email,
      password,
    },
    {
      showToast: true,
    }
  );
  return response.data;
};

// Logout function
export const logout = async (): Promise<void> => {
  await apiClient.post('/users/logout', {}, { showToast: true });
};

// Refresh token function
export const refreshToken = async (): Promise<RefreshTokenResponse> => {
  const response = await apiClient.post<RefreshTokenResponse>('/users/refresh-token');
  return response.data;
};

// Profile function
export const getProfile = async (): Promise<ProfileResponse> => {
  const response = await apiClient.get<ProfileResponse>('/users/profile/');
  return response.data;
};
