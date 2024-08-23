import express from 'express';

import { ErrorController, TripController } from '@/controllers';
import { GenericMiddleware } from '@/middlewares';
// import { AuthMiddleware } from '@/middlewares';
import { School, User } from '@/models';
import { createTripSchema } from '@/utils';
const router = express.Router();

// router.use('/:board_id/columns', columnRouter);

router.param('trip_id', ErrorController.catchAsync(TripController.checkId));

//

router
  .route('/')
  .get(ErrorController.catchAsync(TripController.getTrips))
  .post(
    // ErrorController.catchAsync(AuthMiddleware.authenticate),
    // ErrorController.catchAsync(
    //   AuthMiddleware.restrictTo('admin', 'parent', 'super_admin'),
    // ),

    GenericMiddleware.validateSchema(createTripSchema),
    ErrorController.catchAsync(TripController.checkV3('parent_id', User)),
    ErrorController.catchAsync(TripController.checkV3('driver_id', User)),
    ErrorController.catchAsync(TripController.checkV3('school_id', School)),
    TripController.createTrip,
  );
router
  .route('/:trip_id')
  .get(TripController.getOneTrip)
  .patch(TripController.editTrip)
  .delete(TripController.deleteTrip);

export { router as tripRouters };
