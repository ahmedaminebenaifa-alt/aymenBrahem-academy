import * as structureService from '../services/courseStructure.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

// ── Student ──
export const getStructure = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const { id: userId, role } = req.user;

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: { isFree: true },
  });
  if (!course) throw new ApiError(404, 'الدورة غير موجودة');

  if (role !== 'ADMIN' && !course.isFree) {
    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
    if (!enrollment) {
      throw new ApiError(403, 'يجب التسجيل في هذه الدورة للوصول إلى محتواها');
    }
  }

  const structure = await structureService.getCourseStructure(courseId);
  res.status(200).json({ status: 'success', data: structure });
});

// ── Admin ──
export const getStructureAdmin = asyncHandler(async (req, res) => {
  const structure = await structureService.getCourseStructureAdmin(req.params.courseId);
  res.status(200).json({ status: 'success', data: structure });
});

export const createSubCourse = asyncHandler(async (req, res) => {
  const subCourse = await structureService.createSubCourse(req.params.courseId, req.body);
  res.status(201).json({ status: 'success', data: subCourse });
});

export const updateSubCourse = asyncHandler(async (req, res) => {
  const subCourse = await structureService.updateSubCourse(req.params.id, req.body);
  res.status(200).json({ status: 'success', data: subCourse });
});

export const deleteSubCourse = asyncHandler(async (req, res) => {
  await structureService.deleteSubCourse(req.params.id);
  res.status(200).json({ status: 'success' });
});

export const moveSubCourse = asyncHandler(async (req, res) => {
  const { direction } = req.body;
  if (!['up', 'down'].includes(direction)) throw new ApiError(400, 'اتجاه غير صالح');
  await structureService.moveSubCourse(req.params.id, direction);
  res.status(200).json({ status: 'success' });
});

export const createTheme = asyncHandler(async (req, res) => {
  const theme = await structureService.createTheme(req.params.subCourseId, req.body);
  res.status(201).json({ status: 'success', data: theme });
});

export const updateTheme = asyncHandler(async (req, res) => {
  const theme = await structureService.updateTheme(req.params.id, req.body);
  res.status(200).json({ status: 'success', data: theme });
});

export const deleteTheme = asyncHandler(async (req, res) => {
  await structureService.deleteTheme(req.params.id);
  res.status(200).json({ status: 'success' });
});

export const moveTheme = asyncHandler(async (req, res) => {
  const { direction } = req.body;
  if (!['up', 'down'].includes(direction)) throw new ApiError(400, 'اتجاه غير صالح');
  await structureService.moveTheme(req.params.id, direction);
  res.status(200).json({ status: 'success' });
});

export const createContentBlock = asyncHandler(async (req, res) => {
  const content = await structureService.createContentBlock(req.params.themeId, req.body);
  res.status(201).json({ status: 'success', data: content });
});

export const updateContentBlock = asyncHandler(async (req, res) => {
  const content = await structureService.updateContentBlock(req.params.id, req.body);
  res.status(200).json({ status: 'success', data: content });
});

export const deleteContentBlock = asyncHandler(async (req, res) => {
  await structureService.deleteContentBlock(req.params.id);
  res.status(200).json({ status: 'success' });
});

export const moveContentBlock = asyncHandler(async (req, res) => {
  const { direction } = req.body;
  if (!['up', 'down'].includes(direction)) throw new ApiError(400, 'اتجاه غير صالح');
  await structureService.moveContentBlock(req.params.id, direction);
  res.status(200).json({ status: 'success' });
});