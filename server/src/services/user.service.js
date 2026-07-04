import prisma from '../config/db.js';
import bcrypt from 'bcrypt';
import { ApiError } from '../utils/ApiError.js';


export const createUser = async (userData) => {
  const { name, email, password, role } = userData;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new ApiError(400, 'البريد الإلكتروني مسجل بالفعل في المنصة'); // 👈 fixed order
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const newUser = await prisma.user.create({
    data: { name, email, password: hashedPassword, role: mapRoleToDatabase(role) },
  });

  return {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role: mapRoleToFrontend(newUser.role),
    joinDate: newUser.createdAt,
  };
};

export const deleteUserById = async (id) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new ApiError(404, 'لم يتم العثور على هذا المستخدم لحذفه'); // 👈 fixed order
  }
  await prisma.user.delete({ where: { id } });
  return { id, message: 'تم حذف المستخدم بنجاح من قاعدة البيانات' };
};


export const updateOwnProfile = async (userId, { name, email }) => {
  if (email) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing && existing.id !== userId) {
      throw new ApiError(409, 'البريد الإلكتروني مستخدم بالفعل من قبل حساب آخر');
    }
  }

  return prisma.user.update({
    where: { id: userId },
    data: {
      ...(name !== undefined && { name }),
      ...(email !== undefined && { email }),
    },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
};


export const changeOwnPassword = async (userId, { currentPassword, newPassword }) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new ApiError(404, 'المستخدم غير موجود');
  }

  const isValid = await bcrypt.compare(currentPassword, user.password);
  if (!isValid) {
    throw new ApiError(401, 'كلمة المرور الحالية غير صحيحة');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({ where: { id: userId }, data: { password: hashedPassword } });

  return { message: 'تم تغيير كلمة المرور بنجاح' };
};