import express from 'express';

import { AuthController, ErrorController } from '@/controllers';
import { AuthMiddleware, GenericMiddleware } from '@/middlewares';
import {
  loginSchema,
  resetPasswordSchema,
  sendResetCodeSchema,
  signupSchema,
  verifyResetTokenSchema,
} from '@/utils';

const router = express.Router();

router.post(
  '/signup',
  GenericMiddleware.validateSchema(signupSchema),
  AuthMiddleware.userExists,
  ErrorController.catchAsync(AuthController.register),
);
router.post(
  '/login',
  GenericMiddleware.validateSchema(loginSchema),
  AuthMiddleware.validateLogin,
  ErrorController.catchAsync(AuthController.login),
);
router.post(
  '/send-reset-code',
  GenericMiddleware.validateSchema(sendResetCodeSchema),
  AuthMiddleware.checkForUser,
  ErrorController.catchAsync(AuthController.sendResetCode),
);
router.post(
  '/resend-reset-code',
  GenericMiddleware.validateSchema(sendResetCodeSchema),
  AuthMiddleware.checkForUser,
  ErrorController.catchAsync(AuthController.sendResetCode),
);

router.post(
  '/verify-reset-code',
  GenericMiddleware.validateSchema(verifyResetTokenSchema),
  ErrorController.catchAsync(AuthController.verifyResetCode),
);

router.post(
  '/reset-password',
  GenericMiddleware.validateSchema(resetPasswordSchema),
  AuthMiddleware.checkForUser,
  ErrorController.catchAsync(AuthController.resetPassword),
);

export { router as authRouter };
