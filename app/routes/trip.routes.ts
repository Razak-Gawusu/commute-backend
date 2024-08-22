import express from 'express';

import { ErrorController, TripController } from '@/controllers';
import { AuthMiddleware } from '@/middlewares';
const router = express.Router();

// router.use('/:board_id/columns', columnRouter);

router.param('trip_id', ErrorController.catchAsync(TripController.checkId));

// /trips/id

router
  .route('/')
  .get(TripController.getTrips)
  .post(
    ErrorController.catchAsync(AuthMiddleware.authenticate),
    ErrorController.catchAsync(
      AuthMiddleware.restrictTo('admin', 'parent', 'super_admin'),
    ),
    TripController.createTrip,
  );
router
  .route('/:trip_id')
  .get(TripController.getOneTrip)
  .patch(TripController.editTrip)
  .delete(TripController.deleteTrip);

export { router as tripRouters };
