import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

type ApiResponse<T> = {
  data?: T;
  error?: string | { [key: string]: string };
  message?: string;
  status: number;
};

export function createApiResponse<T>(options: ApiResponse<T>) {
  const { data, error, message, status } = options;
  
  const responseBody: any = {};
  
  if (data) responseBody.data = data;
  if (error) responseBody.error = error;
  if (message) responseBody.message = message;
  
  return NextResponse.json(responseBody, { status });
}

export function handleApiError(error: unknown) {
  console.error('API Error:', error);
  
  if (error instanceof ZodError) {
    const formattedErrors = error.errors.reduce((acc, curr) => {
      const key = curr.path.join('.');
      acc[key] = curr.message;
      return acc;
    }, {} as Record<string, string>);
    
    return createApiResponse({
      error: formattedErrors,
      message: 'Validation failed',
      status: 400
    });
  }
  
  if (error instanceof Error) {
    return createApiResponse({
      error: error.message,
      status: 500
    });
  }
  
  return createApiResponse({
    error: 'An unexpected error occurred',
    status: 500
  });
}
