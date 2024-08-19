import argon2 from 'argon2';
import crypto from 'crypto';

import { db } from '@/config';
// import { ErrorController } from '@/controllers';
import { IUser } from '@/interfaces';
import { UserQueries } from '@/queries';

export class User implements IUser {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: 'admin' | 'super_admin' | 'parent' | 'driver';
  password_changed_at?: number;
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
      this.first_name,
      this.last_name,
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

  static async generateResetCode(email: string) {
    const resetCode = this.generateRandomBytes();
    const resetCodeHash = crypto
      .createHash('sha256')
      .update(String(resetCode))
      .digest('hex');

    await db.oneOrNone(UserQueries.updateUserPasswordResetCode, [
      email,
      resetCodeHash,
      //expires in 1 minute
      Date.now() + 60 * 1000,
    ]);

    return resetCode;
  }

  static async verifyResetCode(email: string, reset_code: string) {
    const hash_reset_code = crypto
      .createHash('sha256')
      .update(reset_code)
      .digest('hex');

    // const user: IUser | null = await db.oneOrNone(
    //   UserQueries.getUserByEmailAndResetCode,
    //   [email, hash_reset_code],
    // );

    // if (!user) return new ErrorController('Invalid reset token', 401);

    // console.log({ user });

    return db.oneOrNone(UserQueries.getUserByResetCode, [
      hash_reset_code,
      Date.now(),
    ]);
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

  static isExpiredToken(tokenIat: number, password_changed_at?: number) {
    if (!password_changed_at) return false;

    const changePwdTime = Number(password_changed_at) / 1000;
    return changePwdTime > tokenIat;
  }

  static generateRandomBytes() {
    return Math.floor(100000 + Math.random() * 900000);
  }
}
