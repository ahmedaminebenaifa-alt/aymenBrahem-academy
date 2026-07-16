import { Router } from 'express';
import * as controller from '../controllers/progress.controller.js';
import { verifyAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/courses/:courseId/progress', verifyAuth, controller.getCourseProgress);
router.post('/contents/:contentId/progress', verifyAuth, controller.markComplete);
router.delete('/contents/:contentId/progress', verifyAuth, controller.markIncomplete);

export default router;