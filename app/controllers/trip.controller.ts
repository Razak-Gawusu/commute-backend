import { NextFunction, Request, Response } from 'express';

import { ResponseHelper } from '@/utils';

// import { ErrorController } from './error.controller';

export class TripController {
  static createTrip(_: Request, res: Response) {
    res.json('create trip');
  }
  static getTrips(_: Request, res: Response) {
    ResponseHelper.sendResponse(res, 200, 'all trips', { trips: [] });
  }
  static getOneTrip(_: Request, res: Response) {
    res.json('get one trip');
  }

  static editTrip(_: Request, res: Response) {
    res.json('edit trip');
  }
  static deleteTrip(_: Request, res: Response) {
    res.json('delete trip');
  }

  static async checkId(req: Request, res: Response, next: NextFunction) {
    // const school = await TripService.getOneSchool(req.params.trip_id);
    // if (!trip) return next(new ErrorController('Trip not found', 400));

    next();
  }
}
