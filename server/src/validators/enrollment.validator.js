import { z } from 'zod';

export const createEnrollmentSchema = z.object({
  courseId: z.string().uuid('Invalid course id'),
});

export const enrollmentIdParamSchema = z.object({
  id: z.string().uuid('Invalid enrollment id'),
});