import * as enrollmentService from '../services/enrollment.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Handle student enrollment request
 * Route: POST /api/enrollments
 */
export const enroll = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { courseId } = req.body;

  if (!courseId) {
    return res.status(400).json({ error: 'courseId is required' });
  }

  const enrollment = await enrollmentService.enrollInCourse(userId, courseId);
  res.status(201).json({ status: 'success', data: enrollment });
});

/**
 * Get the logged-in student's enrollments
 * Route: GET /api/enrollments/me
 */
export const myEnrollments = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const enrollments = await enrollmentService.getMyEnrollments(userId);
  res.status(200).json({ status: 'success', data: enrollments });
});

/**
 * Get all enrollments for a specific course (Admin only)
 * Route: GET /api/enrollments/course/:courseId
 */
export const courseEnrollments = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const enrollments = await enrollmentService.getCourseEnrollments(courseId);
  res.status(200).json({ status: 'success', data: enrollments });
});