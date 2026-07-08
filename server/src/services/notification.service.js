import prisma from '../config/db.js';

export const createNotification = ({ type, title, message = null, link = null }) => {
  return prisma.notification.create({
    data: { type, title, message, link },
  });
};

export const getNotificationsForUser = async (userId, limit = 20) => {
  const notifications = await prisma.notification.findMany({
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