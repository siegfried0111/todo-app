/**
 * Axios instance configuration for API communication.
 *
 * This module provides a configured Axios instance with:
 * - Base URL from environment variables
 * - Request/response interceptors for error handling
 * - Automatic JSON transformation
 * - Timeout configuration
 */

import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

/**
 * Base API URL from environment variable.
 * Defaults to localhost:8000 for development.
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Configured Axios instance for making API requests.
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor for adding authentication tokens or logging.
 * Currently just logs requests in development mode.
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Log requests in development
    if (import.meta.env.DEV) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    }

    // Future: Add authentication token here
    // const token = localStorage.getItem('auth_token');
    // if (token && config.headers) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }

    return config;
  },
  (error: AxiosError) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

/**
 * Response interceptor for global error handling.
 * Handles common HTTP errors and transforms them into user-friendly messages.
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log successful responses in development
    if (import.meta.env.DEV) {
      console.log(`[API Response] ${response.status} ${response.config.url}`);
    }
    return response;
  },
  (error: AxiosError) => {
    // Handle different error types
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const data = error.response.data as { detail?: string | unknown[] };

      console.error(
        `[API Error] ${status} ${error.config?.url}`,
        data
      );

      // Transform error based on status code
      switch (status) {
        case 400:
          error.message = 'Bad request. Please check your input.';
          break;
        case 401:
          error.message = 'Unauthorized. Please log in again.';
          // Future: Redirect to login page
          break;
        case 403:
          error.message = 'Forbidden. You do not have permission to perform this action.';
          break;
        case 404:
          error.message = typeof data.detail === 'string'
            ? data.detail
            : 'Resource not found.';
          break;
        case 422:
          // Validation error - extract first error message
          if (Array.isArray(data.detail) && data.detail.length > 0) {
            const firstError = data.detail[0] as { msg?: string };
            error.message = firstError.msg || 'Validation error occurred.';
          } else {
            error.message = 'Validation error. Please check your input.';
          }
          break;
        case 500:
          error.message = 'Internal server error. Please try again later.';
          break;
        case 503:
          error.message = 'Service unavailable. Please try again later.';
          break;
        default:
          error.message = `An error occurred: ${status}`;
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('[API Error] No response received', error.request);
      error.message = 'No response from server. Please check your connection.';
    } else {
      // Error setting up request
      console.error('[API Error] Request setup failed', error.message);
      error.message = 'Failed to send request. Please try again.';
    }

    return Promise.reject(error);
  }
);

/**
 * Helper function to extract error message from Axios error.
 *
 * @param error - The error object (Axios or generic)
 * @returns User-friendly error message
 */
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
}
