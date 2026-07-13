import prisma from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';

/**
 * Enroll a student in a course
 */
export const enrollInCourse = async (userId, courseId) => {
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course || !course.published) {
    throw new ApiError(404, 'Course not found or not available for enrollment');
  }

  if (!course.isFree) {
    throw new ApiError(403, 'هذه الدورة مدفوعة، يجب إتمام عملية الشراء أولاً');
  }

  const existing = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });

  if (existing) {
    throw new ApiError(400, 'You are already enrolled in this course');
  }

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
          description: true,
          files: { select: { url: true } }
        }
      }
    },
    orderBy: { enrolledAt: 'desc' }
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

