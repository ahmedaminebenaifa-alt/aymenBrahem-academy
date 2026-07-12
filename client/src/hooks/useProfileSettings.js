import { useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export const useProfileSettings = () => {
  const { user, updateUser } = useAuth();

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [profileError, setProfileError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const updateProfile = async (profileData) => {
    setIsSavingProfile(true);
    setProfileError(null);
    setProfileSuccess(false);
    try {
    
      const { data } = await api.patch('/users/me', profileData);
      updateUser(data.data);
      setProfileSuccess(true);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'فشل تحديث البيانات';
      setProfileError(message);
      return { success: false, message };
    } finally {
      setIsSavingProfile(false);
    }
  };

  const uploadAvatar = async (file) => {
    setIsUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const { data } = await api.post('/users/me/avatar', formData, {
        headers: { 'Content-Type': undefined },
      });
      updateUser(data.data);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.error || 'فشل رفع الصورة' };
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const changePassword = async ({ currentPassword, newPassword }) => {
    setIsSavingPassword(true);
    setPasswordError(null);
    setPasswordSuccess(false);
    try {
      await api.patch('/users/me/password', { currentPassword, newPassword });
      setPasswordSuccess(true);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'فشل تغيير كلمة المرور';
      setPasswordError(message);
      return { success: false, message };
    } finally {
      setIsSavingPassword(false);
    }
  };

  return {
    user,
    updateProfile,
    changePassword,
    uploadAvatar,
    isSavingProfile,
    isSavingPassword,
    isUploadingAvatar,
    profileError,
    passwordError,
    profileSuccess,
    passwordSuccess,
  };
};