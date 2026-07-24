import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

const courseFileStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'academy/course-files',
    resource_type: 'raw', // PDFs aren't images — must be uploaded as 'raw', not the default 'image'
    allowed_formats: ['pdf'],
  },
});

export const uploadCourseFile = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF files are allowed'));
    }
    cb(null, true);
  },
});