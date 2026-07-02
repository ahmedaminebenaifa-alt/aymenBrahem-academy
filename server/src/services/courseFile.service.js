import fs from 'fs/promises';
import path from 'path';
import { fileTypeFromFile } from 'file-type';
import prisma from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

export const courseExists = async (courseId) => {
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) {
    throw new ApiError(404, 'Course not found');
  }
  return course;
};

// Verifies the file's actual binary signature matches PDF, not just its
// claimed mimetype/extension. Deletes the file from disk if it fails.
export const verifyPdfContent = async (filePath) => {
  const type = await fileTypeFromFile(filePath);

  if (!type || type.mime !== 'application/pdf') {
    await fs.unlink(filePath).catch(() => {}); // best-effort cleanup
    throw new ApiError(400, 'Uploaded file is not a valid PDF');
  }
};

export const addFileToCourse = async (courseId, { name, url, order }) => {
  await courseExists(courseId);

  return prisma.courseFile.create({
    data: { courseId, name, url, order: order ?? 0 },
  });
};

export const removeFile = async (fileId) => {
  const file = await prisma.courseFile.findUnique({ where: { id: fileId } });
  if (!file) {
    throw new ApiError(404, 'File not found');
  }

  await prisma.courseFile.delete({ where: { id: fileId } });

  try {
    const filename = path.basename(file.url);
    await fs.unlink(path.join(UPLOAD_DIR, filename));
  } catch (err) {
    console.error(`Failed to delete file from disk: ${file.url}`, err.message);
  }

  return file;
};