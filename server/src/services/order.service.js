import prisma from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';

export const createOrder = async ({ userId, courseId, note }) => {
  const [course, existingEnrollment, existingPendingOrder] = await Promise.all([
    prisma.course.findUnique({ where: { id: courseId } }),
    prisma.enrollment.findUnique({ where: { userId_courseId: { userId, courseId } } }),
    prisma.order.findFirst({ where: { userId, courseId, status: 'PENDING' } }),
  ]);

  if (!course) throw new ApiError(404, 'الدورة غير موجودة');
  if (course.isFree) throw new ApiError(400, 'هذه الدورة مجانية، لا حاجة للشراء');
  if (existingEnrollment) throw new ApiError(409, 'أنت مسجل بالفعل في هذه الدورة');
  if (existingPendingOrder) throw new ApiError(409, 'لديك طلب شراء قيد الانتظار لهذه الدورة بالفعل');

  const order = await prisma.order.create({
    data: {
      userId,
      courseId,
      amount: course.price,
      method: 'MANUAL',
      status: 'PENDING',
      transferReference: note || null,
    },
  });

  return { order };
};

export const approveOrder = async (orderId, adminId) => {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new ApiError(404, 'طلب الشراء غير موجود');
  if (order.status !== 'PENDING') throw new ApiError(409, 'تمت معالجة هذا الطلب مسبقاً');

  await prisma.order.update({
    where: { id: orderId },
    data: { approvedById: adminId },
  });

  return prisma.$transaction(async (tx) => {
    const updatedOrder = await tx.order.update({
      where: { id: orderId },
      data: { status: 'PAID', paidAt: new Date() },
    });

    await tx.enrollment.upsert({
      where: { userId_courseId: { userId: order.userId, courseId: order.courseId } },
      update: {},
      create: { userId: order.userId, courseId: order.courseId },
    });

    return updatedOrder;
  });
};

export const rejectOrder = async (orderId, adminId) => {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order || order.status !== 'PENDING') {
    throw new ApiError(404, 'طلب الشراء غير موجود أو تمت معالجته');
  }

  return prisma.order.update({
    where: { id: orderId },
    data: { status: 'CANCELLED', approvedById: adminId },
  });
};

export const getMyOrders = (userId) => {
  return prisma.order.findMany({
    where: { userId },
    include: { course: { select: { title: true, coverImage: true } } },
    orderBy: { createdAt: 'desc' },
  });
};

export const getPendingOrders = () => {
  return prisma.order.findMany({
    where: { status: 'PENDING' },
    include: {
      user: { select: { name: true, email: true, phoneNumber: true } },
      course: { select: { title: true, price: true } },
    },
    orderBy: { createdAt: 'asc' },
  });
};

export const getOrderById = async (orderId, userId) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { course: { select: { title: true } } },
  });
  if (!order || order.userId !== userId) {
    throw new ApiError(404, 'الطلب غير موجود');
  }
  return order;
};