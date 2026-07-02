import path from 'path';
import * as courseFileService from '../services/courseFile.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

export const ensureCourseExists = asyncHandler(async (req, res, next) => {
  await courseFileService.courseExists(req.params.courseId);
  next();
});

export const uploadFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'No file uploaded');
  }

  const filePath = path.join(UPLOAD_DIR, req.file.filename);
  await courseFileService.verifyPdfContent(filePath); // throws + cleans up if not a real PDF

  const { courseId } = req.params;
  const fileUrl = `/uploads/${req.file.filename}`;

  const file = await courseFileService.addFileToCourse(courseId, {
    name: req.file.originalname,
    url: fileUrl,
    order: req.body.order,
  });

  res.status(201).json(file);
});

export const deleteFile = asyncHandler(async (req, res) => {
  await courseFileService.removeFile(req.params.fileId);
  res.status(204).send();
});