import prisma from '../config/db.js';

// ── Student-facing: full published tree ──
export const getCourseStructure = async (courseId) => {
  const [subCourses, files] = await Promise.all([
    prisma.subCourse.findMany({
      where: { courseId, published: true },
      orderBy: { order: 'asc' },
      include: {
        themes: {
          orderBy: { order: 'asc' },
          include: {
            contents: { orderBy: { order: 'asc' } },
          },
        },
      },
    }),
    prisma.courseFile.findMany({
      where: { courseId },
      orderBy: { order: 'asc' },
    }),
  ]);

  return { subCourses, files };
};

// ── Admin-facing: full tree regardless of published state ──
export const getCourseStructureAdmin = async (courseId) => {
  return prisma.subCourse.findMany({
    where: { courseId },
    orderBy: { order: 'asc' },
    include: {
      themes: {
        orderBy: { order: 'asc' },
        include: {
          contents: { orderBy: { order: 'asc' } },
        },
      },
    },
  });
};

// ── SubCourse ──
export const createSubCourse = async (courseId, { title }) => {
  const count = await prisma.subCourse.count({ where: { courseId } });
  return prisma.subCourse.create({
    data: { courseId, title, order: count },
  });
};

export const updateSubCourse = (id, { title, published }) => {
  return prisma.subCourse.update({
    where: { id },
    data: { title, published },
  });
};

export const deleteSubCourse = (id) => {
  return prisma.subCourse.delete({ where: { id } });
};

export const moveSubCourse = async (id, direction) => {
  const current = await prisma.subCourse.findUnique({ where: { id } });
  if (!current) return null;

  const sibling = await prisma.subCourse.findFirst({
    where: {
      courseId: current.courseId,
      order: direction === 'up' ? { lt: current.order } : { gt: current.order },
    },
    orderBy: { order: direction === 'up' ? 'desc' : 'asc' },
  });
  if (!sibling) return current; // already at the edge, no-op

  await prisma.$transaction([
    prisma.subCourse.update({ where: { id: current.id }, data: { order: sibling.order } }),
    prisma.subCourse.update({ where: { id: sibling.id }, data: { order: current.order } }),
  ]);
  return true;
};

// ── Theme ──
export const createTheme = async (subCourseId, { title }) => {
  const count = await prisma.theme.count({ where: { subCourseId } });
  return prisma.theme.create({
    data: { subCourseId, title, order: count },
  });
};

export const updateTheme = (id, { title }) => {
  return prisma.theme.update({ where: { id }, data: { title } });
};

export const deleteTheme = (id) => {
  return prisma.theme.delete({ where: { id } });
};

export const moveTheme = async (id, direction) => {
  const current = await prisma.theme.findUnique({ where: { id } });
  if (!current) return null;

  const sibling = await prisma.theme.findFirst({
    where: {
      subCourseId: current.subCourseId,
      order: direction === 'up' ? { lt: current.order } : { gt: current.order },
    },
    orderBy: { order: direction === 'up' ? 'desc' : 'asc' },
  });
  if (!sibling) return current;

  await prisma.$transaction([
    prisma.theme.update({ where: { id: current.id }, data: { order: sibling.order } }),
    prisma.theme.update({ where: { id: sibling.id }, data: { order: current.order } }),
  ]);
  return true;
};

// ── ContentBlock ──
export const createContentBlock = async (themeId, { title, body }) => {
  const count = await prisma.contentBlock.count({ where: { themeId } });
  return prisma.contentBlock.create({
    data: { themeId, title, body: body || '', order: count },
  });
};

export const updateContentBlock = (id, { title, body }) => {
  return prisma.contentBlock.update({ where: { id }, data: { title, body } });
};

export const deleteContentBlock = (id) => {
  return prisma.contentBlock.delete({ where: { id } });
};

export const moveContentBlock = async (id, direction) => {
  const current = await prisma.contentBlock.findUnique({ where: { id } });
  if (!current) return null;

  const sibling = await prisma.contentBlock.findFirst({
    where: {
      themeId: current.themeId,
      order: direction === 'up' ? { lt: current.order } : { gt: current.order },
    },
    orderBy: { order: direction === 'up' ? 'desc' : 'asc' },
  });
  if (!sibling) return current;

  await prisma.$transaction([
    prisma.contentBlock.update({ where: { id: current.id }, data: { order: sibling.order } }),
    prisma.contentBlock.update({ where: { id: sibling.id }, data: { order: current.order } }),
  ]);
  return true;
};