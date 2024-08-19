import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

import { ResponseHelper } from '@/utils';

const { sendResponse } = ResponseHelper;

export class GenericMiddleware {
  static validateSchema(schema: Joi.ObjectSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
      const { error } = schema.validate(req.body);
      if (error) {
        return sendResponse(res, 400, error.details[0].message, null);
      }
      next();
    };
  }
}
