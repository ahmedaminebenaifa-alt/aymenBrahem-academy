import prisma from '../config/db.js';

// All completed contentBlockIds for a user within one course — used to hydrate the player on load
export const getCourseProgress = async (userId, courseId) => {
  const rows = await prisma.contentProgress.findMany({
    where: {
      userId,
      contentBlock: { theme: { subCourse: { courseId } } },
    },
    select: { contentBlockId: true },
  });
  return rows.map((r) => r.contentBlockId);
};

export const markComplete = async (userId, contentBlockId) => {
  return prisma.contentProgress.upsert({
    where: { userId_contentBlockId: { userId, contentBlockId } },
    update: {},
    create: { userId, contentBlockId },
  });
};

export const markIncomplete = async (userId, contentBlockId) => {
  return prisma.contentProgress.deleteMany({
    where: { userId, contentBlockId },
  });
};