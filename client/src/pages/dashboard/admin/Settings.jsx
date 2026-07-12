import { useState, useEffect } from 'react';
import { useProfileSettings } from '../../../hooks/useProfileSettings';

export default function AdminSettings() {
  const {
    user,
    updateProfile,
    changePassword,
    isSavingProfile,
    isSavingPassword,
    profileError,
    passwordError,
    profileSuccess,
    passwordSuccess,
  } = useProfileSettings();

  const [profileForm, setProfileForm] = useState({ name: '', email: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordMismatch, setPasswordMismatch] = useState(false);

  useEffect(() => {
    if (user) setProfileForm({ name: user.name || '', email: user.email || '' });
  }, [user]);

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    updateProfile(profileForm);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMismatch(true);
      return;
    }
    setPasswordMismatch(false);
    changePassword(passwordForm).then((res) => {
      if (res.success) {
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    });
  };

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h2 className="font-arabic font-bold text-2xl text-primary mb-1">الإعدادات</h2>
        <p className="text-on-surface-variant text-sm">إدارة معلومات حساب المدير وكلمة المرور</p>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-[4px] shadow-sm overflow-hidden border-t-2 border-t-tertiary">
        <div className="flex items-center gap-3 px-6 py-5 bg-surface-container-low/40 border-b border-outline-variant/20">
          <div className="w-1 h-5 bg-tertiary rounded-full" />
          <h3 className="font-arabic font-bold text-lg text-primary">البيانات الشخصية</h3>
        </div>

        <form onSubmit={handleProfileSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-bold text-on-surface mb-2">الاسم الكامل</label>
            <input
              type="text"
              value={profileForm.name}
              onChange={(e) => setProfileForm((p) => ({ ...p, name: e.target.value }))}
              className="w-full bg-surface-container-low/60 border border-outline-variant/30 rounded-[4px] px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-tertiary focus:ring-1 focus:ring-tertiary transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-on-surface mb-2">البريد الإلكتروني</label>
            <input
              type="email"
              value={profileForm.email}
              onChange={(e) => setProfileForm((p) => ({ ...p, email: e.target.value }))}
              className="w-full bg-surface-container-low/60 border border-outline-variant/30 rounded-[4px] px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-tertiary focus:ring-1 focus:ring-tertiary transition-all"
            />
          </div>

          {profileError && <p className="text-sm text-error font-bold">{profileError}</p>}
          {profileSuccess && <p className="text-sm text-primary font-bold">تم حفظ التغييرات بنجاح</p>}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSavingProfile}
              className="px-8 py-2.5 bg-primary text-on-primary rounded-[4px] font-bold text-sm hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {isSavingProfile && <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>}
              حفظ التغييرات
            </button>
          </div>
        </form>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-[4px] shadow-sm overflow-hidden border-t-2 border-t-tertiary">
        <div className="flex items-center gap-3 px-6 py-5 bg-surface-container-low/40 border-b border-outline-variant/20">
          <div className="w-1 h-5 bg-tertiary rounded-full" />
          <h3 className="font-arabic font-bold text-lg text-primary">تغيير كلمة المرور</h3>
        </div>

        <form onSubmit={handlePasswordSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-bold text-on-surface mb-2">كلمة المرور الحالية</label>
            <input
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm((p) => ({ ...p, currentPassword: e.target.value }))}
              className="w-full bg-surface-container-low/60 border border-outline-variant/30 rounded-[4px] px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-tertiary focus:ring-1 focus:ring-tertiary transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold text-on-surface mb-2">كلمة المرور الجديدة</label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))}
                className="w-full bg-surface-container-low/60 border border-outline-variant/30 rounded-[4px] px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-tertiary focus:ring-1 focus:ring-tertiary transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-on-surface mb-2">تأكيد كلمة المرور</label>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                className="w-full bg-surface-container-low/60 border border-outline-variant/30 rounded-[4px] px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-tertiary focus:ring-1 focus:ring-tertiary transition-all"
              />
            </div>
          </div>

          {passwordMismatch && <p className="text-sm text-error font-bold">كلمتا المرور غير متطابقتين</p>}
          {passwordError && <p className="text-sm text-error font-bold">{passwordError}</p>}
          {passwordSuccess && <p className="text-sm text-primary font-bold">تم تغيير كلمة المرور بنجاح</p>}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSavingPassword}
              className="px-8 py-2.5 bg-primary text-on-primary rounded-[4px] font-bold text-sm hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {isSavingPassword && <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>}
              تحديث كلمة المرور
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}