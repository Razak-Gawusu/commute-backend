import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import _ from 'lodash';

import { db } from '@/config';
import { ErrorController } from '@/controllers';
import { IUser } from '@/interfaces';
import { User } from '@/models';
import { UserQueries } from '@/queries';
import { GenericHelpers } from '@/utils';

const SECRET = process.env.KANBAN_SECRET;
const JWT_EXPIRES = process.env.KANBAN_TOKEN_EXPIRES;

export class AuthService {
  static async signup(data: IUser) {
    const { email, password, first_name, last_name, role } = data;
    const user = new User({
      id: GenericHelpers.generateUUID(),
      first_name,
      last_name,
      role,
      email,
      password: password,
    });

    if (!user) return new ErrorController('Error creating user', 401);

    const new_user = await user.create();
    const token = await AuthService.login(new_user);

    return { user: new_user, token };
  }

  static async login(user: IUser) {
    const token = jwt.sign(
      _.pick(user, ['id', 'email', 'username']),
      SECRET ?? '',
      { expiresIn: JWT_EXPIRES },
    );
    return token;
  }

  static async getPasswordResetToken(email: string) {
    return User.generateResetToken(email);
  }

  static async verifyResetCode(reset_token: string) {
    const hash_reset_token = crypto
      .createHash('sha256')
      .update(reset_token)
      .digest('hex');

    return db.oneOrNone(UserQueries.getUserByResetToken, [
      hash_reset_token,
      Date.now(),
    ]);
  }

  static async resetPassword(email: string, password: string) {
    return User.resetPassword(email, password);
  }
}
