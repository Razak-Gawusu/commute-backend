import express from 'express';

import { ErrorController, SchoolController } from '@/controllers';
import { AuthMiddleware, GenericMiddleware } from '@/middlewares';
import { inviteParentSchema, registerSchoolSchema } from '@/utils';
const router = express.Router();

router.param('school_id', ErrorController.catchAsync(SchoolController.checkId));

router
  .route('/')
  .get(SchoolController.getSchools)
  .post(
    AuthMiddleware.authenticate,
    GenericMiddleware.validateSchema(registerSchoolSchema),
    GenericMiddleware.restrictTo('admin'),
    ErrorController.catchAsync(SchoolController.register),
  );
router
  .route('/profile')
  .get(ErrorController.catchAsync(SchoolController.getLoginSchool));
router
  .route('/:school_id')
  .get(SchoolController.getOneSchool)
  .patch(SchoolController.editSchool)
  .delete(
    ErrorController.catchAsync(AuthMiddleware.authenticate),
    ErrorController.catchAsync(GenericMiddleware.restrictTo('super_admin')),
    SchoolController.deleteSchool,
  );

router
  .route('/invite-parent')
  .post(
    GenericMiddleware.validateSchema(inviteParentSchema),
    AuthMiddleware.authenticate,
    GenericMiddleware.restrictTo('admin'),
    AuthMiddleware.userExists,
    ErrorController.catchAsync(SchoolController.inviteParent),
  );

export { router as schoolsRouter };
