import argon2 from 'argon2';
import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';

import { IRequest } from '@/interfaces';
import { User } from '@/models';
import { ResponseHelper } from '@/utils';
import { API_CONSTANTS } from '@/utils';

const COMMUTE_SECRET = process.env.COMMUTE_SECRET ?? '';
const { sendResponse } = ResponseHelper;

class AuthMiddleware {
  static async validateLogin(req: IRequest, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    const user = await User.getUser(email);
    if (!user) return sendResponse(res, 400, 'Invalid login credentials', null);

    const is_valid_password = await argon2.verify(user.password, password);

    if (!is_valid_password)
      return sendResponse(res, 400, 'Invalid login credentials', null);

    req.user = user;
    next();
  }

  static async checkForUser(req: IRequest, res: Response, next: NextFunction) {
    const { email } = req.body;

    const user = await User.getUser(email);
    if (!user) return sendResponse(res, 400, 'Email does not exist', null);

    req.user = user;

    next();
  }

  static async userExists(req: IRequest, res: Response, next: NextFunction) {
    const { email } = req.body;
    const user = await User.getUser(email);

    if (user) return sendResponse(res, 409, 'Email already exits', null);

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

    if (!token)
      return sendResponse(res, 403, API_CONSTANTS.NO_AUTHORISATION_TOKEN, null);

    jwt.verify(token, COMMUTE_SECRET, (err, decoded) => {
      if (err) {
        return sendResponse(
          res,
          403,
          API_CONSTANTS.NO_AUTHORISATION_TOKEN,
          null,
        );
      }
      console.log({ decoded });
      req.user = decoded;
    });

    const user = await User.getUser(req.user.email);

    if (!user)
      return sendResponse(
        res,
        401,
        'User with this token no longer exits',
        null,
      );

    const isExpired = User.isExpiredToken(
      req.user.iat,
      user.password_changed_at,
    );

    console.log({ isExpired });
    console.log({
      userPassChanged: user?.password_changed_at,
      iat: req.user.iat,
    });

    if (isExpired)
      return sendResponse(
        res,
        401,
        'user has changed password, please login again',
        null,
      );

    next();
  }
}

export { AuthMiddleware };
