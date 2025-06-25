// Centralized Error Handling System
export interface ApiError {
  code: string;
  message: string;
  details?: any;
  statusCode?: number;
}

export class AppError extends Error {
  code: string;
  statusCode: number;
  details?: any;

  constructor(code: string, message: string, statusCode: number = 500, details?: any) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.name = 'AppError';
  }
}

// Error codes with user-friendly messages
export const ERROR_CODES = {
  // Authentication errors
  UNAUTHORIZED: {
    code: 'UNAUTHORIZED',
    message: 'You need to be logged in to access this resource',
    statusCode: 401
  },
  SESSION_EXPIRED: {
    code: 'SESSION_EXPIRED',
    message: 'Your session has expired. Please log in again',
    statusCode: 401
  },
  
  // Validation errors
  INVALID_INPUT: {
    code: 'INVALID_INPUT',
    message: 'The provided information is invalid',
    statusCode: 400
  },
  MISSING_REQUIRED_FIELDS: {
    code: 'MISSING_REQUIRED_FIELDS',
    message: 'Please fill in all required fields',
    statusCode: 400
  },
  
  // Resource errors
  RESOURCE_NOT_FOUND: {
    code: 'RESOURCE_NOT_FOUND',
    message: 'The requested resource was not found',
    statusCode: 404
  },
  RESOURCE_ALREADY_EXISTS: {
    code: 'RESOURCE_ALREADY_EXISTS',
    message: 'This resource already exists',
    statusCode: 409
  },
  
  // Database errors
  DATABASE_ERROR: {
    code: 'DATABASE_ERROR',
    message: 'A database error occurred. Please try again later',
    statusCode: 500
  },
  
  // Transaction errors
  INSUFFICIENT_FUNDS: {
    code: 'INSUFFICIENT_FUNDS',
    message: 'Insufficient funds in the selected account',
    statusCode: 400
  },
  INVALID_TRANSACTION: {
    code: 'INVALID_TRANSACTION',
    message: 'The transaction details are invalid',
    statusCode: 400
  },
  
  // Account errors
  ACCOUNT_NOT_FOUND: {
    code: 'ACCOUNT_NOT_FOUND',
    message: 'The specified account was not found',
    statusCode: 404
  },
  ACCOUNT_VERIFICATION_FAILED: {
    code: 'ACCOUNT_VERIFICATION_FAILED',
    message: 'Account verification failed. Please check your details',
    statusCode: 400
  },
  
  // Generic errors
  INTERNAL_SERVER_ERROR: {
    code: 'INTERNAL_SERVER_ERROR',
    message: 'An internal server error occurred. Please try again later',
    statusCode: 500
  },
  RATE_LIMIT_EXCEEDED: {
    code: 'RATE_LIMIT_EXCEEDED',
    message: 'Too many requests. Please wait a moment before trying again',
    statusCode: 429
  }
} as const;

// Enhanced logging system
export const logger = {
  error: (message: string, error?: any, context?: any) => {
    const timestamp = new Date().toISOString();
    const logEntry = {
      level: 'ERROR',
      timestamp,
      message,
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : error,
      context,
      userAgent: typeof window !== 'undefined' ? window.navigator?.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location?.href : undefined
    };
    
    console.error(`[${timestamp}] ERROR:`, logEntry);
    
    // In production, send to external logging service
    if (process.env.NODE_ENV === 'production') {
      // Send to logging service (e.g., Sentry, LogRocket, etc.)
      // await sendToLoggingService(logEntry);
    }
  },
  
  warn: (message: string, context?: any) => {
    const timestamp = new Date().toISOString();
    console.warn(`[${timestamp}] WARNING:`, { message, context });
  },
  
  info: (message: string, context?: any) => {
    const timestamp = new Date().toISOString();
    console.info(`[${timestamp}] INFO:`, { message, context });
  }
};

// Error handler for API routes
export function handleApiError(error: any): { success: false; error: ApiError } {
  if (error instanceof AppError) {
    logger.error('API Error', error, { code: error.code });
    return {
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
        statusCode: error.statusCode
      }
    };
  }
  
  // Handle known error patterns
  if (error.message?.includes('duplicate key')) {
    const duplicateError = ERROR_CODES.RESOURCE_ALREADY_EXISTS;
    logger.error('Duplicate resource error', error);
    return {
      success: false,
      error: duplicateError
    };
  }
  
  if (error.message?.includes('not found')) {
    const notFoundError = ERROR_CODES.RESOURCE_NOT_FOUND;
    logger.error('Resource not found', error);
    return {
      success: false,
      error: notFoundError
    };
  }
  
  // Default internal server error
  const internalError = ERROR_CODES.INTERNAL_SERVER_ERROR;
  logger.error('Unhandled error', error);
  return {
    success: false,
    error: internalError
  };
}

// Client-side error handler
export function handleClientError(error: any): string {
  if (error.code && ERROR_CODES[error.code as keyof typeof ERROR_CODES]) {
    return ERROR_CODES[error.code as keyof typeof ERROR_CODES].message;
  }
  
  if (error.message) {
    return error.message;
  }
  
  return 'An unexpected error occurred. Please try again.';
}

// Validation helper
export function validateRequired(data: Record<string, any>, requiredFields: string[]): void {
  const missingFields = requiredFields.filter(field => !data[field]);
  
  if (missingFields.length > 0) {
    throw new AppError(
      'MISSING_REQUIRED_FIELDS',
      `Missing required fields: ${missingFields.join(', ')}`,
      400,
      { missingFields }
    );
  }
}

// Async error wrapper for API routes
export function withErrorHandling<T extends any[], R>(
  fn: (...args: T) => Promise<R>
): (...args: T) => Promise<R | { success: false; error: ApiError }> {
  return async (...args: T) => {
    try {
      return await fn(...args);
    } catch (error) {
      return handleApiError(error);
    }
  };
} 