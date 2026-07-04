import { Router } from 'express';
import * as courseController from '../controllers/course.controller.js';
import { verifyAuth, requireRole } from '../middleware/auth.middleware.js';
import { validate, validateParams } from '../middleware/validate.middleware.js';
import { createCourseSchema, updateCourseSchema, courseIdParamSchema } from '../validators/course.validator.js';
import courseFileRoutes from './courseFile.routes.js';
import { uploadImage, handleImageUploadError } from '../middleware/uploadImage.middleware.js';

const router = Router();

// ==========================================
// 🌍 PUBLIC ROUTES
// ==========================================
// List all published courses (No authentication required)
router.get('/', courseController.listCourses);


// ==========================================
// 🎓 STUDENT ROUTES (Static)
// ==========================================
// Get all courses with enrollment status for the logged-in student
router.get(
  '/student/catalog', 
  verifyAuth, 
  requireRole('STUDENT'), 
  courseController.getStudentCatalog // Make sure to export this in your controller!
);


// ==========================================
// 🛡️ ADMIN ROUTES (Static)
// ==========================================
// Upload course cover image
router.post(
  '/upload-cover', 
  verifyAuth, 
  requireRole('ADMIN'), 
  uploadImage.single('image'), 
  handleImageUploadError,
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.status(200).json({ imageUrl });
  }
);

// Admin course creation
router.post(
  '/', 
  verifyAuth, 
  requireRole('ADMIN'), 
  validate(createCourseSchema), 
  courseController.createCourse
);


// ==========================================
// 🔗 PARAMETRIC ROUTES (Must be at the bottom)
// ==========================================

// 1. Get specific course details (Public)
router.get(
  '/:id', 
  validateParams(courseIdParamSchema), 
  courseController.getCourse
);

// 2. Get protected course content/files (Student only - must be enrolled)
router.get(
  '/:id/content', 
  verifyAuth, 
  requireRole('STUDENT'), 
  validateParams(courseIdParamSchema), 
  courseController.getCourseContent // Make sure to export this in your controller!
);

// 3. Update course details (Admin only)
router.patch(
  '/:id', 
  verifyAuth, 
  requireRole('ADMIN'), 
  validateParams(courseIdParamSchema), 
  validate(updateCourseSchema), 
  courseController.updateCourse
);

// 4. Delete course (Admin only)
router.delete(
  '/:id', 
  verifyAuth, 
  requireRole('ADMIN'), 
  validateParams(courseIdParamSchema), 
  courseController.deleteCourse
);


// ==========================================
// 📁 NESTED ROUTES
// ==========================================
// Delegate all file-specific CRUD operations to the courseFile sub-router
router.use('/:courseId/files', courseFileRoutes);

export default router;