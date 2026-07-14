import prisma from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';

// ==========================================
// 🛡️ ADMIN & GENERAL COURSE OPERATIONS
// ==========================================

/**
 * Fetch all published courses (Public/General view)
 * Security Note: Removed 'include: { files: true }' to prevent data leakage 
 * so unauthorized users cannot access paid course content.
 */
export const listPublishedCourses = () => {
  return prisma.course.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' }
  });
};

/**
 * Get full course details by ID (Admin view)
 * This safely includes files since it's typically used by Admins or for course management.
 */
export const getCourseById = async (id) => {
  const course = await prisma.course.findUnique({
    where: { id },
    include: { files: true, subCourses: true },
  });
  if (!course) throw new ApiError(404, 'Course not found');
  return course;
};
/**
 * Create a new course
 */
export const createCourse = (data) => {
  return prisma.course.create({ data });
};

/**
 * Update an existing course
 */
export const updateCourse = async (id, data) => {
  const existing = await getCourseById(id); 

  const merged = { ...existing, ...data };
  if (!merged.isFree && merged.price == null) {
    throw new ApiError(400, 'Price is required for paid courses');
  }
  if (data.isFree === true) {
    data.price = null;
  }

  return prisma.course.update({ where: { id }, data });
};

/**
 * Delete a course permanently
 */
export const deleteCourse = async (id) => {
  await getCourseById(id); // Check if exists first
  return prisma.course.delete({ where: { id } });
};


// ==========================================
// 🎓 STUDENT SPECIFIC OPERATIONS
// ==========================================

/**
 * Fetch all published courses and attach the current student's enrollment status
 */
export const getStudentCourses = async (userId) => {
  const courses = await prisma.course.findMany({
    where: { published: true },
    include: {
      enrollments: {
        where: { userId }
      },
      files: {
        select: { url: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return courses.map(course => {
    const isEnrolled = course.enrollments.length > 0;
    const pdfCount = course.files.filter(f => f.url?.toLowerCase().endsWith('.pdf')).length;

    return {
      id: course.id,
      title: course.title,
      description: course.description,
      category: course.category,
      isFree: course.isFree,
      price: course.price,
      coverImage: course.coverImage, 
      isEnrolled,
      resourcesCount: pdfCount
    };
  });
};

/**
 * Fetch course content (files) ONLY if the student is successfully enrolled
 */
export const getCourseContent = async (courseId, userId) => {
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: { userId, courseId }
    }
  });

  if (!enrollment) {
    throw new ApiError(403, 'Access denied. You must enroll in this course to view its content.');
  }

  const courseWithFiles = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      files: {
        orderBy: { order: 'asc' }
      }
    }
  });

  if (!courseWithFiles) {
    throw new ApiError(404, 'Course content not found');
  }

  return courseWithFiles;
};

export const searchCourses = async (query, isAdmin) => {
  if (!query || query.trim().length < 2) return [];

  const where = {
    OR: [
      { title: { contains: query, mode: 'insensitive' } },
      { description: { contains: query, mode: 'insensitive' } },
    ],
    ...(isAdmin ? {} : { published: true }),
  };

  return prisma.course.findMany({
    where,
    select: {
      id: true,
      title: true,
      category: true,
      coverImage: true,
      isFree: true,
      price: true,
      published: true,
    },
    take: 8,
    orderBy: { createdAt: 'desc' },
  });
};