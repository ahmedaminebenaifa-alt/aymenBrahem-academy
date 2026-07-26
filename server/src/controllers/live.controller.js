import { WebhookReceiver } from 'livekit-server-sdk';
import * as liveService from '../services/live.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import prisma from '../config/db.js';

const receiver = new WebhookReceiver(
  process.env.LIVEKIT_API_KEY,
  process.env.LIVEKIT_API_SECRET
);

export const handleLiveKitWebhook = asyncHandler(async (req, res) => {
  let event;
  try {
    // req.body must be the raw Buffer, not JSON-parsed — see routes file
    event = await receiver.receive(req.body, req.get('Authorization'));
    console.log('LiveKit webhook received:', event.event, event.room?.name);
  } catch (err) {
    console.error('LiveKit webhook signature verification failed:', err.message);
    return res.status(401).json({ status: 'fail', message: 'Invalid webhook signature' });
  }

  switch (event.event) {
    case 'room_finished':
      await liveService.handleRoomFinishedWebhook(event.room.name);
      break;
    case 'room_started':
      // room already marked LIVE when admin hit "start" — nothing to do
      break;
    default:
      break;
  }

  res.status(200).send();
});

export const startLive = asyncHandler(async (req, res) => {
  const session = await liveService.createAndStartSession({
    hostId: req.user.id,
    title: req.body.title,
    courseId: req.body.courseId,
  });

  res.status(201).json({ status: 'success', session });
});

export const getLiveStatus = asyncHandler(async (req, res) => {
  const session = await liveService.getActiveSession();

  res.status(200).json({
    status: 'success',
    isActive: !!session,
    session: session
      ? {
          id: session.id,
          title: session.title,
          roomName: session.roomName,
          startedAt: session.startedAt,
          host: session.host,
        }
      : null,
  });
});

export const endLive = asyncHandler(async (req, res) => {
  const session = await liveService.getActiveSession();
  if (session) {
    await liveService.endSession(session.id);
  }

  res.status(200).json({ status: 'success', message: 'تم إنهاء البث المباشر بنجاح' });
});

export const getToken = asyncHandler(async (req, res) => {
  const session = await liveService.getActiveSession();
  if (!session) {
    return res.status(404).json({ status: 'fail', message: 'لا يوجد بث مباشر حاليًا' });
  }

  const fullUser = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { id: true, name: true, role: true },
  });

  const token = await liveService.generateLiveToken(fullUser, session.roomName);

  res.status(200).json({
    status: 'success',
    token,
    url: process.env.LIVEKIT_URL,
    roomName: session.roomName,
  });
});

export const raiseHand = asyncHandler(async (req, res) => {
  const { isRaised } = req.body;
  const session = await liveService.getActiveSession();
  
  if (!session) {
    return res.status(404).json({ status: 'fail', message: 'لا يوجد بث مباشر حالياً' });
  }

  await liveService.updateStudentHandStatus(session.roomName, req.user.id, isRaised);
  
  res.status(200).json({ status: 'success' });
});

export const approveMic = asyncHandler(async (req, res) => {
  const { identity } = req.body;
  const session = await liveService.getActiveSession();
  
  if (!session) {
    return res.status(404).json({ status: 'fail', message: 'لا يوجد بث مباشر حالياً' });
  }

  await liveService.grantMicPermission(session.roomName, identity);
  
  res.status(200).json({ status: 'success' });
});

export const kickUser = asyncHandler(async (req, res) => {
  const { identity } = req.body;
  const session = await liveService.getActiveSession();

  if (!session) {
    return res.status(404).json({ status: 'fail', message: 'لا يوجد بث مباشر حالياً' });
  }

  await liveService.kickParticipant(session.roomName, identity);
  res.status(200).json({ status: 'success' });
});

export const revokeMic = asyncHandler(async (req, res) => {
  const { identity } = req.body;
  const session = await liveService.getActiveSession();

  if (!session) {
    return res.status(404).json({ status: 'fail', message: 'لا يوجد بث مباشر حالياً' });
  }

  await liveService.revokeMicPermission(session.roomName, identity);
  res.status(200).json({ status: 'success' });
});



export const scheduleLive = asyncHandler(async (req, res) => {
  const session = await liveService.scheduleSession({
    hostId: req.user.id,
    title: req.body.title,
    courseId: req.body.courseId,
    scheduledAt: req.body.scheduledAt,
  });
  res.status(201).json({ status: 'success', session });
});

export const getSchedule = asyncHandler(async (req, res) => {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay()); // start of week (Sunday)
  weekStart.setHours(0, 0, 0, 0);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 7);

  const sessions = await liveService.getWeekSchedule(weekStart, weekEnd);
  res.status(200).json({ status: 'success', data: sessions });
});

export const startScheduled = asyncHandler(async (req, res) => {
  const session = await liveService.startScheduledSession(req.params.id);
  res.status(200).json({ status: 'success', session });
});

export const cancelScheduled = asyncHandler(async (req, res) => {
  await liveService.cancelScheduledSession(req.params.id);
  res.status(200).json({ status: 'success' });
});