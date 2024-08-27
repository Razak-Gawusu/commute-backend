import express from 'express';

import { ErrorController, TripController } from '@/controllers';
import { AuthMiddleware, GenericMiddleware } from '@/middlewares';
import { User } from '@/models';
import { Trip } from '@/models/trip.model';
import { changeTripStatus, requestTripSchema } from '@/utils';
const router = express.Router();

// router.use('/:board_id/columns', columnRouter);

router.param('trip_id', GenericMiddleware.checkResource('trip_id', Trip));
router.param('driver_id', GenericMiddleware.checkResource('driver_id', User));

router.route('/').get(ErrorController.catchAsync(TripController.getTrips));

router
  .route('/:trip_id')
  .get(TripController.getOneTrip)
  .delete(TripController.deleteTrip);

router
  .route('/request/:driver_id')
  .post(
    GenericMiddleware.validateSchema(requestTripSchema),
    AuthMiddleware.authenticate,
    AuthMiddleware.restrictTo('parent', 'admin'),
    ErrorController.catchAsync(TripController.requestTrip),
  );

router
  .route('/:trip_id/status')
  .patch(
    GenericMiddleware.validateSchema(changeTripStatus),
    AuthMiddleware.authenticate,
    AuthMiddleware.restrictTo('driver'),
    ErrorController.catchAsync(TripController.changeTripStatus),
  );

export { router as tripRouters };
