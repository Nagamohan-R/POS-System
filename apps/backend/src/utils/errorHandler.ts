import { Response } from 'express';
import logger from './logger';

export enum ErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  NOT_FOUND_ERROR = 'NOT_FOUND_ERROR',
  CONFLICT_ERROR = 'CONFLICT_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  BAD_REQUEST = 'BAD_REQUEST',
}

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errorType: ErrorType;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number,
    errorType: ErrorType = ErrorType.INTERNAL_ERROR,
    isOperational: boolean = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorType = errorType;
    this.isOperational = isOperational;

    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const handleError = (error: any, res: Response): void => {
  if (error instanceof AppError) {
    logger.error(`${error.errorType}: ${error.message}`);
    res.status(error.statusCode).json({
      success: false,
      errorType: error.errorType,
      message: error.message,
    });
  } else {
    logger.error(`Unexpected Error: ${error.message}`);
    res.status(500).json({
      success: false,
      errorType: ErrorType.INTERNAL_ERROR,
      message: 'An unexpected error occurred',
    });
  }
};