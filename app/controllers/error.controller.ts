// import debugFn from 'debug';
import { NextFunction, Request, Response } from 'express';

import { IError } from '@/interfaces';

import 'dotenv/config';

// const debug = debugFn('kanban:error');

export class ErrorController extends Error implements IError {
  status: string;
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = String(statusCode).startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }

  static catchAsync(
    controller: (req: Request, res: Response, next: NextFunction) => any,
  ) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        controller(req, res, next);
      } catch (error) {
        next(error);
      }
    };
  }

  static globalErrorhandler(
    err: IError,
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    if (process.env.NODE_ENV === 'development') {
      sendErrorDev(err, res);
    }
    if (process.env.NODE_ENV === 'production') {
      let error = Object.create(err);
      if (error.code == '22P02') {
        error = handleInvalidTextRepresentation(error);
      }
      if (error.code == '23505') {
        error = handleDuplicatekeyError(error);
      }
      if (error.code == '42703') {
        error = handleDBError(error);
      }
      sendErrorProd(error, res);
    }

    next();
  }
}

function sendErrorDev(err: IError, res: Response) {
  console.log(err);
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
    });
  } else {
    return res
      .status(500)
      .json({ status: 'error', message: 'Something went very wrong' });
  }
}

function sendErrorProd(err: IError, res: Response) {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
}

function handleInvalidTextRepresentation(err: IError) {
  return new ErrorController(err.message, 400);
}

function handleDuplicatekeyError(err: IError) {
  return new ErrorController(err.detail ?? 'Duplicate key error', 400);
}

function handleDBError(err: IError) {
  return new ErrorController(err.message, 400);
}
