import { Router } from 'express';
import * as liveController from '../controllers/liveSession.controller.js';
import { verifyAuth, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', liveController.getCurrent);
router.post('/start', verifyAuth, requireRole('ADMIN'), liveController.start);
router.post('/end', verifyAuth, requireRole('ADMIN'), liveController.end);

export default router;