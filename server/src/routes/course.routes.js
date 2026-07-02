import { Router } from 'express';
import * as courseController from '../controllers/course.controller.js';
import { verifyAuth, requireRole } from '../middleware/auth.middleware.js';
import { validate, validateParams } from '../middleware/validate.middleware.js';
import { createCourseSchema, updateCourseSchema, courseIdParamSchema } from '../validators/course.validator.js';
import courseFileRoutes from './courseFile.routes.js';

const router = Router();

// Public
router.get('/', courseController.listCourses);
router.get('/:id', validateParams(courseIdParamSchema), courseController.getCourse);

// Admin only
router.post('/', verifyAuth, requireRole('ADMIN'), validate(createCourseSchema), courseController.createCourse);
router.patch('/:id', verifyAuth, requireRole('ADMIN'), validateParams(courseIdParamSchema), validate(updateCourseSchema), courseController.updateCourse);
router.delete('/:id', verifyAuth, requireRole('ADMIN'), validateParams(courseIdParamSchema), courseController.deleteCourse);

router.use('/:courseId/files', courseFileRoutes);

export default router;