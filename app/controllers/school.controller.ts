import { NextFunction, Request, Response } from 'express';

import { SchoolService } from '@/services';
import { ResponseHelper } from '@/utils';
import apiConstants from '@/utils/constants/api.constants';

import { ErrorController } from './error.controller';

export class SchoolController {
  static async register(req: Request, res: Response, next: NextFunction) {
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

  static async checkId(req: Request, res: Response, next: NextFunction) {
    const school = await SchoolService.getOneSchool(req.params.school_id);
    if (!school) return next(new ErrorController('School not found', 400));
    next();
  }
}
