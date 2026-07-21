import { Router } from 'express';
import { register, login, me, refresh, logout, logoutAll } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { registerSchema, loginSchema } from '../validators/auth.validator.js';
import { verifyAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.post('/logout-all', verifyAuth, logoutAll);
router.get('/me', verifyAuth, me);

export default router;