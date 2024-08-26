import express from 'express';

import { AuthController, ErrorController } from '@/controllers';
import { AuthMiddleware, GenericMiddleware } from '@/middlewares';
import {
  changePasswordSchema,
  createPasswrdSchema,
  loginSchema,
  resetPasswordSchema,
  sendResetCodeSchema,
  signupSchema,
  verifyResetCodeSchema,
} from '@/utils';

const router = express.Router();

router.post(
  '/register',
  GenericMiddleware.validateSchema(signupSchema),
  ErrorController.catchAsync(AuthMiddleware.userExists),
  ErrorController.catchAsync(AuthController.register),
);
router.post(
  '/login',
  GenericMiddleware.validateSchema(loginSchema),
  ErrorController.catchAsync(AuthMiddleware.validateLogin),
  ErrorController.catchAsync(AuthController.login),
);
router.post(
  '/send-reset-code',
  GenericMiddleware.validateSchema(sendResetCodeSchema),
  ErrorController.catchAsync(AuthMiddleware.checkForUser),
  ErrorController.catchAsync(AuthController.sendResetCode),
);

router.post(
  '/verify-reset-code',
  GenericMiddleware.validateSchema(verifyResetCodeSchema),
  ErrorController.catchAsync(AuthController.verifyResetCode),
);

router.patch(
  '/reset-password',
  GenericMiddleware.validateSchema(resetPasswordSchema),
  ErrorController.catchAsync(AuthMiddleware.checkForUser),
  ErrorController.catchAsync(AuthMiddleware.checkResetCode),
  ErrorController.catchAsync(AuthController.resetPassword),
);

router.patch(
  '/change-password',
  ErrorController.catchAsync(
    GenericMiddleware.validateSchema(changePasswordSchema),
  ),
  ErrorController.catchAsync(AuthMiddleware.authenticate),
  ErrorController.catchAsync(AuthController.changePassword),
);

router.post(
  '/create-password',
  ErrorController.catchAsync(
    GenericMiddleware.validateSchema(createPasswrdSchema),
  ),
  ErrorController.catchAsync(AuthMiddleware.authenticate),
  ErrorController.catchAsync(AuthController.createPassword),
);

export { router as authRouter };
