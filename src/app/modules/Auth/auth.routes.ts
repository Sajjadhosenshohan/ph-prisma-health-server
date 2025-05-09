import express from 'express';
import { AuthController } from './auth.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';

const router = express.Router();

router.post(
    '/login',
    AuthController.loginUser
);

router.post(
    '/refresh-token',
    AuthController.refreshToken
)


router.post('/change-password',auth(UserRole.ADMIN, UserRole.SUPER_ADMIN,UserRole.DOCTOR, UserRole.PATIENT), AuthController.changePasswordFromDB);


router.post('/forgot-password', AuthController.forgetPasswordFromDB);
router.post('/reset-password', AuthController.resetPasswordFromDB);

export const AuthRoutes = router;