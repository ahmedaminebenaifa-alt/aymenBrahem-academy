import prisma from '../config/db.js';

export const enrollInCourse = async (userId, courseId) => {
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course || !course.published) {
    throw new Error('Course not available');
  }

  const existing = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });
  if (existing) {
    throw new Error('Already enrolled in this course');
  }

  return prisma.enrollment.create({
    data: { userId, courseId },
  });
};

export const getMyEnrollments = (userId) => {
  return prisma.enrollment.findMany({
    where: { userId },
    include: { course: true },
  });
};

export const getCourseEnrollments = (courseId) => {
  return prisma.enrollment.findMany({
    where: { courseId },
    include: { user: { select: { id: true, name: true, email: true } } },
  });
};