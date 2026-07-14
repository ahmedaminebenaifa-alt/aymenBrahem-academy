import prisma from '../config/db.js';

export const getAdminStats = async () => {
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const twoMonthsAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  const [
    totalStudents,
    newStudentsThisMonth,
    newStudentsLastMonth,
    activeCourses,
    coursesInPrep,
    newEnrollments
  ] = await Promise.all([
    prisma.user.count({ where: { role: 'STUDENT' } }),
    prisma.user.count({ where: { role: 'STUDENT', createdAt: { gte: oneMonthAgo } } }),
    prisma.user.count({ where: { role: 'STUDENT', createdAt: { gte: twoMonthsAgo, lt: oneMonthAgo } } }),
    prisma.course.count({ where: { published: true } }),
    prisma.course.count({ where: { published: false } }),
    prisma.enrollment.count({ where: { enrolledAt: { gte: oneWeekAgo } } })
  ]);

  let studentsTrend = 0;
  if (newStudentsLastMonth > 0) {
    studentsTrend = Math.round(((newStudentsThisMonth - newStudentsLastMonth) / newStudentsLastMonth) * 100);
  } else if (newStudentsThisMonth > 0) {
    studentsTrend = 100;
  }

  return {
    totalStudents,
    studentsTrend,
    activeCourses,
    coursesInPrep,
    newEnrollments
  };
};

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