import { fileTypeFromBuffer } from 'file-type';
import cloudinary from '../config/cloudinary.js';
import prisma from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';

export const courseExists = async (courseId) => {
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) {
    throw new ApiError(404, 'Course not found');
  }
  return course;
};

// Verifies the file's actual binary signature matches PDF, not just its
// claimed mimetype/extension. Works on the in-memory buffer BEFORE anything
// is uploaded to Cloudinary — validation now happens before any external
// exposure, not after (an improvement over the old disk-based flow).
export const verifyPdfContent = async (buffer) => {
  const type = await fileTypeFromBuffer(buffer);

  if (!type || type.mime !== 'application/pdf') {
    throw new ApiError(400, 'Uploaded file is not a valid PDF');
  }
};

// Uploads an already-validated buffer to Cloudinary as a raw file.
export const uploadBufferToCloudinary = (buffer, originalName) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'academy/course-files',
        resource_type: 'raw',
        public_id: originalName.replace(/\.[^/.]+$/, ''), // strip extension, Cloudinary adds its own handling
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
};

export const addFileToCourse = async (courseId, { name, url, cloudinaryPublicId, order }) => {
  await courseExists(courseId);

  return prisma.courseFile.create({
    data: { courseId, name, url, cloudinaryPublicId, order: order ?? 0 },
  });
};

export const removeFile = async (fileId) => {
  const file = await prisma.courseFile.findUnique({ where: { id: fileId } });
  if (!file) {
    throw new ApiError(404, 'File not found');
  }

  await prisma.courseFile.delete({ where: { id: fileId } });

  if (file.cloudinaryPublicId) {
    try {
      await cloudinary.uploader.destroy(file.cloudinaryPublicId, { resource_type: 'raw' });
    } catch (err) {
      console.error(`Failed to delete file from Cloudinary: ${file.cloudinaryPublicId}`, err.message);
    }
  }

  return file;
};