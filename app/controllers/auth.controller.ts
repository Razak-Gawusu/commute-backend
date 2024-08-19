import argon2 from 'argon2';
import debugFn from 'debug';
import { Request, Response } from 'express';

import { IRequest, IUser } from '@/interfaces';
import { User } from '@/models';
import { AuthService } from '@/services';
import { ResponseHelper } from '@/utils';

const { sendResponse } = ResponseHelper;
const debug = debugFn('kanban:controller');

export class AuthController {
  static async register(req: Request, res: Response) {
    const { first_name, last_name, role, email, password } = req.body;
    const token = await AuthService.signup({
      first_name,
      last_name,
      role,
      email,
      password,
    });

    return res
      .status(201)
      .json({ token, message: 'account created successfully' });
  }

  static async login(req: IRequest, res: Response) {
    const token = await AuthService.login(req.user);
    return res.status(200).json({ message: 'login successful', token });
  }

  static async sendResetCode(req: Request, res: Response) {
    const { email } = req.body;
    const resetCode = await AuthService.getPasswordResetCode(email);
    debug({ resetCode });
    sendResponse(res, 200, 'successful', { reset_code: resetCode });
  }

  static async verifyResetCode(req: Request, res: Response) {
    const { email, reset_code } = req.body;

    const user = await AuthService.verifyResetCode(email, reset_code);
    if (!user) sendResponse(res, 200, 'Invalid reset code, try again', null);

    sendResponse(res, 200, 'Reset code verified', user);
  }

  static async resetPassword(req: IRequest, res: Response) {
    const { password } = req.body;
    const { email } = req.user;

    const user = await AuthService.resetPassword(email, password);
    if (!user) sendResponse(res, 400, 'Reset password failed', null);

    sendResponse(res, 200, 'Password updated', user);
  }

  static async changePassword(req: IRequest, res: Response) {
    const { new_password, current_password } = req.body;

    const loginUser: IUser | null = await User.getUser(req.user.email);

    const is_valid_password = await argon2.verify(
      String(loginUser?.password),
      current_password,
    );

    if (!is_valid_password)
      sendResponse(res, 400, 'Invalid current password', null);

    const user = await AuthService.resetPassword(req.user.email, new_password);

    if (!user) sendResponse(res, 400, 'Change password failed', null);

    sendResponse(res, 200, 'Password updated', user);
  }
}
