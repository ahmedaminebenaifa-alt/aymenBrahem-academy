import * as courseFileService from '../services/courseFile.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

export const ensureCourseExists = asyncHandler(async (req, res, next) => {
  await courseFileService.courseExists(req.params.courseId);
  next();
});

export const uploadFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'No file uploaded');
  }

  // Validate the real file content BEFORE it ever reaches Cloudinary
  await courseFileService.verifyPdfContent(req.file.buffer);

  const result = await courseFileService.uploadBufferToCloudinary(
    req.file.buffer,
    req.file.originalname
  );

  const { courseId } = req.params;
  const file = await courseFileService.addFileToCourse(courseId, {
    name: req.file.originalname,
    url: result.secure_url,
    cloudinaryPublicId: result.public_id,
    order: req.body.order,
  });

  res.status(201).json(file);
});

export const deleteFile = asyncHandler(async (req, res) => {
  await courseFileService.removeFile(req.params.fileId);
  res.status(204).send();
});