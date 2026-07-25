import { useState, useEffect } from 'react';
import { useProfileSettings } from '../../../hooks/useProfileSettings';
// IMPORT THE SIDEBAR HOOK
import { useSidebar } from '../../../context/SidebarContext'; 

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

  // Fetch the sidebar state
  const { isOpen } = useSidebar(); 

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
    <div className={`max-w-4xl mx-auto space-y-8 p-4 md:py-8 md:pl-8 transition-[padding] duration-500 ease-[cubic-bezier(0.2,1,0.2,1)] ${
      isOpen ? 'md:pr-[300px]' : 'md:pr-[120px]'
    }`}>
      
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <h2 className="font-display font-bold text-3xl text-primary tracking-tight">الإعدادات</h2>
        <p className="text-on-surface-variant text-base">إدارة معلومات حساب المدير، تفاصيل ملفك الشخصي، وإعدادات الأمان.</p>
      </div>

      {/* Profile Info Form */}
      <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-outline-variant/30 bg-surface-container-lowest">
          <span className="material-symbols-outlined text-primary text-xl">manage_accounts</span>
          <h3 className="font-display font-bold text-lg text-on-surface">البيانات الشخصية</h3>
        </div>

        <form onSubmit={handleProfileSubmit} className="p-6 md:p-8 space-y-6 bg-surface-container-lowest/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-on-surface-variant">الاسم الكامل</label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm((p) => ({ ...p, name: e.target.value }))}
                className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all hover:border-outline-variant"
                placeholder="أدخل اسمك الكامل"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-on-surface-variant">البريد الإلكتروني</label>
              <input
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm((p) => ({ ...p, email: e.target.value }))}
                className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all hover:border-outline-variant"
                placeholder="example@domain.com"
                dir="ltr"
              />
            </div>
          </div>

          {/* Feedback Messages */}
          {profileError && (
            <div className="flex items-center gap-2 p-4 bg-error/10 text-error rounded-xl border border-error/20">
              <span className="material-symbols-outlined text-lg">error</span>
              <p className="text-sm font-medium">{profileError}</p>
            </div>
          )}
          {profileSuccess && (
            <div className="flex items-center gap-2 p-4 bg-[#a4ceb5]/20 text-[#02422a] rounded-xl border border-[#a4ceb5]/40">
              <span className="material-symbols-outlined text-lg">check_circle</span>
              <p className="text-sm font-medium">تم حفظ التغييرات بنجاح</p>
            </div>
          )}

          <div className="flex justify-end pt-4 border-t border-outline-variant/20">
            <button
              type="submit"
              disabled={isSavingProfile}
              className="px-8 py-3 bg-primary text-on-primary rounded-xl font-bold text-sm shadow-sm hover:shadow-md hover:bg-primary/90 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[160px]"
            >
              {isSavingProfile ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">save</span>
                  حفظ التغييرات
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Security / Password Form */}
      <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl shadow-sm overflow-hidden mb-8">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-outline-variant/30 bg-surface-container-lowest">
          <span className="material-symbols-outlined text-primary text-xl">lock</span>
          <h3 className="font-display font-bold text-lg text-on-surface">الأمان وكلمة المرور</h3>
        </div>

        <form onSubmit={handlePasswordSubmit} className="p-6 md:p-8 space-y-6 bg-surface-container-lowest/50">
          <div className="space-y-2 max-w-md">
            <label className="block text-sm font-semibold text-on-surface-variant">كلمة المرور الحالية</label>
            <input
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm((p) => ({ ...p, currentPassword: e.target.value }))}
              className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all hover:border-outline-variant"
              placeholder="••••••••"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-on-surface-variant">كلمة المرور الجديدة</label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))}
                className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all hover:border-outline-variant"
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-on-surface-variant">تأكيد كلمة المرور الجديدة</label>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                className={`w-full bg-surface-container-lowest border rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none transition-all hover:border-outline-variant ${
                  passwordMismatch 
                    ? 'border-error focus:border-error focus:ring-2 focus:ring-error/20' 
                    : 'border-outline-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/20'
                }`}
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Feedback Messages */}
          {(passwordMismatch || passwordError) && (
            <div className="flex items-center gap-2 p-4 bg-error/10 text-error rounded-xl border border-error/20">
              <span className="material-symbols-outlined text-lg">error</span>
              <p className="text-sm font-medium">
                {passwordMismatch ? 'كلمتا المرور غير متطابقتين. يرجى التأكد والمحاولة مجدداً.' : passwordError}
              </p>
            </div>
          )}
          {passwordSuccess && (
            <div className="flex items-center gap-2 p-4 bg-[#a4ceb5]/20 text-[#02422a] rounded-xl border border-[#a4ceb5]/40">
              <span className="material-symbols-outlined text-lg">check_circle</span>
              <p className="text-sm font-medium">تم تحديث كلمة المرور بنجاح.</p>
            </div>
          )}

          <div className="flex justify-end pt-4 border-t border-outline-variant/20">
            <button
              type="submit"
              disabled={isSavingPassword || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
              className="px-8 py-3 bg-surface-container-high hover:bg-primary hover:text-on-primary text-on-surface rounded-xl font-bold text-sm shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[160px]"
            >
              {isSavingPassword ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                  جاري التحديث...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">key</span>
                  تحديث الأمان
                </>
              )}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}