import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AuthSection() {
  const { user, login, register, logout } = useAuth();
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(email, password, name);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'حدث خطأ في المصادقة، يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setError('');
    setShowPassword(false);
  };

  // --------------------------------------------------------
  // 1. LOGGED IN VIEW (Premium Dashboard Entry)
  // --------------------------------------------------------
  if (user) {
    return (
      <section id="auth" className="py-24 relative overflow-hidden bg-[var(--surface-container-low)]">
        <div className="absolute inset-0 pattern-overlay pointer-events-none opacity-50" />
        <div className="max-w-[1280px] mx-auto px-6 relative z-10">
          <div className="bg-[var(--surface-container-lowest)] rounded-2xl p-10 text-center border-t-4 border-t-[var(--primary)] shadow-xl max-w-lg mx-auto">
            <div className="w-20 h-20 mx-auto bg-[var(--primary-fixed)] rounded-full flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-4xl text-[var(--primary)]">
                account_circle
              </span>
            </div>
            <h2 className="font-display text-2xl font-bold text-[var(--primary)] mb-2">
              مرحباً بك، {user.name}
            </h2>
            <p className="text-[var(--on-surface-variant)] mb-8">
              أنت مسجل الدخول حالياً في منصة الأكاديمية.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full bg-[var(--primary)] text-[var(--on-primary)] py-3 rounded-xl font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">dashboard</span>
                الذهاب إلى لوحة التحكم
              </button>
              <button
                onClick={logout}
                className="w-full bg-transparent text-[var(--outline)] py-3 rounded-xl font-bold hover:bg-[var(--surface-container-high)] hover:text-[var(--on-surface)] transition-all"
              >
                تسجيل الخروج
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // --------------------------------------------------------
  // 2. LOGGED OUT VIEW (Professional Form)
  // --------------------------------------------------------
  return (
    <section id="auth" className="py-24 relative overflow-hidden bg-[var(--surface-container-low)]">
      <div className="absolute inset-0 pattern-overlay pointer-events-none opacity-50" />
      <div className="max-w-[1280px] mx-auto px-6 relative z-10">

        <div className="bg-[var(--surface-container-lowest)] rounded-3xl p-8 md:p-12 border border-[var(--outline-variant)]/30 shadow-2xl max-w-md mx-auto relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[var(--primary)] to-[var(--on-tertiary-container)]" />

          <div className="text-center mb-8">
            <h2 className="font-display text-3xl font-bold text-[var(--primary)] mb-3">
              {mode === 'login' ? 'تسجيل الدخول' : 'حساب جديد'}
            </h2>
            <p className="text-[var(--on-surface-variant)] text-sm">
              {mode === 'login'
                ? 'مرحباً بعودتك إلى صرح العلم والمعرفة'
                : 'انضم إلينا وابدأ رحلتك في طلب العلم'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {mode === 'register' && (
              <div className="relative">
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[var(--outline)]">
                  person
                </span>
                <input
                  type="text"
                  placeholder="الاسم الكامل"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isLoading}
                  autoComplete="name"
                  className="w-full bg-[var(--surface)] border border-[var(--outline-variant)] rounded-xl py-3 pr-12 pl-4 text-right focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all disabled:opacity-60"
                />
              </div>
            )}

            <div className="relative">
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[var(--outline)]">
                mail
              </span>
              <input
                type="email"
                placeholder="البريد الإلكتروني"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                autoComplete="email"
                className="w-full bg-[var(--surface)] border border-[var(--outline-variant)] rounded-xl py-3 pr-12 pl-4 text-right focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all text-left disabled:opacity-60"
                dir="ltr"
              />
            </div>

            <div className="relative">
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[var(--outline)]">
                lock
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                minLength={mode === 'register' ? 8 : undefined}
                className="w-full bg-[var(--surface)] border border-[var(--outline-variant)] rounded-xl py-3 pr-12 pl-12 text-right focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all text-left disabled:opacity-60"
                dir="ltr"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                tabIndex={-1}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--outline)] hover:text-[var(--on-surface)] transition-colors"
                aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
              >
                <span className="material-symbols-outlined text-xl">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>

            {mode === 'register' && (
              <p className="text-xs text-[var(--outline)] -mt-1 px-1">
                يجب أن تتكون كلمة المرور من 8 أحرف على الأقل
              </p>
            )}

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2 border border-red-100">
                <span className="material-symbols-outlined text-lg">error</span>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 w-full bg-[var(--primary)] text-[var(--on-primary)] py-3 rounded-xl font-bold hover:shadow-lg hover:opacity-95 active:scale-[0.98] transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="material-symbols-outlined animate-spin">progress_activity</span>
              ) : (
                mode === 'login' ? 'دخول' : 'إنشاء حساب'
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-[var(--on-surface-variant)] border-t border-[var(--outline-variant)]/30 pt-6">
            {mode === 'login' ? (
              <p>
                ليس لديك حساب؟{' '}
                <button
                  onClick={() => switchMode('register')}
                  disabled={isLoading}
                  className="text-[var(--on-tertiary-container)] font-bold hover:underline disabled:opacity-60"
                >
                  سجل الآن
                </button>
              </p>
            ) : (
              <p>
                لديك حساب بالفعل؟{' '}
                <button
                  onClick={() => switchMode('login')}
                  disabled={isLoading}
                  className="text-[var(--primary)] font-bold hover:underline disabled:opacity-60"
                >
                  تسجيل الدخول
                </button>
              </p>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}