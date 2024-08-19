import debugFn from 'debug';
import { Request, Response } from 'express';

import { IRequest } from '@/interfaces';
import { AuthService } from '@/services';
import { ResponseHelper } from '@/utils';

const { sendResponse } = ResponseHelper;
const debug = debugFn('kanban:controller');

export class AuthController {
  static async register(req: Request, res: Response) {
    const { first_name, last_name, role, email, password } = req.body;
    const user = await AuthService.signup({
      first_name,
      last_name,
      role,
      email,
      password,
    });
    return sendResponse(res, 201, 'successfully registered', user);
  }

  static async login(req: IRequest, res: Response) {
    const token = await AuthService.login(req.user);
    debug(token);
    return sendResponse(res, 200, 'login successful', { token });
  }

  static async sendResetCode(req: Request, res: Response) {
    const { email } = req.body;
    const resetToken = await AuthService.getPasswordResetToken(email);
    debug(resetToken);
    sendResponse(res, 200, 'successful', resetToken);
  }
  static async resendResetCode(req: Request, res: Response) {
    const { email } = req.body;
    const resetToken = await AuthService.getPasswordResetToken(email);
    debug(resetToken);
    sendResponse(res, 200, 'successful', resetToken);
  }

  static async verifyResetCode(req: Request, res: Response) {
    const { reset_token } = req.body;

    const user = await AuthService.verifyResetCode(reset_token);
    if (!user) sendResponse(res, 200, 'Invalid Reset Token', null);

    sendResponse(res, 200, 'Reset token verified', user);
  }

  static async resetPassword(req: IRequest, res: Response) {
    const { password } = req.body;
    const { email } = req.user;

    const user = await AuthService.resetPassword(email, password);
    if (!user) sendResponse(res, 400, 'Reset password failed', null);

    sendResponse(res, 200, 'Password updated', user);
  }
}
