import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { ApiError } from '../utils/ApiError.js';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

// Ensure the upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Use the absolute path, just like your PDF middleware
    cb(null, UPLOAD_DIR); 
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    // Changed 'cover-' to 'img-' to be more generic, since you use this for avatars too
    cb(null, 'img-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    // Use your custom ApiError to keep error handling consistent
    cb(new ApiError(400, 'Only image files (JPEG, PNG, WEBP) are allowed!'), false);
  }
};

export const uploadImage = multer({ 
  storage, 
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // Optional: limit images to 5MB
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