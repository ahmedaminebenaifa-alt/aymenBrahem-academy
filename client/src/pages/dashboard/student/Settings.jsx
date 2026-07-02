import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';

export default function StudentSettings() {
  const { user } = useAuth();
  
  // State management for setting forms
  const [name, setName] = useState(user?.name || 'أيمن إبراهيم');
  const [email, setEmail] = useState(user?.email || 'aymen@academy.com');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSaveProfile = (e) => {
    e.preventDefault();
    alert('تم حفظ التغييرات بنجاح!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* --- Page Header --- */}
      <header className="border-b border-[var(--outline-variant)]/30 pb-6">
        <h1 className="font-display text-3xl font-bold text-[var(--primary)] mb-2 flex items-center gap-2">
          <span className="material-symbols-outlined text-3xl">settings</span>
          الإعدادات
        </h1>
        <p className="text-[var(--on-surface-variant)] text-sm">
          تعديل البيانات الشخصية، إدارة الحساب وتخصيص تفضيلاتك الأكاديمية.
        </p>
      </header>

      {/* --- Settings Form Container --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Side: Instructions / Meta */}
        <div className="space-y-2">
          <h2 className="font-display font-bold text-lg text-[var(--on-surface)]">الملف الشخصي</h2>
          <p className="text-xs text-[var(--on-surface-variant)] leading-relaxed">
            حدث معلوماتك الأساسية وعنوان بريدك الإلكتروني الذي تستخدمه لتلقي إشعارات الحلقات والدروس.
          </p>
        </div>

        {/* Right Side: Inputs (Matches 'Serene Scholarship' specification) */}
        <div className="md:col-span-2 bg-[var(--surface-container-lowest)] border border-[var(--outline-variant)]/30 p-6 rounded-lg shadow-sm">
          <form onSubmit={handleSaveProfile} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-[var(--on-surface-variant)] mb-2">الاسم الكامل</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[var(--surface-container-low)] border-none rounded-sm px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[var(--primary)] transition-all text-[var(--on-surface)]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--on-surface-variant)] mb-2">البريد الإلكتروني</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[var(--surface-container-low)] border-none rounded-sm px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[var(--primary)] transition-all text-[var(--on-surface)]"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button 
                type="submit" 
                className="bg-[var(--primary)] text-[var(--on-primary)] px-6 py-2 rounded-sm font-bold text-sm hover:bg-[var(--primary-container)] transition-colors shadow-sm"
              >
                حفظ التغييرات
              </button>
            </div>
          </form>
        </div>

      </div>

      {/* --- Divider --- */}
      <hr className="border-[var(--outline-variant)]/20" />

      {/* --- Security Section --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <div className="space-y-2">
          <h2 className="font-display font-bold text-lg text-[var(--on-surface)]">أمان الحساب</h2>
          <p className="text-xs text-[var(--on-surface-variant)] leading-relaxed">
            قم بتغيير كلمة المرور الخاصة بك بانتظام للحفاظ على سرية وأمان سجل تقدمك الدراسي.
          </p>
        </div>

        <div className="md:col-span-2 bg-[var(--surface-container-lowest)] border border-[var(--outline-variant)]/30 p-6 rounded-lg shadow-sm">
          <form onSubmit={(e) => { e.preventDefault(); alert('تم تحديث كلمة المرور!'); }} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-[var(--on-surface-variant)] mb-2">كلمة المرور الحالية</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[var(--surface-container-low)] border-none rounded-sm px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[var(--primary)] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--on-surface-variant)] mb-2">كلمة المرور الجديدة</label>
              <input 
                type="password" 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-[var(--surface-container-low)] border-none rounded-sm px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[var(--primary)] transition-all"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button 
                type="submit" 
                className="border border-[var(--outline)] text-[var(--primary)] px-6 py-2 rounded-sm font-bold text-sm hover:bg-[var(--surface-container-low)] transition-colors"
              >
                تحديث كلمة المرور
              </button>
            </div>
          </form>
        </div>

      </div>

    </div>
  );
}