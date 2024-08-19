import { Request, Response } from 'express';

class UserController {
  static async getLoginUser(_: Request, res: Response) {
    res.json('login user');
  }
  static async getUser(_: Request, res: Response) {
    res.json('single user');
  }
  static async getUsers(_: Request, res: Response) {
    res.json('all users');
  }
  static async deleteUser(_: Request, res: Response) {
    res.json('delete user');
  }
}

export { UserController };
