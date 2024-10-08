import { NextFunction, Request, Response } from 'express';

import { IRequest } from '@/interfaces';
import { School } from '@/models';
import { AuthService, SchoolService } from '@/services';
import { ResponseHelper } from '@/utils';
import apiConstants from '@/utils/constants/api.constants';

import { ErrorController } from './error.controller';

const DEFAULT_PASSWORD = process.env.DEFAULT_PASSWORD || '12345';

export class SchoolController {
  static async register(req: IRequest, res: Response, next: NextFunction) {
    const {
      name,
      email,
      phone,
      password,
      certificate_number,
      country,
      state,
      city,
      digital_address,
    } = req.body;
    const school = await SchoolService.register(
      {
        name,
        email,
        phone,
        password,
        certificate_number,
        owner_id: req.user.id,
      },
      { country, state, city, digital_address },
      next,
    );

    if (!school)
      return next(new ErrorController(apiConstants.ERROR_CREATING_SCHOOL, 400));

    ResponseHelper.sendResponse(res, 200, apiConstants.CREATE_SCHOOL, {
      school,
    });
  }

  static async getSchools(_: Request, res: Response, next: NextFunction) {
    const schools = await SchoolService.getSchools();

    if (!schools)
      return next(new ErrorController(apiConstants.ERROR_CREATING_SCHOOL, 400));

    ResponseHelper.sendResponse(res, 200, 'success', { schools });
  }

  static async getOneSchool(req: Request, res: Response, next: NextFunction) {
    const school = await SchoolService.getOneSchool(req.params.school_id);

    if (!school)
      return next(
        new ErrorController(apiConstants.ERROR_FETCHING_SCHOOLS, 404),
      );

    ResponseHelper.sendResponse(res, 200, 'successful', { school });
  }

  static getLoginSchool(_: Request, res: Response) {
    res.json('login school');
  }

  static editSchool(_: Request, res: Response) {
    res.json('edit school');
  }

  static async deleteSchool(req: Request, res: Response, next: NextFunction) {
    await SchoolService.deleteSchool(req.params.school_id, next);
    ResponseHelper.sendResponse(res, 200, 'successful', null);
  }

  static async inviteParent(req: IRequest, res: Response, next: NextFunction) {
    const { first_name, last_name, email, phone } = req.body;
    const school = await School.getOneByOwnerId(req.user.id);

    const user = await AuthService.signup(
      {
        first_name,
        last_name,
        email,
        phone,
        password: DEFAULT_PASSWORD,
        role: 'parent',
        school_id: school?.id,
      },
      next,
    );

    if (!user)
      return next(new ErrorController('Error inviting parent, try again', 400));

    ResponseHelper.sendResponse(res, 200, 'send email', { user });
  }

  static async addWardToParent(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const { parent_id } = req.params;
    const { name } = req.body;

    console.log({ parent_id, name });

    const ward = await SchoolService.addWardToParent({ name, parent_id });

    if (!ward)
      return next(
        new ErrorController('Error adding ward to parent, try again', 400),
      );

    ResponseHelper.sendResponse(res, 200, 'successful', { ward });
  }
}
