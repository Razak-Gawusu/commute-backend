import { Request } from 'express';

export type Role = 'admin' | 'super_admin' | 'parent' | 'driver';
export interface IUser {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: Role;
  created_at?: string;
  updated_at?: string;
  password_changed_at?: number;
  password_reset_code?: string;
  password_reset_expires_at?: Date;
}

export interface IBoard {
  id: string;
  user_id: string;
  title: string;
  created_at?: string;
  updated_at?: string;
}

export interface IColumn {
  id: string;
  title: string;
  board_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface ITask {
  id: string;
  title: string;
  description: string;
  column_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface ISubTask {
  id?: number;
  title: string;
  task_id: string;
  is_completed?: boolean;
  created_at?: string;
  updated_at?: string;
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
