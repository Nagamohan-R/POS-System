import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '@config/index';
import { AppError, ErrorType } from '@utils/errorHandler';
import logger from '@utils/logger';

interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      throw new AppError(
        'No authentication token provided',
        401,
        ErrorType.AUTHENTICATION_ERROR
      );
    }

    jwt.verify(token, config.jwt.secret, (err: any, user: any) => {
      if (err) {
        logger.error(`Token verification failed: ${err.message}`);
        throw new AppError(
          'Invalid or expired token',
          401,
          ErrorType.AUTHENTICATION_ERROR
        );
      }

      const payload = user as JwtPayload;
      req.userId = payload.userId;
      req.userRole = payload.role;
      next();
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        errorType: error.errorType,
        message: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Authentication failed',
      });
    }
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (!req.userRole || !roles.includes(req.userRole)) {
        throw new AppError(
          'Insufficient permissions',
          403,
          ErrorType.AUTHORIZATION_ERROR
        );
      }
      next();
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          errorType: error.errorType,
          message: error.message,
        });
      }
    }
  };
};