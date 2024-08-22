import { NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import _ from 'lodash';

import { ErrorController } from '@/controllers';
import { IUser } from '@/interfaces';
import { User } from '@/models';
import { GenericHelpers } from '@/utils';

const SECRET = process.env.COMMUTE_SECRET;
const JWT_EXPIRES = process.env.COMMUTE_TOKEN_EXPIRES;

export class AuthService {
  static async signup(data: IUser, next: NextFunction) {
    const user = new User({
      ...data,
      id: GenericHelpers.generateUUID(),
    });

    const new_user: IUser = await user.create();

    if (!new_user) return next(new ErrorController('Error creating user', 401));

    const token = await AuthService.login(new_user);

    return token;
  }

  static async login(user: IUser) {
    const token = jwt.sign(
      _.pick(user, ['id', 'email', 'username', 'role']),
      SECRET ?? '',
      { expiresIn: JWT_EXPIRES },
    );
    return token;
  }

  static async getPasswordResetCode(email: string) {
    return User.generateResetCode(email);
  }

  static async verifyResetCode(
    email: string,
    reset_code: string,
    next: NextFunction,
  ) {
    return User.verifyResetCode(email, reset_code, next);
  }

  static async resetPassword(email: string, password: string) {
    return User.resetPassword(email, password);
  }
}
