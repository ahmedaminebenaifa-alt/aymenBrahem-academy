import prisma from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';

const OFFLINE_METHODS = ['MANUAL', 'BANK_TRANSFER', 'POSTAL_TRANSFER'];

export const createOrder = async ({ userId, courseId, method, transferReference }) => {
  if (!OFFLINE_METHODS.includes(method)) {
    throw new ApiError(400, 'طريقة الدفع غير متاحة');
  }

  const [course, existingEnrollment, existingPendingOrder] = await Promise.all([
    prisma.course.findUnique({ where: { id: courseId } }),
    prisma.enrollment.findUnique({ where: { userId_courseId: { userId, courseId } } }),
    prisma.order.findFirst({ where: { userId, courseId, status: 'PENDING' } }),
  ]);

  if (!course) throw new ApiError(404, 'الدورة غير موجودة');
  if (course.isFree) throw new ApiError(400, 'هذه الدورة مجانية، لا حاجة للشراء');
  if (existingEnrollment) throw new ApiError(409, 'أنت مسجل بالفعل في هذه الدورة');
  if (existingPendingOrder) throw new ApiError(409, 'لديك طلب شراء قيد الانتظار لهذه الدورة بالفعل');

  if (method !== 'MANUAL' && !transferReference) {
    throw new ApiError(400, 'يرجى إدخال رقم مرجع التحويل');
  }

  const order = await prisma.order.create({
    data: {
      userId,
      courseId,
      amount: course.price,
      method,
      status: 'PENDING',
      transferReference: transferReference || null,
    },
  });

  return { order };
};

export const approveManualOrder = async (orderId, adminId) => {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order || !OFFLINE_METHODS.includes(order.method)) {
    throw new ApiError(404, 'طلب الشراء غير موجود');
  }
  if (order.status !== 'PENDING') {
    throw new ApiError(409, 'تمت معالجة هذا الطلب مسبقاً');
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { approvedById: adminId },
  });

  return completeOrder(orderId);
};

export const rejectManualOrder = async (orderId, adminId) => {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order || order.status !== 'PENDING') {
    throw new ApiError(404, 'طلب الشراء غير موجود أو تمت معالجته');
  }

  return prisma.order.update({
    where: { id: orderId },
    data: { status: 'CANCELLED', approvedById: adminId },
  });
};

const completeOrder = async (orderId) => {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.update({
      where: { id: orderId },
      data: { status: 'PAID', paidAt: new Date() },
    });

    await tx.enrollment.upsert({
      where: { userId_courseId: { userId: order.userId, courseId: order.courseId } },
      update: {},
      create: { userId: order.userId, courseId: order.courseId },
    });

    return order;
  });
};

export const getMyOrders = (userId) => {
  return prisma.order.findMany({
    where: { userId },
    include: { course: { select: { title: true, coverImage: true } } },
    orderBy: { createdAt: 'desc' },
  });
};

export const getPendingManualOrders = () => {
  return prisma.order.findMany({
    where: { method: { in: OFFLINE_METHODS }, status: 'PENDING' },
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