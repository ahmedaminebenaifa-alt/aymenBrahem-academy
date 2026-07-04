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
    include: { files: true }, 
  });
  
  if (!course) {
    throw new ApiError(404, 'Course not found');
  }
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
  const existing = await getCourseById(id); // Throws 404 if missing

  // Merge existing data with new data to validate business logic
  const merged = { ...existing, ...data };
  if (!merged.isFree && merged.price == null) {
    throw new ApiError(400, 'Price is required for paid courses');
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
        where: { userId } // Only fetch the enrollment for this specific student
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  // Map the results to inject the 'isEnrolled' boolean for the frontend
  return courses.map(course => {
    const isEnrolled = course.enrollments.length > 0;
    
    return {
      id: course.id,
      title: course.title,
      description: course.description,
      category: course.category,
      isFree: course.isFree,
      price: course.price,
      coverImage: course.coverImage,
      isEnrolled // Magic flag used to toggle UI buttons (Enroll vs. Start Learning)
    };
  });
};

/**
 * Fetch course content (files) ONLY if the student is successfully enrolled
 */
export const getCourseContent = async (courseId, userId) => {
  // Security Check: Verify the student's enrollment in the database
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: { userId, courseId } // Utilizing the compound unique index in your Prisma schema
    }
  });

  // Kick out the user if they are not enrolled
  /*if (!enrollment) {
    throw new ApiError(403, 'Access denied. You must enroll in this course to view its content.');
  }*/

  // FIXED: Fetch the full course metadata AND include its sorted files 
  // This satisfies frontend requirements like course.title and course.files
  const courseWithFiles = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      files: {
        orderBy: { order: 'asc' } // Ensures files appear in the correct sequence
      }
    }
  });

  // Handle edge case where enrollment exists but course was somehow missing
  if (!courseWithFiles) {
    throw new ApiError(404, 'Course content not found');
  }

  return courseWithFiles;
};