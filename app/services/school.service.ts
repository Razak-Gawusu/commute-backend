import { NextFunction } from 'express';

import { db } from '@/config';
import { ErrorController } from '@/controllers';
import { IAddress, ISchool } from '@/interfaces';
import { School } from '@/models';
import { addressQuery } from '@/queries';
import { GenericHelpers } from '@/utils';
import apiConstants from '@/utils/constants/api.constants';

export class SchoolService {
  static async register(
    school: ISchool,
    address: IAddress,
    next: NextFunction,
  ) {
    const { country, city, state, digital_address } = address;

    const new_address = await db.oneOrNone(addressQuery.createAddress, [
      GenericHelpers.generateUUID(),
      country,
      state,
      city,
      digital_address,
    ]);

    if (!new_address)
      return next(new ErrorController(apiConstants.ERROR_CREATING_SCHOOL, 400));

    const new_school = new School({
      ...school,
      id: GenericHelpers.generateUUID(),
      address_id: new_address.id,
    });

    return new_school.register();
  }

  static async getSchools() {
    return School.getSchools();
  }

  static async getOneSchool(id: string) {
    return School.getOneSchool(id);
  }

  static async deleteSchool(id: string, next: NextFunction) {
    return School.deleteSchool(id, next);
  }
}
