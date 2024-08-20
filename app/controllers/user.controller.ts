import { NextFunction, Request, Response } from 'express';

import { IRequest } from '@/interfaces';
import { User } from '@/models';
import { ResponseHelper } from '@/utils';

import { ErrorController } from './error.controller';

class UserController {
  static async getLoginUser(req: IRequest, res: Response) {
    const { email } = req.user;
    const user = await User.getUser(email);
    ResponseHelper.sendResponse(res, 200, 'successful', { user });
  }

  static async getUser(req: Request, res: Response, next: NextFunction) {
    const { email } = req.params;
    const user = await User.getUser(email);
    if (!user) return next(new ErrorController('User not found', 404));
    ResponseHelper.sendResponse(res, 200, 'successful', { user });
  }

  static async getUsers(_: Request, res: Response) {
    const users = await User.getUsers();
    ResponseHelper.sendResponse(res, 200, 'successful', { users });
  }

  static async deleteUser(req: Request, res: Response, next: NextFunction) {
    const { email } = req.params;

    const user = await User.getUser(email);

    if (!user) return next(new ErrorController('User not found', 404));

    if (user.role === 'super_admin')
      return next(new ErrorController(`Super admin can't be deleted`, 400));

    await User.deleteUser(email);

    ResponseHelper.sendResponse(res, 200, 'successful', null);
  }
}

export { UserController };
