import express from 'express';

import { ErrorController, SchoolController } from '@/controllers';
import { GenericMiddleware } from '@/middlewares';
import { registerSchoolSchema } from '@/utils';
const router = express.Router();

router.param('school_id', ErrorController.catchAsync(SchoolController.checkId));

router
  .route('/')
  .get(SchoolController.getSchools)
  .post(
    GenericMiddleware.validateSchema(registerSchoolSchema),
    ErrorController.catchAsync(SchoolController.register),
  );
router.route('/profile').get(SchoolController.getLoginSchool);
router
  .route('/:school_id')
  .get(SchoolController.getOneSchool)
  .patch(SchoolController.editSchool)
  .delete(
    // AuthMiddleware.authenticate,
    // GenericMiddleware.restrictTo('super_admin'),
    SchoolController.deleteSchool,
  );

export { router as schoolsRouter };
