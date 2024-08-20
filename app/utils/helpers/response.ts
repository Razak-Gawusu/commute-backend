import { Response } from 'express';

export class ResponseHelper {
  static sendResponse(res: Response, code: number, message: string, data: any) {
    res.status(code).json({
      status: String(code).startsWith('2') ? 'successfull' : 'fail',
      message,
      data,
    });
  }
}
