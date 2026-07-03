import prisma from '../config/db.js';
import bcrypt from 'bcrypt';
import { ApiError } from '../utils/ApiError.js';

const mapRoleToFrontend = (dbRole) => {
  return dbRole === 'ADMIN' ? 'مدير النظام' : 'طالب';
};

const mapRoleToDatabase = (frontendRole) => {
  return frontendRole === 'مدير النظام' ? 'ADMIN' : 'STUDENT';
};

export const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' }
  });

  return users.map(user => ({
    id: user.id,
    name: user.name || 'مستخدم غير مسمى',
    email: user.email,
    role: mapRoleToFrontend(user.role),
    joinDate: user.createdAt,
  }));
};

export const createUser = async (userData) => {
  const { name, email, password, role } = userData;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new ApiError('البريد الإلكتروني مسجل بالفعل في المنصة', 400);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: mapRoleToDatabase(role)
    }
  });

  return {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role: mapRoleToFrontend(newUser.role),
    joinDate: newUser.createdAt
  };
};

export const deleteUserById = async (id) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new ApiError('لم يتم العثور على هذا المستخدم لحذفه', 404);
  }

  await prisma.user.delete({ where: { id } });
  return { id, message: 'تم حذف المستخدم بنجاح من قاعدة البيانات' };
};