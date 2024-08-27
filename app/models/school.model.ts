import argon2 from 'argon2';
import { NextFunction } from 'express';

import { db } from '@/config';
import { ErrorController } from '@/controllers';
import { ISchool, IStudent } from '@/interfaces';
import { schoolQuery } from '@/queries';

export class School implements ISchool {
  id?: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  address_id?: string;
  certificate_number: string;
  owner_id: string;

  constructor(school: ISchool) {
    this.id = school.id;
    this.name = school.name;
    this.email = school.email;
    this.phone = school.phone;
    this.password = school.password;
    this.address_id = school.address_id;
    this.certificate_number = school.certificate_number;
    this.owner_id = school.owner_id;
  }

  async register() {
    const hash_password = await argon2.hash(this.password);

    return db.oneOrNone(schoolQuery.register, [
      this.id,
      this.name,
      this.email,
      this.phone,
      hash_password,
      this.address_id,
      this.certificate_number,
      this.owner_id,
    ]);
  }

  static async getSchools() {
    return db.manyOrNone(schoolQuery.getSchools);
  }

  static async addWardToParent(ward: IStudent) {
    return db.oneOrNone(schoolQuery.addWard, [
      ward.id,
      ward.name,
      ward.parent_id,
    ]);
  }

  static async getOneSchool(id: string): Promise<ISchool | null> {
    return db.oneOrNone(schoolQuery.getOneSchool, [id]);
  }

  static async getOne(id: string): Promise<ISchool | null> {
    return db.oneOrNone(schoolQuery.getOne, [id]);
  }
  static async getOneByOwnerId(id: string): Promise<ISchool | null> {
    return db.oneOrNone(schoolQuery.getOneByOwnerId, [id]);
  }

  static async deleteSchool(id: string, next: NextFunction) {
    try {
      return db.none(schoolQuery.deleteSchool, [id]);
    } catch (error: any) {
      next(new ErrorController(error.message, 400));
    }
  }
}
