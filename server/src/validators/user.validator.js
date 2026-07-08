import { ApiError } from '../utils/ApiError.js';

export const validateCreateUser = (req, res, next) => {
  const { name, email, password, role } = req.body;

  if (!name || name.trim().length < 3) {
    return next(new ApiError(400, 'يجب أن يحتوي الاسم على 3 أحرف على الأقل')); // 👈 fixed
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return next(new ApiError(400, 'يرجى إدخال بريد إلكتروني صحيح')); // 👈 fixed
  }

  if (!password || password.length < 8) {
    return next(new ApiError(400, 'كلمة المرور يجب ألا تقل عن 8 أحرف')); // 👈 fixed
  }

  const validRoles = ['طالب', 'مدير النظام'];
  if (role && !validRoles.includes(role)) {
    return next(new ApiError(400, 'دور المستخدم المحدد غير صالح، اختر "طالب" أو "مدير النظام"')); // 👈 fixed
  }

  next();
};

export const validateUpdateProfile = (req, res, next) => {
  const { name, email, phoneNumber, birthDate } = req.body;

  if (name !== undefined && name.trim().length < 3) {
    return next(new ApiError(400, 'يجب أن يحتوي الاسم على 3 أحرف على الأقل'));
  }
  
  if (email !== undefined && email !== "") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return next(new ApiError(400, 'يرجى إدخال بريد إلكتروني صحيح'));
    }
  }

  // Changed: Now it only runs the Regex if phoneNumber has actual text in it
  if (phoneNumber && phoneNumber.trim() !== "" && !/^\+?[0-9\s-]{6,20}$/.test(phoneNumber)) {
    return next(new ApiError(400, 'رقم الهاتف غير صالح'));
  }
  
  // Changed: Now it only parses the date if birthDate has actual text in it
  if (birthDate && birthDate.trim() !== "" && isNaN(Date.parse(birthDate))) {
    return next(new ApiError(400, 'تاريخ الميلاد غير صالح'));
  }

  next();
};


export const validateChangePassword = (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword) {
    return next(new ApiError(400, 'يرجى إدخال كلمة المرور الحالية'));
  }
  if (!newPassword || newPassword.length < 8) {
    return next(new ApiError(400, 'كلمة المرور الجديدة يجب ألا تقل عن 8 أحرف'));
  }
  next();
};