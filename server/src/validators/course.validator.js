import { z } from 'zod';
const courseCategoryEnum = z.enum(['QURAN', 'TAFSIR', 'FIQH', 'AQEEDAH', 'ARABIC', 'HADITH']);

export const createCourseSchema = z.object({
  title: z.string().trim().min(3, 'Title must be at least 3 characters'),
  description: z.string().trim().min(10, 'Description must be at least 10 characters'),
  category: courseCategoryEnum.nullable().optional(),
  isFree: z.boolean().default(true),
  price: z.number().positive('Price must be positive').nullable().optional(),
  coverImage: z.string().url('Cover image must be a valid URL').nullable().optional(),
  published: z.boolean().nullable().optional(),
}).refine(
  (data) => data.isFree || data.price !== undefined,
  { message: 'Price is required for paid courses', path: ['price'] }
);

export const updateCourseSchema = z.object({
  title: z.string().trim().min(3, 'Title must be at least 3 characters').optional(),
  description: z.string().trim().min(10, 'Description must be at least 10 characters').optional(),
  category: courseCategoryEnum.nullable().optional(),
  isFree: z.boolean().optional(),
  price: z.number().positive('Price must be positive').nullable().optional(),
  coverImage: z.string().url('Cover image must be a valid URL').nullable().optional(),
  published: z.boolean().nullable().optional(),
});

export const courseIdParamSchema = z.object({
  id: z.string().uuid('Invalid course id'),
});