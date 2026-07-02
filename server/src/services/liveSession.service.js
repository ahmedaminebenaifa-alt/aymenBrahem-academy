import prisma from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';

/**
 * Create a new live session link configuration
 */
export const createSession = async (data) => {
  return await prisma.liveSession.create({
    data: {
      title: data.title,
      link: data.link,
      isActive: data.isActive ?? false,
      startedAt: data.isActive ? new Date() : null,
    },
  });
};

/**
 * Fetch the currently active live session for students
 */
export const getActiveSession = async () => {
  return await prisma.liveSession.findFirst({
    where: { isActive: true },
  });
};

/**
 * Fetch all historical or scheduled sessions (Admin panel view)
 */
export const getAllSessions = async () => {
  return await prisma.liveSession.findMany({
    orderBy: { startedAt: 'desc' },
  });
};

/**
 * Update session details or toggle stream status on/off
 */
export const updateSession = async (id, data) => {
  const session = await prisma.liveSession.findUnique({ where: { id } });
  if (!session) {
    throw new ApiError(404, 'Live session not found');
  }

  const updateData = { ...data };
  
  // Clean State Management: If stream is being turned ON right now, stamp the time
  if (data.isActive === true && !session.isActive) {
    updateData.startedAt = new Date();
  }

  return await prisma.liveSession.update({
    where: { id },
    data: updateData,
  });
};

/**
 * Remove a live session config permanently
 */
export const deleteSession = async (id) => {
  const session = await prisma.liveSession.findUnique({ where: { id } });
  if (!session) {
    throw new ApiError(404, 'Live session not found');
  }
  
  return await prisma.liveSession.delete({ where: { id } });
};