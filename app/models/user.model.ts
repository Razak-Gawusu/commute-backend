import argon2 from 'argon2';
import crypto from 'crypto';

import { db } from '@/config';
import { IUser } from '@/interfaces';
import { UserQueries } from '@/queries';

export class User implements IUser {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: 'admin' | 'super_admin' | 'parent' | 'driver';
  password_changed_at?: Date;
  password_reset_expires_at?: Date;
  password_reset_token?: string;

  constructor(user: IUser) {
    this.id = user.id;
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.role = user.role;
    this.email = user.email;
    this.password = user.password;
  }

  async create() {
    const hash_password = await argon2.hash(this.password);
    return db.oneOrNone(UserQueries.createUser, [
      this.id,
      this.email,
      hash_password,
      this.role,
    ]);
  }

  static async getUsers() {
    return db.manyOrNone(UserQueries.getUsers);
  }

  static async getUser(email: string): Promise<IUser | null> {
    return db.oneOrNone(UserQueries.getUser, [email]);
  }
  static async deleteUser(email: string) {
    return db.none(UserQueries.deleteUser, [email]);
  }

  static async generateResetToken(email: string) {
    const resetToken = crypto.randomBytes(4).toString('hex');
    const passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    await db.oneOrNone(UserQueries.updateUserPasswordResetToken, [
      email,
      passwordResetToken,
      Date.now() + 10 * 60 + 1000,
    ]);

    return resetToken;
  }

  static async resetPassword(email: string, password: string) {
    const hash_password = await argon2.hash(password);
    const password_changed_at = Date.now();
    return db.oneOrNone(UserQueries.updatePassword, [
      email,
      hash_password,
      password_changed_at,
    ]);
  }

  static async isExpiredToken(
    password_changed_at: Date | undefined,
    tokenIat: number,
  ) {
    if (!password_changed_at) return false;

    const changePwdTime = password_changed_at.getTime() / 1000;
    return changePwdTime > tokenIat;
  }
}
