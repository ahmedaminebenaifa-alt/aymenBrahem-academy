import { Router } from 'express';
import * as notificationController from '../controllers/notification.controller.js';
import { verifyAuth, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

router.use(verifyAuth);

router.get('/', notificationController.getMyNotifications);
router.patch('/:id/read', notificationController.readOne);
router.patch('/read-all', notificationController.readAll);
router.post('/announcements', verifyAuth, requireRole('ADMIN'), notificationController.createAnnouncement);
router.get('/announcements/upcoming', verifyAuth, requireRole('ADMIN'), notificationController.getUpcomingAnnouncements);
router.patch('/announcements/:id', verifyAuth, requireRole('ADMIN'), notificationController.updateAnnouncement);
router.delete('/announcements/:id', verifyAuth, requireRole('ADMIN'), notificationController.deleteAnnouncement);

export default router;