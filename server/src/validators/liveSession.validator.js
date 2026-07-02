import { z } from 'zod';

export const createLiveSessionSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').optional(),
  link: z.string().url('Link must be a valid URL'),
  isActive: z.boolean().optional(),
  startedAt: z.coerce.date().optional(),
});

export const liveSessionIdParamSchema = z.object({
  id: z.string().uuid('Invalid live session id'),
});