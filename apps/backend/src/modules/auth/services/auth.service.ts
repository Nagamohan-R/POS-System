import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '@config/index';
import logger from '@utils/logger';
import { AppError, ErrorType } from '@utils/errorHandler';
import { User, UserRole } from '../entities/User.entity';

interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

export class AuthService {
  // Hash password
  static async hashPassword(password: string): Promise<string> {
    const salt = await bcryptjs.genSalt(10);
    return bcryptjs.hash(password, salt);
  }

  // Compare password
  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcryptjs.compare(password, hash);
  }

  // Generate tokens
  static generateTokens(user: User): TokenResponse {
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiration,
    });

    const refreshToken = jwt.sign(payload, config.jwt.refresh_secret, {
      expiresIn: config.jwt.refresh_expiration,
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: config.jwt.expiration,
    };
  }

  // Verify token
  static verifyToken(token: string, isRefresh: boolean = false): JwtPayload {
    try {
      const secret = isRefresh ? config.jwt.refresh_secret : config.jwt.secret;
      const decoded = jwt.verify(token, secret) as JwtPayload;
      return decoded;
    } catch (error) {
      logger.error(`Token verification failed: ${error}`);
      throw new AppError(
        'Invalid or expired token',
        401,
        ErrorType.AUTHENTICATION_ERROR
      );
    }
  }

  // Validate user credentials
  static validateUserCreation(data: any): void {
    if (!data.email || !data.password || !data.firstName || !data.lastName) {
      throw new AppError(
        'Missing required fields',
        400,
        ErrorType.VALIDATION_ERROR
      );
    }

    if (data.password.length < 8) {
      throw new AppError(
        'Password must be at least 8 characters long',
        400,
        ErrorType.VALIDATION_ERROR
      );
    }
  }
}
