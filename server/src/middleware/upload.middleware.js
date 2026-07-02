import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { ApiError } from '../utils/ApiError.js';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

// Ensure the upload directory exists at startup, not on first request
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    // Server-generated name — never derived from user input, so no path traversal
    // or collision risk. Original name is preserved separately in the DB (name field).
    const uniqueName = `${crypto.randomUUID()}.pdf`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const isPdfMime = file.mimetype === 'application/pdf';
  const isPdfExt = path.extname(file.originalname).toLowerCase() === '.pdf';

  if (!isPdfMime || !isPdfExt) {
    return cb(new ApiError(400, 'Only PDF files are allowed'));
  }
  cb(null, true);
};

export const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB max
  fileFilter,
});

// Translates Multer-specific errors (file too large, wrong field, etc.)
// and fileFilter's ApiError into consistent responses via next(err).
// Mount this immediately after upload.single(...) in the route.
export const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return next(new ApiError(400, 'File too large — max 20MB'));
    }
    return next(new ApiError(400, err.message));
  }
  next(err); // ApiError from fileFilter, or anything else, falls through to error.middleware.js
};