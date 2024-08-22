import argon2 from 'argon2';
import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';

import { ErrorController } from '@/controllers';
import { IRequest } from '@/interfaces';
import { User } from '@/models';
import { API_CONSTANTS } from '@/utils';

const COMMUTE_SECRET = process.env.COMMUTE_SECRET ?? '';

class AuthMiddleware {
  static async validateLogin(req: IRequest, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    const user = await User.getUser(email);
    if (!user)
      return next(new ErrorController('Invalid login credentials', 400));

    const is_valid_password = await argon2.verify(user.password, password);

    if (!is_valid_password)
      return next(new ErrorController('Invalid login credentials', 400));

    req.user = user;
    next();
  }

  static async checkForUser(req: IRequest, res: Response, next: NextFunction) {
    const { email } = req.body;

    const user = await User.getUser(email);
    if (!user) return next(new ErrorController('Email does not exist', 400));

    req.user = user;

    next();
  }

  static async userExists(req: IRequest, res: Response, next: NextFunction) {
    const { email } = req.body;
    const user = await User.getUser(email);

    if (user) return next(new ErrorController('Email already exits', 409));

    next();
  }

  static async checkResetCode(
    req: IRequest,
    res: Response,
    next: NextFunction,
  ) {
    if (!req.user.reset_password_code)
      return next(new ErrorController('Reset code not verified', 400));

    next();
  }

  static async authenticate(req: IRequest, res: Response, next: NextFunction) {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    console.log({ token, jwt: COMMUTE_SECRET });

    if (!token)
      return next(
        new ErrorController(API_CONSTANTS.NO_AUTHORISATION_TOKEN, 403),
      );

    jwt.verify(token, COMMUTE_SECRET, (err, decoded) => {
      if (err) {
        return next(new ErrorController(err.message, 401));
      } else {
        req.user = decoded;
      }
    });

    if (!req.user)
      return next(
        new ErrorController(API_CONSTANTS.NO_AUTHORISATION_TOKEN, 401),
      );

    const user = await User.getUser(req.user.email);

    if (!user)
      return next(
        new ErrorController('User with this token no longer exits', 401),
      );

    const isExpired = User.isExpiredToken(
      req.user.iat,
      user.password_changed_at,
    );

    if (isExpired)
      return next(
        new ErrorController(
          'user has changed password, please login again',
          401,
        ),
      );

    next();
  }
}

export { AuthMiddleware };
