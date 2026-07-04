import { Router } from 'express';
import * as enrollmentController from '../controllers/enrollment.controller.js';
import { verifyAuth, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

// Protect all routes in this file with authentication
router.use(verifyAuth);

// ==========================================
// 🎓 STUDENT ROUTES
// ==========================================
// Enroll in a course
router.post('/', requireRole('STUDENT'), enrollmentController.enroll);

// View my own enrollments
router.get('/me', requireRole('STUDENT'), enrollmentController.myEnrollments);


// ==========================================
// 🛡️ ADMIN ROUTES
// ==========================================
// View all students enrolled in a specific course
router.get('/course/:courseId', requireRole('ADMIN'), enrollmentController.courseEnrollments);

export default router;