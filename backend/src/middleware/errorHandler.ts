import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';

/**
 * Global error handler middleware
 * Basic implementation, could be improved
 */
export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Check for our custom errors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
      status: 'error'
    });
  }

  // Log unknown errors
  console.error('Unhandled error:', err);
  
  // Default to 500 for unknown errors
  return res.status(500).json({
    message: 'Something went wrong',
    status: 'error'
  });
}; 