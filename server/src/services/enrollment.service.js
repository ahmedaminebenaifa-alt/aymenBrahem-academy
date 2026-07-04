import prisma from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';

/**
 * Enroll a student in a course
 */
export const enrollInCourse = async (userId, courseId) => {
  // 1. Check if the course exists and is published
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course || !course.published) {
    throw new ApiError(404, 'Course not found or not available for enrollment');
  }

  // 2. Check if the user is already enrolled
  const existing = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });
  
  if (existing) {
    throw new ApiError(400, 'You are already enrolled in this course');
  }

  // Note: If you implement payments later, you would check `course.isFree` here 
  // and ensure payment was successful before creating this record.

  // 3. Create the enrollment
  return prisma.enrollment.create({
    data: { userId, courseId },
  });
};

/**
 * Get all courses a specific student is enrolled in ("My Learning" page)
 */
export const getMyEnrollments = (userId) => {
  return prisma.enrollment.findMany({
    where: { userId },
    include: { 
      course: {
        select: {
          id: true,
          title: true,
          coverImage: true,
          category: true,
          isFree: true,
          price: true,
          _count: { select: { files: true } },
          description: true
        }
      } 
    },
    orderBy: { enrolledAt: 'desc' } // Assuming you have an enrolledAt or createdAt field
  });
};

/**
 * Get all students enrolled in a specific course (Admin dashboard)
 */
export const getCourseEnrollments = (courseId) => {
  return prisma.enrollment.findMany({
    where: { courseId },
    include: { 
      user: { 
        select: { id: true, name: true, email: true } 
      } 
    },
  });
};