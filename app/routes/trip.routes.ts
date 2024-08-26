import express from 'express';

import { ErrorController, TripController } from '@/controllers';
import { AuthMiddleware, GenericMiddleware } from '@/middlewares';
import { User } from '@/models';
import { requestTripSchema } from '@/utils';
const router = express.Router();

// router.use('/:board_id/columns', columnRouter);

router.param('trip_id', ErrorController.catchAsync(TripController.checkId));

router.param('driver_id', GenericMiddleware.checkResource('driver_id', User));

router.route('/').get(ErrorController.catchAsync(TripController.getTrips));

router
  .route('/:trip_id')
  .get(TripController.getOneTrip)
  .patch(TripController.editTrip)
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
  .route('/accept')
  .get(AuthMiddleware.restrictTo('driver'), TripController.acceptTrip);
router
  .route('/start')
  .get(AuthMiddleware.restrictTo('driver'), TripController.startTrip);
router
  .route('/end')
  .get(AuthMiddleware.restrictTo('driver'), TripController.endTrip);
router
  .route('/confirm')
  .get(
    AuthMiddleware.restrictTo('parent', 'admin'),
    TripController.confirmTrip,
  );

export { router as tripRouters };
