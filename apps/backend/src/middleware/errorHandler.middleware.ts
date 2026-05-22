import { Request, Response, NextFunction } from 'express';
import { AppError, ErrorType } from '@utils/errorHandler';
import logger from '@utils/logger';

export const globalErrorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof AppError) {
    logger.error(`${err.errorType}: ${err.message}`);
    res.status(err.statusCode).json({
      success: false,
      errorType: err.errorType,
      message: err.message,
      timestamp: new Date().toISOString(),
    });
  } else {
    logger.error(`Unexpected error: ${err.message}`);
    res.status(500).json({
      success: false,
      errorType: ErrorType.INTERNAL_ERROR,
      message: 'An unexpected error occurred',
      timestamp: new Date().toISOString(),
    });
  }
};