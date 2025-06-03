import { z } from 'zod';
import { NextResponse } from 'next/server';
import { createLogger } from './logger';

const logger = createLogger('api');

/**
 * API response statuses
 */
export type ApiStatus = 'success' | 'error';

/**
 * Standard API response envelope
 */
export interface ApiResponse<T = unknown> {
  status: ApiStatus;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    version: string;
    timestamp: string;
  };
}

/**
 * API Error class with standardized structure
 */
export class ApiError extends Error {
  code: string;
  details?: unknown;
  status: number;

  constructor(message: string, code: string, status = 500, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

/**
 * Configuration for API requests
 */
export interface ApiRequestConfig extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
  requiresAuth?: boolean;
  version?: string;
}

/**
 * API Client for making standardized requests
 */
export class ApiClient {
  private baseUrl: string;
  private defaultVersion: string;

  constructor(baseUrl: string = '/api', defaultVersion: string = 'v1') {
    this.baseUrl = baseUrl;
    this.defaultVersion = defaultVersion;
  }

  /**
   * Make a GET request
   */
  async get<T>(path: string, config?: ApiRequestConfig): Promise<T> {
    return this.request<T>(path, { ...config, method: 'GET' });
  }

  /**
   * Make a POST request
   */
  async post<T>(path: string, data?: unknown, config?: ApiRequestConfig): Promise<T> {
    return this.request<T>(path, {
      ...config,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * Make a PUT request
   */
  async put<T>(path: string, data?: unknown, config?: ApiRequestConfig): Promise<T> {
    return this.request<T>(path, {
      ...config,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * Make a DELETE request
   */
  async delete<T>(path: string, config?: ApiRequestConfig): Promise<T> {
    return this.request<T>(path, { ...config, method: 'DELETE' });
  }

  /**
   * Base request method
   */
  private async request<T>(path: string, config?: ApiRequestConfig): Promise<T> {
    const {
      params,
      requiresAuth = false,
      version = this.defaultVersion,
      ...fetchConfig
    } = config || {};

    // Build URL with path and query parameters
    let url = `${this.baseUrl}/${version}${path.startsWith('/') ? path : `/${path}`}`;
    
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    // Default headers
    const headers = new Headers(fetchConfig.headers);
    if (!headers.has('Content-Type') && (fetchConfig.method === 'POST' || fetchConfig.method === 'PUT')) {
      headers.append('Content-Type', 'application/json');
    }

    // Add auth headers if needed
    if (requiresAuth) {
      // Add authorization header logic here
      // headers.append('Authorization', `Bearer ${getAccessToken()}`);
    }

    try {
      const response = await fetch(url, {
        ...fetchConfig,
        headers,
      });

      // Handle HTTP errors
      if (!response.ok) {
        let errorData: any;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = { message: 'Unknown error occurred' };
        }

        throw new ApiError(
          errorData.message || `API request failed with status ${response.status}`,
          errorData.code || 'api_error',
          response.status,
          errorData.details
        );
      }

      // Parse JSON response
      const responseData = await response.json() as ApiResponse<T>;
      
      // Handle application-level errors
      if (responseData.status === 'error') {
        throw new ApiError(
          responseData.error?.message || 'Unknown API error',
          responseData.error?.code || 'api_error',
          500,
          responseData.error?.details
        );
      }

      return responseData.data as T;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError(
        error instanceof Error ? error.message : 'Unknown error occurred',
        'network_error',
        0
      );
    }
  }
}

// Create and export default API client instance
export const apiClient = new ApiClient();

/**
 * Utility function to create a Zod validator with API response envelope
 */
export function createApiResponseSchema<T extends z.ZodTypeAny>(schema: T) {
  return z.object({
    status: z.enum(['success', 'error']),
    data: schema.optional(),
    error: z.object({
      code: z.string(),
      message: z.string(),
      details: z.unknown().optional(),
    }).optional(),
    meta: z.object({
      version: z.string(),
      timestamp: z.string(),
    }).optional(),
  });
}

/**
 * Helper for client-side API requests
 */
export async function fetchApi<T>(
  url: string, 
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      logger.error('API Request Failed', {
        url,
        status: response.status,
        data,
      });
      
      throw new ApiError(
        data.error?.message || 'Request failed',
        data.error?.code || 'request_failed',
        response.status
      );
    }
    
    return data;
  } catch (error) {
    logger.error('API Request Error', {
      url,
      error,
    });
    
    if (error instanceof ApiError) {
      throw error;
    }
    
    throw new ApiError(
      error instanceof Error ? error.message : 'Failed to fetch data',
      'fetch_error',
      500
    );
  }
}

/**
 * Helper function to wrap API handlers with standard response format
 */
export function withApiResponse<T>(handler: () => Promise<T>) {
  return async () => {
    try {
      const data = await handler();
      return {
        status: 'success' as const,
        data,
        meta: {
          version: '1.0',
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      console.error('API Error:', error);
      
      if (error instanceof ApiError) {
        return {
          status: 'error' as const,
          error: {
            code: error.code,
            message: error.message,
            details: error.details,
          },
          meta: {
            version: '1.0',
            timestamp: new Date().toISOString(),
          },
        };
      }
      
      return {
        status: 'error' as const,
        error: {
          code: 'internal_server_error',
          message: error instanceof Error ? error.message : 'An unexpected error occurred',
        },
        meta: {
          version: '1.0',
          timestamp: new Date().toISOString(),
        },
      };
    }
  };
}
