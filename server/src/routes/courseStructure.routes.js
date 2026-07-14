import { Router } from 'express';
import * as controller from '../controllers/courseStructure.controller.js';
import { verifyAuth, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

// Student — public read of published structure
router.get('/courses/:courseId/structure', verifyAuth, controller.getStructure);

// Admin — full tree + mutations
router.get('/courses/:courseId/structure/admin', verifyAuth, requireRole('ADMIN'), controller.getStructureAdmin);

router.post('/courses/:courseId/subcourses', verifyAuth, requireRole('ADMIN'), controller.createSubCourse);
router.patch('/subcourses/:id', verifyAuth, requireRole('ADMIN'), controller.updateSubCourse);
router.delete('/subcourses/:id', verifyAuth, requireRole('ADMIN'), controller.deleteSubCourse);
router.patch('/subcourses/:id/move', verifyAuth, requireRole('ADMIN'), controller.moveSubCourse);

router.post('/subcourses/:subCourseId/themes', verifyAuth, requireRole('ADMIN'), controller.createTheme);
router.patch('/themes/:id', verifyAuth, requireRole('ADMIN'), controller.updateTheme);
router.delete('/themes/:id', verifyAuth, requireRole('ADMIN'), controller.deleteTheme);
router.patch('/themes/:id/move', verifyAuth, requireRole('ADMIN'), controller.moveTheme);

router.post('/themes/:themeId/contents', verifyAuth, requireRole('ADMIN'), controller.createContentBlock);
router.patch('/contents/:id', verifyAuth, requireRole('ADMIN'), controller.updateContentBlock);
router.delete('/contents/:id', verifyAuth, requireRole('ADMIN'), controller.deleteContentBlock);
router.patch('/contents/:id/move', verifyAuth, requireRole('ADMIN'), controller.moveContentBlock);

export default router;