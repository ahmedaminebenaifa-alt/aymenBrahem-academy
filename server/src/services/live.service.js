
import { AccessToken } from 'livekit-server-sdk';
import { ApiError } from '../utils/ApiError.js';
import { RoomServiceClient } from 'livekit-server-sdk';
import prisma from '../config/db.js'; 



export const getActiveSession = async () => {
  return prisma.liveSession.findFirst({
    where: { status: 'LIVE' },
    include: { host: { select: { id: true, name: true } } },
  });
};

export const createAndStartSession = async ({ hostId, title, courseId }) => {
  // Guard: don't allow two lives at once
  const existing = await prisma.liveSession.findFirst({ where: { status: 'LIVE' } });
  if (existing) {
    throw new ApiError(409, 'يوجد بث مباشر قيد التشغيل بالفعل');
  }

  const roomName = `live-${Date.now()}`;

  return prisma.liveSession.create({
    data: {
      title: title || 'بث مباشر عام',
      roomName,
      status: 'LIVE',
      startedAt: new Date(),
      hostId,
      courseId: courseId || null,
    },
  });
};

export const endSession = async (sessionId) => {
  const session = await prisma.liveSession.findUnique({ where: { id: sessionId } });
  if (!session || session.status !== 'LIVE') {
    throw new ApiError(404, 'لا يوجد بث نشط لإنهائه');
  }

  return prisma.liveSession.update({
    where: { id: sessionId },
    data: { status: 'ENDED', endedAt: new Date() },
  });
};

export const generateLiveToken = async (user, roomName) => {
  if (!process.env.LIVEKIT_API_KEY || !process.env.LIVEKIT_API_SECRET) {
    throw new ApiError(500, 'LiveKit credentials are not configured');
  }

  const session = await prisma.liveSession.findFirst({
    where: { roomName, status: 'LIVE' },
  });
  if (!session) {
    throw new ApiError(404, 'هذا البث غير نشط حاليًا');
  }

  // Course-linked sessions require enrollment; general sessions (no courseId) are open to any logged-in user.
  // Admins always bypass this check.
  if (session.courseId && user.role !== 'ADMIN') {
    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: user.id, courseId: session.courseId } },
    });
    if (!enrollment) {
      throw new ApiError(403, 'يجب التسجيل في الدورة المرتبطة بهذا البث للانضمام إليه');
    }
  }

  const at = new AccessToken(process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_API_SECRET, {
    identity: user.id,
    name: user.name,
    ttl: '3h',
  });

  const isHost = user.role === 'ADMIN';

  at.addGrant({
    roomJoin: true,
    room: roomName,
    canPublish: isHost,
    canPublishData: isHost,
    canSubscribe: true,
    roomCreate: false,
  });

  return at.toJwt();
};

// Called from your webhook route when LiveKit tells you the room actually closed
// (covers cases where admin's browser crashes and endLive is never called)
export const handleRoomFinishedWebhook = async (roomName) => {
  await prisma.liveSession.updateMany({
    where: { roomName, status: 'LIVE' },
    data: { status: 'ENDED', endedAt: new Date() },
  });
};

const roomService = new RoomServiceClient(
  process.env.LIVEKIT_URL,
  process.env.LIVEKIT_API_KEY,
  process.env.LIVEKIT_API_SECRET
);

export const updateStudentHandStatus = async (roomName, identity, isRaised) => {
  const metadata = JSON.stringify({ handRaised: isRaised });
  return roomService.updateParticipant(roomName, identity, metadata);
};

export const grantMicPermission = async (roomName, identity) => {
  await roomService.updateParticipant(roomName, identity, undefined, {
    canPublish: true,
    canSubscribe: true,
    canPublishData: true,
  });
  
  return roomService.updateParticipant(roomName, identity, JSON.stringify({ handRaised: false }));
};

export const kickParticipant = async (roomName, identity) => {
  return roomService.removeParticipant(roomName, identity);
};

export const revokeMicPermission = async (roomName, identity) => {
  await roomService.updateParticipant(roomName, identity, undefined, {
    canPublish: false,
    canSubscribe: true,
    canPublishData: false,
  });
  return roomService.updateParticipant(roomName, identity, JSON.stringify({ handRaised: false }));
};


export const scheduleSession = async ({ hostId, title, courseId, scheduledAt }) => {
  return prisma.liveSession.create({
    data: {
      title: title || 'مجلس علم مجدول',
      roomName: `live-${Date.now()}`, // reserved now, actually used once it goes live
      status: 'SCHEDULED',
      scheduledAt: new Date(scheduledAt),
      hostId,
      courseId: courseId || null,
    },
  });
};

export const getWeekSchedule = async (weekStart, weekEnd) => {
  return prisma.liveSession.findMany({
    where: {
      status: { in: ['SCHEDULED', 'LIVE'] },
      scheduledAt: { gte: weekStart, lte: weekEnd },
    },
    include: {
      host: { select: { id: true, name: true } },
      course: { select: { id: true, title: true } },
    },
    orderBy: { scheduledAt: 'asc' },
  });
};

export const startScheduledSession = async (sessionId) => {
  const session = await prisma.liveSession.findUnique({ where: { id: sessionId } });
  if (!session || session.status !== 'SCHEDULED') {
    throw new ApiError(404, 'هذه الجلسة غير موجودة أو ليست مجدولة');
  }

  const existing = await prisma.liveSession.findFirst({ where: { status: 'LIVE' } });
  if (existing) {
    throw new ApiError(409, 'يوجد بث مباشر قيد التشغيل بالفعل');
  }

  return prisma.liveSession.update({
    where: { id: sessionId },
    data: { status: 'LIVE', startedAt: new Date() },
  });
};

export const cancelScheduledSession = async (sessionId) => {
  const session = await prisma.liveSession.findUnique({ where: { id: sessionId } });
  if (!session || session.status !== 'SCHEDULED') {
    throw new ApiError(404, 'هذه الجلسة غير موجودة أو ليست مجدولة');
  }
  return prisma.liveSession.update({
    where: { id: sessionId },
    data: { status: 'CANCELLED' },
  });
};