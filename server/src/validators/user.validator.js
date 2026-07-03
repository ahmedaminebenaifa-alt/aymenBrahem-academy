import { ApiError } from '../utils/ApiError.js';

export const validateCreateUser = (req, res, next) => {
  const { name, email, password, role } = req.body;

  if (!name || name.trim().length < 3) {
    return next(new ApiError('يجب أن يحتوي الاسم على 3 أحرف على الأقل', 400));
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return next(new ApiError('يرجى إدخال بريد إلكتروني صحيح', 400));
  }

  if (!password || password.length < 6) {
    return next(new ApiError('كلمة المرور يجب ألا تقل عن 6 أحرف', 400));
  }

  const validRoles = ['طالب', 'مدير النظام'];
  if (role && !validRoles.includes(role)) {
    return next(new ApiError('دور المستخدم المحدد غير صالح، اختر "طالب" أو "مدير النظام"', 400));
  }

  next();
};