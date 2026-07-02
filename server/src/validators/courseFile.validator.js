import { z } from 'zod';

// courseId comes from the route, not the body — used with validateParams
export const courseIdParamSchema = z.object({
  courseId: z.string().uuid('Invalid course id'),
});

export const fileIdParamSchema = z.object({
  fileId: z.string().uuid('Invalid file id'),
});

// Only `order` arrives in the body; name/url are derived from the uploaded file itself.
// multipart/form-data sends everything as strings, so this coerces to a number.
export const uploadFileBodySchema = z.object({
  order: z.coerce.number().int().nonnegative('Order must be a non-negative integer').optional(),
});