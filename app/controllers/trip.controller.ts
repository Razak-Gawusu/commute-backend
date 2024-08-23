import { NextFunction, Request, Response } from 'express';

import { IRequest } from '@/interfaces';
import { TripService } from '@/services/trip.service';
import { ResponseHelper } from '@/utils';

import { ErrorController } from './error.controller';

export class TripController {
  static async createTrip(req: Request, res: Response, next: NextFunction) {
    const { parent_id, driver_id, school_id, status } = req.body;
    const trip = await TripService.createTrip({
      parent_id,
      driver_id,
      school_id,
      status,
    });
    if (!trip)
      next(new ErrorController('Error requesting for a trip, try again', 400));

    ResponseHelper.sendResponse(res, 200, 'successful', { trip });
  }
  static async getTrips(_: Request, res: Response, next: NextFunction) {
    const trips = await TripService.fetchTrips();
    if (!trips) return next(new ErrorController('trips not found', 404));

    ResponseHelper.sendResponse(res, 200, 'all trips', { trips });
  }

  static async getOneTrip(req: Request, res: Response, next: NextFunction) {
    const trip = await TripService.fetchOneTrip(req.params.trip_id);
    if (!trip) return next(new ErrorController('trip not found', 404));

    ResponseHelper.sendResponse(res, 200, 'all trips', { trip });
  }

  static editTrip(_: Request, res: Response) {
    res.json('edit trip');
  }

  static async deleteTrip(req: Request, res: Response) {
    await TripService.deleteTrip(req.params.trip_id);

    ResponseHelper.sendResponse(res, 200, 'successful', null);
  }

  static async checkId(req: Request, res: Response, next: NextFunction) {
    const trip = await TripService.fetchOneTrip(req.params.trip_id);
    if (!trip) return next(new ErrorController('Trip not found', 400));

    next();
  }

  static checkV3(id: string, Model: any) {
    // id structure resource_id
    const resource = `${id.split('_')[0]}`;

    return async (req: IRequest, res: Response, next: NextFunction) => {
      const model = await Model.getOne(req.params[id] || req.body[id]);
      if (!model)
        return next(new ErrorController(`${resource} not found`, 404));

      next();
    };
  }
}
