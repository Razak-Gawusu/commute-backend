import express from 'express';

import { ErrorController, SchoolController } from '@/controllers';
import { AuthMiddleware, GenericMiddleware } from '@/middlewares';
import { School, User } from '@/models';
import {
  addWardToParentSchema,
  inviteParentSchema,
  registerSchoolSchema,
} from '@/utils';
const router = express.Router();

router.param('school_id', GenericMiddleware.checkResource('school_id', School));
router.param('parent_id', GenericMiddleware.checkResource('parent_id', User));

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

router
  .route('/:parent_id/add-ward')
  .post(
    GenericMiddleware.validateSchema(addWardToParentSchema),
    AuthMiddleware.authenticate,
    GenericMiddleware.restrictTo('admin'),
    ErrorController.catchAsync(SchoolController.addWardToParent),
  );

export { router as schoolsRouter };
