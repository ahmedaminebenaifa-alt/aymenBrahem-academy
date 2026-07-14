import { Router } from 'express';
import authRoutes from './auth.routes.js';
import courseRoutes from './course.routes.js';
import enrollmentRoutes from './enrollment.routes.js';
import userRoutes from './user.routes.js';
import notificationRoutes from './notification.routes.js';
import liveRoutes from './live.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import orderRoutes from './order.routes.js';
import courseStructureRoutes from './courseStructure.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/courses', courseRoutes);
router.use('/enrollments', enrollmentRoutes);
router.use('/users', userRoutes);
router.use('/notifications', notificationRoutes);
router.use('/live', liveRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/orders', orderRoutes);
router.use('/', courseStructureRoutes)

export default router;