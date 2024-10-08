import { NextFunction, Request, Response } from 'express';

import { IRequest } from '@/interfaces';
import { School, User } from '@/models';
import { TripService } from '@/services/trip.service';
import { ResponseHelper } from '@/utils';

import { ErrorController } from './error.controller';

export class TripController {
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

  static async deleteTrip(req: Request, res: Response) {
    await TripService.deleteTrip(req.params.trip_id);

    ResponseHelper.sendResponse(res, 200, 'successful', null);
  }

  static async requestTrip(req: IRequest, res: Response, next: NextFunction) {
    let school_id = req.user.school_id;

    if (req.user.role === 'admin') {
      if (!req.body.parent_id)
        return next(new ErrorController('parent_id is required', 400));

      const user = await User.getOne(req.body.parent_id);

      if (!user) return next(new ErrorController('Parent does not exist', 404));

      const school = await School.getOneByOwnerId(req.user.id);

      school_id = school?.id;
    }

    const trip = await TripService.createTrip({
      parent_id: req.user.role === 'parent' ? req.user.id : req.body.parent_id,
      driver_id: req.params.driver_id,
      school_id,
      status: 'requested',
    });

    if (!trip)
      next(new ErrorController('Error requesting for a trip, try again', 400));

    ResponseHelper.sendResponse(res, 200, 'successful', { trip });
  }

  static async changeTripStatus(
    req: IRequest,
    res: Response,
    next: NextFunction,
  ) {
    const { status } = req.body;

    const trip = await TripService.changeTripStatus(req.params.trip_id, status);

    if (!trip)
      return next(
        new ErrorController('Trip status change failed try again', 400),
      );

    ResponseHelper.sendResponse(res, 200, 'successful', { trip });
  }
}
