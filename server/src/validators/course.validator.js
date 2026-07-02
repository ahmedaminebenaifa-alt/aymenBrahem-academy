import { z } from 'zod';

export const createCourseSchema = z.object({
  title: z.string().trim().min(3, 'Title must be at least 3 characters'),
  description: z.string().trim().min(10, 'Description must be at least 10 characters'),
  isFree: z.boolean().default(true),
  price: z.number().positive('Price must be positive').optional(),
  coverImage: z.string().url('Cover image must be a valid URL').optional(),
  published: z.boolean().optional(),
}).refine(
  (data) => data.isFree || data.price !== undefined,
  { message: 'Price is required for paid courses', path: ['price'] }
);

export const updateCourseSchema = z.object({
  title: z.string().trim().min(3, 'Title must be at least 3 characters').optional(),
  description: z.string().trim().min(10, 'Description must be at least 10 characters').optional(),
  isFree: z.boolean().optional(),
  price: z.number().positive('Price must be positive').optional(),
  coverImage: z.string().url('Cover image must be a valid URL').optional(),
  published: z.boolean().optional(),
});

export const courseIdParamSchema = z.object({
  id: z.string().uuid('Invalid course id'),
});