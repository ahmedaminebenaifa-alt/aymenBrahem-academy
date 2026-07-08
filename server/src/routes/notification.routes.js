import { Router } from 'express';
import * as notificationController from '../controllers/notification.controller.js';
import { verifyAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.use(verifyAuth);

router.get('/', notificationController.getMyNotifications);
router.patch('/:id/read', notificationController.readOne);
router.patch('/read-all', notificationController.readAll);

export default router;