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
router.get('/', courseController.listCourses);

// ==========================================
// 🔍 SEARCH (Static — must come before any /:id route)
// ==========================================
router.get('/search', verifyAuth, courseController.searchCourses);

// ==========================================
// 🎓 STUDENT ROUTES (Static)
// ==========================================
router.get(
  '/student/catalog',
  verifyAuth,
  requireRole('STUDENT'),
  courseController.getStudentCatalog
);

// ==========================================
// 🛡️ ADMIN ROUTES (Static)
// ==========================================
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

router.get(
  '/:id',
  validateParams(courseIdParamSchema),
  courseController.getCourse
);

router.get(
  '/:id/content',
  verifyAuth,
  requireRole('STUDENT'),
  validateParams(courseIdParamSchema),
  courseController.getCourseContent
);

router.patch(
  '/:id',
  verifyAuth,
  requireRole('ADMIN'),
  validateParams(courseIdParamSchema),
  validate(updateCourseSchema),
  courseController.updateCourse
);

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
router.use('/:courseId/files', courseFileRoutes);

export default router;