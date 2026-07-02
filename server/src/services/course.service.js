import prisma from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';

export const listPublishedCourses = () => {
  return prisma.course.findMany({
    where: { published: true },
    include: { files: true },
  });
};

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

export const createCourse = (data) => {
  return prisma.course.create({ data });
};

export const updateCourse = async (id, data) => {
  const existing = await getCourseById(id); // throws 404 if missing

  const merged = { ...existing, ...data };
  if (!merged.isFree && merged.price == null) {
    throw new ApiError(400, 'Price is required for paid courses');
  }

  return prisma.course.update({ where: { id }, data });
};

export const deleteCourse = async (id) => {
  await getCourseById(id);
  return prisma.course.delete({ where: { id } });
};