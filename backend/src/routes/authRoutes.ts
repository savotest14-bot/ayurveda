import { Router } from 'express';
import { AuthController } from '../controllers/authController.js';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema
} from '../validators/authValidators.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/register', authLimiter, validate(registerSchema), AuthController.register);
router.post('/login', authLimiter, validate(loginSchema), AuthController.login);
router.post('/logout', AuthController.logout);
router.get('/me', authenticate, AuthController.getMe);
router.put('/profile', authenticate, validate(updateProfileSchema), AuthController.updateProfile);
router.put('/change-password', authenticate, validate(changePasswordSchema), AuthController.changePassword);

export default router;
