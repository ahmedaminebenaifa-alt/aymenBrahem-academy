import prisma from '../config/db.js';

export const getRecentActivity = async (limit = 10) => {
  const [enrollments, publishedCourses, liveSessions] = await Promise.all([
    prisma.enrollment.findMany({
      orderBy: { enrolledAt: 'desc' },
      take: limit,
      include: {
        user: { select: { name: true } },
        course: { select: { title: true } },
      },
    }),
    prisma.course.findMany({
      where: { published: true },
      orderBy: { updatedAt: 'desc' },
      take: limit,
      select: { id: true, title: true, updatedAt: true },
    }),
    prisma.liveSession.findMany({
      where: { status: { in: ['LIVE', 'ENDED'] } },
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: { id: true, title: true, status: true, startedAt: true, endedAt: true, createdAt: true },
    }),
  ]);

  const items = [
    ...enrollments.map((e) => ({
      id: `enrollment-${e.id}`,
      type: 'ENROLLMENT',
      text: `${e.user.name || 'طالب'} سجّل في دورة: ${e.course.title}`,
      time: e.enrolledAt,
    })),
    ...publishedCourses.map((c) => ({
      id: `course-${c.id}`,
      type: 'COURSE_PUBLISHED',
      text: `تم نشر دورة: ${c.title}`,
      time: c.updatedAt,
    })),
    ...liveSessions.map((s) => ({
      id: `live-${s.id}`,
      type: s.status === 'LIVE' ? 'LIVE_STARTED' : 'LIVE_ENDED',
      text: s.status === 'LIVE' ? `بدأ بث مباشر: ${s.title}` : `انتهى بث مباشر: ${s.title}`,
      time: s.status === 'LIVE' ? s.startedAt : (s.endedAt || s.createdAt),
    })),
  ];

  return items
    .sort((a, b) => new Date(b.time) - new Date(a.time))
    .slice(0, limit);
};