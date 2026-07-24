import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';
import { ApiError } from '../utils/ApiError.js';

const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'academy/images',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    // Cloudinary auto-generates a unique public_id by default — no need to
    // hand-roll one the way the old diskStorage filename function did.
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new ApiError(400, 'Only image files (JPEG, PNG, WEBP) are allowed!'), false);
  }
};

export const uploadImage = multer({
  storage: imageStorage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const handleImageUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return next(new ApiError(400, 'Image too large — max 5MB'));
    }
    return next(new ApiError(400, err.message));
  }
  next(err);
};