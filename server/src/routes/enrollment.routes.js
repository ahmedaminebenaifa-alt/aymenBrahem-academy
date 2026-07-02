import { Router } from 'express';
import * as enrollmentController from '../controllers/enrollment.controller.js';
import { verifyAuth, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/', verifyAuth, enrollmentController.enroll);
router.get('/me', verifyAuth, enrollmentController.myEnrollments);
router.get('/course/:courseId', verifyAuth, requireRole('ADMIN'), enrollmentController.courseEnrollments);

export default router;