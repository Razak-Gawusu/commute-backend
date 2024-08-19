import express from 'express';

import { ErrorController, UserController } from '@/controllers';
import { AuthMiddleware } from '@/middlewares';

const router = express.Router();

const { catchAsync } = ErrorController;
const { authenticate } = AuthMiddleware;
const { getUsers, deleteUser, getUser, getLoginUser } = UserController;

router.route('/').get(catchAsync(getUsers));
router.route('/me').get(authenticate, catchAsync(getLoginUser));
router.route('/:email').get(catchAsync(getUser)).delete(catchAsync(deleteUser));

export { router as usersRouter };
