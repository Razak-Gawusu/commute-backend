import express from 'express';

import { TripController } from '@/controllers';
const router = express.Router();

router.route('/').get(TripController.getTrips).post(TripController.createTrip);
router
  .route('/:tripId')
  .get(TripController.getOneTrip)
  .patch(TripController.editTrip)
  .delete(TripController.deleteTrip);

export { router as tripRouters };
