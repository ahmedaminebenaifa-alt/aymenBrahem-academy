import * as progressService from '../services/progress.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getCourseProgress = asyncHandler(async (req, res) => {
  const completedIds = await progressService.getCourseProgress(req.user.id, req.params.courseId);
  res.status(200).json({ status: 'success', data: completedIds });
});

export const markComplete = asyncHandler(async (req, res) => {
  await progressService.markComplete(req.user.id, req.params.contentId);
  res.status(200).json({ status: 'success' });
});

export const markIncomplete = asyncHandler(async (req, res) => {
  await progressService.markIncomplete(req.user.id, req.params.contentId);
  res.status(200).json({ status: 'success' });
});