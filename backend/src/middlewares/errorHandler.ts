import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { logger } from '../utils/logger';
import { env } from '../config/env';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    logger.error(`[${err.statusCode}] ${err.message}`, { errors: err.errors, stack: err.stack });
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
      stack: env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }

  // Fallback for unhandled errors
  logger.error(`[500] ${err.message}`, { stack: err.stack });
  return res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    errors: [],
    stack: env.NODE_ENV === 'development' ? err.stack : undefined
  });
};
