import prisma from '../config/db.js';


const GRACE_PERIOD_MS = 24 * 60 * 60 * 1000;

// Single source of truth for "is this notification currently visible."
// Used by both the student bell and the admin upcoming-announcements panel,
// so there's exactly one place that defines visibility rules, not two
// slightly-different queries that can drift apart.
const visibilityWhere = (now = new Date()) => ({
  AND: [
    { OR: [{ expiresAt: null }, { expiresAt: { gte: now } }] },
    { OR: [{ scheduledFor: null }, { scheduledFor: { lte: now } }] },
  ],
});

export const getNotificationsForUser = async (userId, limit = 20) => {
  const notifications = await prisma.notification.findMany({
    where: visibilityWhere(),
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      reads: { where: { userId } },
    },
  });

  return notifications.map((n) => ({
    id: n.id,
    type: n.type,
    title: n.title,
    message: n.message,
    link: n.link,
    scheduledFor: n.scheduledFor,
    createdAt: n.createdAt,
    isRead: n.reads.length > 0,
  }));
};

export const markAsRead = async (notificationId, userId) => {
  return prisma.notificationRead.upsert({
    where: { notificationId_userId: { notificationId, userId } },
    update: {},
    create: { notificationId, userId },
  });
};

export const markAllAsRead = async (userId) => {
  const notifications = await prisma.notification.findMany({
    where: visibilityWhere(),
    select: { id: true },
  });

  await prisma.$transaction(
    notifications.map((n) =>
      prisma.notificationRead.upsert({
        where: { notificationId_userId: { notificationId: n.id, userId } },
        update: {},
        create: { notificationId: n.id, userId },
      })
    )
  );

  return { message: 'تم تعليم جميع الإشعارات كمقروءة' };
};

export const createAnnouncement = ({ type, title, message, scheduledFor, link }) => {
  const scheduledDate = scheduledFor ? new Date(scheduledFor) : null;
  return prisma.notification.create({
    data: {
      type,
      title,
      message: message || null,
      link: link || null,
      scheduledFor: scheduledDate,
      expiresAt: scheduledDate ? new Date(scheduledDate.getTime() + GRACE_PERIOD_MS) : null,
    },
  });
};

// Admin's "upcoming" panel: notifications whose EVENT hasn't happened yet
// (scheduledFor still in the future) — intentionally different concept from
// student visibility (which is about the display window, not the event date).
export const getUpcomingAnnouncements = (limit = 10) => {
  return prisma.notification.findMany({
    where: {
      type: { in: ['ANNOUNCEMENT_LIVE', 'ANNOUNCEMENT_COURSE', 'ANNOUNCEMENT_GENERAL'] },
      scheduledFor: { gte: new Date() },
    },
    orderBy: { scheduledFor: 'asc' },
    take: limit,
  });
};

export const deleteExpiredNotifications = async () => {
  const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const result = await prisma.notification.deleteMany({
    where: { expiresAt: { lt: cutoff } },
  });
  return result.count;
};

export const updateAnnouncement = async (id, { type, title, message, scheduledFor, link }) => {
  const scheduledDate = scheduledFor ? new Date(scheduledFor) : null;
  return prisma.notification.update({
    where: { id },
    data: {
      type,
      title,
      message: message || null,
      link: link || null,
      scheduledFor: scheduledDate,
      expiresAt: scheduledDate ? new Date(scheduledDate.getTime() + GRACE_PERIOD_MS) : null,
    },
  });
};

export const deleteAnnouncement = async (id) => {
  return prisma.notification.delete({ where: { id } });
};