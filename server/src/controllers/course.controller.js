import * as courseService from '../services/course.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// ==========================================
// 🌍 PUBLIC CONTROLLERS
// ==========================================

/**
 * Get a list of all published courses
 * Route: GET /api/courses
 */
export const listCourses = asyncHandler(async (req, res) => {
  const courses = await courseService.listPublishedCourses();
  res.status(200).json(courses);
});

/**
 * Get details of a specific course by ID
 * Route: GET /api/courses/:id
 */
export const getCourse = asyncHandler(async (req, res) => {
  const course = await courseService.getCourseById(req.params.id);
  res.status(200).json(course);
});


// ==========================================
// 🎓 STUDENT CONTROLLERS
// ==========================================

/**
 * Get all courses with enrollment status attached for the logged-in student
 * Route: GET /api/courses/student/catalog
 */
export const getStudentCatalog = asyncHandler(async (req, res) => {
  const userId = req.user.id; // Extracted from verifyAuth middleware
  const courses = await courseService.getStudentCourses(userId);
  res.status(200).json(courses);
});

/**
 * Get protected course content (files) for an enrolled student
 * Route: GET /api/courses/:id/content
 */
export const getCourseContent = asyncHandler(async (req, res) => {
  const courseId = req.params.id;
  const userId = req.user.id;
  
  const content = await courseService.getCourseContent(courseId, userId);
  res.status(200).json(content);
});


// ==========================================
// 🛡️ ADMIN CONTROLLERS
// ==========================================

/**
 * Create a new course
 * Route: POST /api/courses
 */
export const createCourse = asyncHandler(async (req, res) => {
  const course = await courseService.createCourse(req.body);
  res.status(201).json(course); // 201 Created
});

/**
 * Update an existing course
 * Route: PATCH /api/courses/:id
 */
export const updateCourse = asyncHandler(async (req, res) => {
  const course = await courseService.updateCourse(req.params.id, req.body);
  res.status(200).json(course);
});

/**
 * Delete a course permanently
 * Route: DELETE /api/courses/:id
 */
export const deleteCourse = asyncHandler(async (req, res) => {
  await courseService.deleteCourse(req.params.id);
  res.status(204).send(); // 204 No Content (standard for successful DELETE requests)
});

export const searchCourses = asyncHandler(async (req, res) => {
  const { q } = req.query;
  const isAdmin = req.user?.role === 'ADMIN';
  const results = await courseService.searchCourses(q, isAdmin);
  res.status(200).json({ status: 'success', data: results });
});