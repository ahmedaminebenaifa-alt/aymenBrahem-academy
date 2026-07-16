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
export const getMyEnrollments = async (userId) => {
  const enrollments = await prisma.enrollment.findMany({
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
          files: { select: { url: true } },
          subCourses: {
            where: { published: true },
            select: {
              themes: {
                select: {
                  contents: { select: { id: true } },
                },
              },
            },
          },
        },
      },
    },
    orderBy: { enrolledAt: 'desc' },
  });

  const allContentIds = enrollments.flatMap((e) =>
    e.course.subCourses.flatMap((sc) => sc.themes.flatMap((t) => t.contents.map((c) => c.id)))
  );

  const completedRows = allContentIds.length
    ? await prisma.contentProgress.findMany({
        where: { userId, contentBlockId: { in: allContentIds } },
        select: { contentBlockId: true },
      })
    : [];
  const completedSet = new Set(completedRows.map((r) => r.contentBlockId));

  return enrollments.map((e) => {
    const contentIds = e.course.subCourses.flatMap((sc) =>
      sc.themes.flatMap((t) => t.contents.map((c) => c.id))
    );
    const totalLessons = contentIds.length;
    const completedLessons = contentIds.filter((id) => completedSet.has(id)).length;
    const pdfCount = e.course.files.filter((f) => f.url?.toLowerCase().endsWith('.pdf')).length;

    return {
      ...e.course,
      enrolledAt: e.enrolledAt,
      subCoursesCount: e.course.subCourses.length,
      lessonsCount: totalLessons,
      completedLessons,
      resourcesCount: pdfCount,
    };
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

