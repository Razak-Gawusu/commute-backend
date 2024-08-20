import express from 'express';

import { ErrorController, UserController } from '@/controllers';
import { AuthMiddleware, GenericMiddleware } from '@/middlewares';

const router = express.Router();

router
  .route('/')
  .get(
    ErrorController.catchAsync(AuthMiddleware.authenticate),
    ErrorController.catchAsync(
      GenericMiddleware.restrictTo('super_admin', 'admin'),
    ),
    ErrorController.catchAsync(UserController.getUsers),
  );
router
  .route('/me')
  .get(
    ErrorController.catchAsync(AuthMiddleware.authenticate),
    ErrorController.catchAsync(UserController.getLoginUser),
  );
router
  .route('/:email')
  .get(
    ErrorController.catchAsync(AuthMiddleware.authenticate),
    GenericMiddleware.restrictTo('admin', 'super_admin'),
    ErrorController.catchAsync(UserController.getUser),
  )
  .delete(
    ErrorController.catchAsync(AuthMiddleware.authenticate),
    GenericMiddleware.restrictTo('super_admin'),
    ErrorController.catchAsync(UserController.deleteUser),
  );

export { router as usersRouter };
