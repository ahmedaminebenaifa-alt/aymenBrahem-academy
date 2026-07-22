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
      enrollments: { where: { userId } },
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
    orderBy: { createdAt: 'desc' },
  });

  const allContentIds = courses.flatMap((c) =>
    c.subCourses.flatMap((sc) => sc.themes.flatMap((t) => t.contents.map((ct) => ct.id)))
  );

  const completedRows = allContentIds.length
    ? await prisma.contentProgress.findMany({
        where: { userId, contentBlockId: { in: allContentIds } },
        select: { contentBlockId: true },
      })
    : [];
  const completedSet = new Set(completedRows.map((r) => r.contentBlockId));

  return courses.map((course) => {
    const isEnrolled = course.enrollments.length > 0;
    const pdfCount = course.files.filter((f) => f.url?.toLowerCase().endsWith('.pdf')).length;
    const contentIds = course.subCourses.flatMap((sc) =>
      sc.themes.flatMap((t) => t.contents.map((ct) => ct.id))
    );
    const lessonsCount = contentIds.length;
    const completedLessons = contentIds.filter((id) => completedSet.has(id)).length;

    return {
      id: course.id,
      title: course.title,
      description: course.description,
      category: course.category,
      isFree: course.isFree,
      price: course.price,
      coverImage: course.coverImage,
      isEnrolled,
      subCoursesCount: course.subCourses.length,
      lessonsCount,
      completedLessons,
      resourcesCount: pdfCount,
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

  const words = query.trim().split(/\s+/).filter(Boolean);

  // Each word must appear SOMEWHERE in the course — title, description, or
  // anywhere in its SubCourse/Theme/ContentBlock tree — not necessarily the same spot.
  const wordMatchesAnywhere = words.map((word) => ({
    OR: [
      { title: { contains: word, mode: 'insensitive' } },
      { description: { contains: word, mode: 'insensitive' } },
      {
        subCourses: {
          some: {
            OR: [
              { title: { contains: word, mode: 'insensitive' } },
              {
                themes: {
                  some: {
                    OR: [
                      { title: { contains: word, mode: 'insensitive' } },
                      {
                        contents: {
                          some: {
                            OR: [
                              { title: { contains: word, mode: 'insensitive' } },
                              { body: { contains: word, mode: 'insensitive' } },
                            ],
                          },
                        },
                      },
                    ],
                  },
                },
              },
            ],
          },
        },
      },
    ],
  }));

  const courses = await prisma.course.findMany({
    where: {
      AND: wordMatchesAnywhere,
      ...(isAdmin ? {} : { published: true }),
    },
    select: {
      id: true,
      title: true,
      description: true,
      category: true,
      coverImage: true,
      isFree: true,
      price: true,
      published: true,
      subCourses: {
        where: isAdmin ? {} : { published: true },
        select: {
          title: true,
          themes: {
            select: {
              title: true,
              contents: { select: { title: true, body: true } },
            },
          },
        },
      },
    },
    take: 8,
    orderBy: { createdAt: 'desc' },
  });

  // Walk each course's tree to find WHERE the match actually is, for display purposes.
  // Checks title -> description -> subcourse titles -> theme titles -> content titles -> content bodies,
  // stopping at the first hit (title match is more relevant than a buried content match).
  const lowerWords = words.map((w) => w.toLowerCase());
  const containsAnyWord = (text) => !!text && lowerWords.some((w) => text.toLowerCase().includes(w));

  return courses.map((course) => {
    let matchLocation = 'title';
    let matchText = course.title;

    if (!containsAnyWord(course.title)) {
      if (containsAnyWord(course.description)) {
        matchLocation = 'description';
        matchText = course.description;
      } else {
        search:
        for (const sc of course.subCourses) {
          if (containsAnyWord(sc.title)) {
            matchLocation = 'subcourse';
            matchText = sc.title;
            break search;
          }
          for (const theme of sc.themes) {
            if (containsAnyWord(theme.title)) {
              matchLocation = 'theme';
              matchText = theme.title;
              break search;
            }
            for (const content of theme.contents) {
              if (containsAnyWord(content.title)) {
                matchLocation = 'content';
                matchText = content.title;
                break search;
              }
              if (containsAnyWord(content.body)) {
                matchLocation = 'content';
                matchText = content.body.slice(0, 120); // snippet, not the whole lesson body
                break search;
              }
            }
          }
        }
      }
    }

    return {
      id: course.id,
      title: course.title,
      category: course.category,
      coverImage: course.coverImage,
      isFree: course.isFree,
      price: course.price,
      published: course.published,
      matchLocation,
      matchText,
    };
  });
};

export const getPublicCourseOverview = async (courseId) => {
  const course = await prisma.course.findUnique({
    where: { id: courseId, published: true },
    select: {
      id: true,
      title: true,
      description: true,
      category: true,
      coverImage: true,
      isFree: true,
      price: true,
      subCourses: {
        where: { published: true },
        orderBy: { order: 'asc' },
        select: {
          id: true,
          title: true,
          themes: {
            orderBy: { order: 'asc' },
            select: { id: true, title: true }, // titles only — no contents/bodies
          },
        },
      },
      files: { select: { id: true } }, // count only, not actual URLs
    },
  });

  if (!course) {
    throw new ApiError(404, 'الدورة غير موجودة أو غير منشورة');
  }

  return {
    id: course.id,
    title: course.title,
    description: course.description,
    category: course.category,
    coverImage: course.coverImage,
    isFree: course.isFree,
    price: course.price,
    subCourses: course.subCourses,
    resourcesCount: course.files.length,
  };
};