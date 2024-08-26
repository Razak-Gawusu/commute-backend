import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

import { ErrorController } from '@/controllers';
import { IRequest, Role } from '@/interfaces';

export class GenericMiddleware {
  static validateSchema(schema: Joi.ObjectSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
      const { error } = schema.validate(req.body);
      if (error)
        return next(new ErrorController(error.details[0].message, 400));

      next();
    };
  }

  static checkResource(id: string, Model: any) {
    // id structure resource_id
    const resource = `${id.split('_')[0]}`;

    return async (req: IRequest, res: Response, next: NextFunction) => {
      const model = await Model.getOne(req.params[id] || req.body[id]);
      if (!model)
        return next(new ErrorController(`${resource} not found`, 404));

      next();
    };
  }

  static restrictTo(...roles: Role[]) {
    return (req: IRequest, res: Response, next: NextFunction) => {
      if (!roles.includes(req.user.role))
        return next(new ErrorController('not authorized', 401));

      next();
    };
  }
}
