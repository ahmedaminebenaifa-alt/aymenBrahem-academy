import { Router } from 'express';
import * as courseFileController from '../controllers/courseFile.controller.js';
import { verifyAuth, requireRole } from '../middleware/auth.middleware.js';
import { validate, validateParams } from '../middleware/validate.middleware.js';
import { upload, handleUploadError } from '../middleware/upload.middleware.js';
import {
  courseIdParamSchema,
  fileIdParamSchema,
  uploadFileBodySchema,
} from '../validators/courseFile.validator.js';

const router = Router({ mergeParams: true });

router.post(
  '/',
  verifyAuth,
  requireRole('ADMIN'),
  validateParams(courseIdParamSchema),
  courseFileController.ensureCourseExists,
  upload.single('file'),
  handleUploadError,
  validate(uploadFileBodySchema),
  courseFileController.uploadFile
);

router.delete(
  '/:fileId',
  verifyAuth,
  requireRole('ADMIN'),
  validateParams(fileIdParamSchema),
  courseFileController.deleteFile
);

export default router;