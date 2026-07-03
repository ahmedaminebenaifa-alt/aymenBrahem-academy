import { Router } from 'express';
import authRoutes from './auth.routes.js';
import courseRoutes from './course.routes.js';
import enrollmentRoutes from './enrollment.routes.js';
import liveSessionRoutes from './liveSession.routes.js';
import userRoutes from './user.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/courses', courseRoutes); 
router.use('/enrollments', enrollmentRoutes);
router.use('/live', liveSessionRoutes); 
router.use('/users', userRoutes);

export default router;