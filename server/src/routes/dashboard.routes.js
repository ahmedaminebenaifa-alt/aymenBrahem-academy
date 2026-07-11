import { Router } from 'express';
import * as dashboardController from '../controllers/dashboard.controller.js';
import { verifyAuth, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/recent-activity', verifyAuth, requireRole('ADMIN'), dashboardController.getRecentActivity);

export default router;