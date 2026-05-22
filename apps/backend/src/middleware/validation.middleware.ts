import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';
import { AppError, ErrorType } from '@utils/errorHandler';

export const validate = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      throw new AppError(
        errorMessages.join(', '),
        400,
        ErrorType.VALIDATION_ERROR
      );
    }

    req.body = value;
    next();
  };
};