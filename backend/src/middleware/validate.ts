import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../utils/errors';

/**
 * Validates request body against a schema
 * Basic implementation - could be improved in the future
 */
export const validateBody = <T>(schema: (body: any) => body is T) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (!schema(req.body)) {
        throw new ValidationError('Invalid request body');
      }
      next();
    } catch (error) {
      // Convert any errors to ValidationError
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new ValidationError('Request validation failed');
    }
  };
};

/**
 * Simple ID validation - just checks if ID exists and is non-empty
 */
export const validateId = (req: Request, _res: Response, next: NextFunction) => {
  const id = req.params.id;
  
  // Just ensure we have a non-empty ID
  if (!id || id.trim() === '') {
    throw new ValidationError('Invalid ID parameter');
  }
  
  next();
}; 