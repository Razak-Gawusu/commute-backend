import { Request } from 'express';

export type Role = 'admin' | 'super_admin' | 'parent' | 'driver';
export type TripStatus =
  | 'pending'
  | 'failed'
  | 'ongoing'
  | 'requested'
  | 'arrived';
export interface IUser {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: Role;
  phone?: string;
  created_at?: string;
  updated_at?: string;
  password_changed_at?: number;
  reset_password_code?: string;
  password_reset_expires_at?: Date;
}

export interface ISchool {
  id?: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  address_id?: string;
  certificate_number: string;
}

export interface IAddress {
  country: string;
  state: string;
  city: string;
  digital_address: string;
}

export interface ITrip {
  id?: string;
  school_id: string;
  driver_id: string;
  parent_id: string;
  status: TripStatus;
}

export interface IError extends Error {
  status: string;
  statusCode: number;
  isOperational: boolean;
  code?: string | number;
  detail?: string;
}

export interface IRequest extends Request {
  user?: IUser | any;
}
