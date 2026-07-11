import prisma from '../config/db.js';


const GRACE_PERIOD_MS = 24 * 60 * 60 * 1000;

export const createNotification = ({ type, title, message = null, link = null }) => {
  return prisma.notification.create({
    data: { type, title, message, link },
  });
};

export const getNotificationsForUser = async (userId, limit = 20) => {
  const notifications = await prisma.notification.findMany({
    where: {
      OR: [{ expiresAt: null }, { expiresAt: { gte: new Date() } }],
    },
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
  const notifications = await prisma.notification.findMany({ select: { id: true } });

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
      scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
      expiresAt: scheduledDate ? new Date(scheduledDate.getTime() + GRACE_PERIOD_MS) : null,
    },
  });
};

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