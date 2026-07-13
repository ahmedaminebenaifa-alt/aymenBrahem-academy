import React, { useState, useEffect } from 'react';
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
  const [isAnimating, setIsAnimating] = useState(false);
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
    setIsAnimating(true);
    setTimeout(() => {
      setMode(newMode);
      setError('');
      setShowPassword(false);
      setIsAnimating(false);
    }, 300);
  };

  if (user) {
    return (
      <>
        <style>{`
          @keyframes glowAvatar {
            0%, 100% { box-shadow: 0 0 20px 0 var(--primary-fixed); }
            50% { box-shadow: 0 0 40px 10px var(--primary-fixed); }
          }
          @keyframes fadeUpAuth {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
        <section id="auth" className="py-32 relative overflow-hidden bg-[var(--surface)]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--primary)]/5 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute inset-0 pattern-overlay pointer-events-none opacity-30" />
          
          <div className="max-w-[1280px] mx-auto px-6 relative z-10">
            <div className="bg-[var(--surface-container-lowest)]/80 backdrop-blur-2xl rounded-3xl p-10 text-center border border-[var(--outline-variant)]/30 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] max-w-lg mx-auto relative overflow-hidden" style={{ animation: 'fadeUpAuth 0.8s ease-out forwards' }}>
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[var(--primary)] via-[var(--on-tertiary-container)] to-[var(--primary)] bg-[length:200%_auto] animate-[gradientFlow_3s_linear_infinite]" />
              
              <div className="relative w-24 h-24 mx-auto mb-8">
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-[var(--primary)]/30 animate-[spin_10s_linear_infinite]" />
                <div className="absolute inset-2 bg-gradient-to-br from-[var(--primary-fixed)] to-[var(--primary)]/20 rounded-full flex items-center justify-center text-[var(--primary)] shadow-inner" style={{ animation: 'glowAvatar 4s ease-in-out infinite' }}>
                  <span className="material-symbols-outlined text-5xl">
                    account_circle
                  </span>
                </div>
              </div>
              
              <h2 className="font-display text-3xl font-bold text-[var(--on-surface)] mb-3">
                مرحباً بك، <span className="text-[var(--primary)]">{user.name}</span>
              </h2>
              <p className="text-[var(--on-surface-variant)] mb-10 text-lg">
                أنت مسجل الدخول حالياً في منصة الأكاديمية.
              </p>
              
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="group relative w-full bg-[var(--primary)] text-[var(--on-primary)] py-4 rounded-xl font-bold shadow-[0_8px_20px_-6px_var(--primary)] hover:shadow-[0_12px_25px_-8px_var(--primary)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden"
                >
                  <span className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:animate-[shine_1s_ease-in-out]" />
                  <span className="material-symbols-outlined">dashboard</span>
                  الذهاب إلى لوحة التحكم
                </button>
                <button
                  onClick={logout}
                  className="w-full bg-transparent border border-[var(--outline-variant)] text-[var(--on-surface)] py-4 rounded-xl font-bold hover:bg-[var(--error)]/5 hover:text-[var(--error)] hover:border-[var(--error)]/30 transition-all duration-300"
                >
                  تسجيل الخروج
                </button>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <style>{`
        @keyframes formEntrance {
          from { opacity: 0; transform: translateY(30px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes formTransition {
          0% { opacity: 1; transform: scale(1); filter: blur(0px); }
          50% { opacity: 0; transform: scale(0.98); filter: blur(4px); }
          100% { opacity: 1; transform: scale(1); filter: blur(0px); }
        }
        @keyframes gradientFlow {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @keyframes floatElement {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-form-entrance {
          animation: formEntrance 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-form-transition {
          animation: formTransition 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
      `}</style>
      
      <section id="auth" className="py-32 relative overflow-hidden bg-[var(--surface)]">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--primary)]/5 rounded-full blur-[100px] pointer-events-none animate-[floatElement_8s_ease-in-out_infinite]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[var(--tertiary)]/5 rounded-full blur-[120px] pointer-events-none animate-[floatElement_10s_ease-in-out_infinite_reverse]" />
        <div className="absolute inset-0 pattern-overlay pointer-events-none opacity-30 mix-blend-overlay" />

        <div className="max-w-[1280px] mx-auto px-6 relative z-10">
          <div className={`bg-[var(--surface-container-lowest)]/80 backdrop-blur-xl rounded-[2rem] p-8 md:p-12 border border-[var(--outline-variant)]/40 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.1)] max-w-[460px] mx-auto relative overflow-hidden animate-form-entrance`}>
            
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[var(--primary)] via-[var(--on-tertiary-container)] to-[var(--primary)] bg-[length:200%_auto] animate-[gradientFlow_3s_linear_infinite]" />

            <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 scale-95 blur-sm' : 'opacity-100 scale-100 blur-0'}`}>
              <div className="text-center mb-10">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[var(--primary-fixed)] to-[var(--primary)]/10 rounded-2xl flex items-center justify-center text-[var(--primary)] mb-6 shadow-sm border border-[var(--primary)]/20 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                  <span className="material-symbols-outlined text-3xl">
                    {mode === 'login' ? 'vpn_key' : 'how_to_reg'}
                  </span>
                </div>
                <h2 className="font-display text-3xl font-bold text-[var(--on-surface)] mb-3">
                  {mode === 'login' ? 'تسجيل الدخول' : 'حساب جديد'}
                </h2>
                <p className="text-[var(--on-surface-variant)]">
                  {mode === 'login'
                    ? 'مرحباً بعودتك إلى صرح العلم والمعرفة'
                    : 'انضم إلينا وابدأ رحلتك في طلب العلم'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {mode === 'register' && (
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[var(--outline)] group-focus-within:text-[var(--primary)] transition-colors duration-300 z-10">
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
                      className="w-full bg-[var(--surface-container-lowest)] border-2 border-[var(--outline-variant)]/50 rounded-xl py-4 pr-12 pl-4 text-right focus:outline-none focus:border-[var(--primary)] focus:bg-[var(--surface-container-lowest)] transition-all duration-300 disabled:opacity-60 relative z-0 hover:border-[var(--outline)] shadow-sm focus:shadow-md"
                    />
                  </div>
                )}

                <div className="relative group">
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[var(--outline)] group-focus-within:text-[var(--primary)] transition-colors duration-300 z-10">
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
                    dir="ltr"
                    className="w-full bg-[var(--surface-container-lowest)] border-2 border-[var(--outline-variant)]/50 rounded-xl py-4 pr-12 pl-4 text-left focus:outline-none focus:border-[var(--primary)] focus:bg-[var(--surface-container-lowest)] transition-all duration-300 disabled:opacity-60 relative z-0 hover:border-[var(--outline)] shadow-sm focus:shadow-md"
                  />
                </div>

                <div className="relative group">
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[var(--outline)] group-focus-within:text-[var(--primary)] transition-colors duration-300 z-10">
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
                    dir="ltr"
                    className="w-full bg-[var(--surface-container-lowest)] border-2 border-[var(--outline-variant)]/50 rounded-xl py-4 pr-12 pl-12 text-left focus:outline-none focus:border-[var(--primary)] focus:bg-[var(--surface-container-lowest)] transition-all duration-300 disabled:opacity-60 relative z-0 hover:border-[var(--outline)] shadow-sm focus:shadow-md"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    tabIndex={-1}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--outline)] hover:text-[var(--primary)] transition-colors duration-300 z-10 p-1 rounded-full hover:bg-[var(--primary)]/10"
                    aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>

                {mode === 'register' && (
                  <div className="flex items-center gap-2 text-xs text-[var(--outline)] px-1">
                    <span className="material-symbols-outlined text-[14px]">info</span>
                    <span>يجب أن تتكون كلمة المرور من 8 أحرف على الأقل</span>
                  </div>
                )}

                {error && (
                  <div className="bg-[var(--error)]/10 text-[var(--error)] p-4 rounded-xl text-sm flex items-start gap-3 border border-[var(--error)]/20 animate-[formEntrance_0.3s_ease-out]">
                    <span className="material-symbols-outlined text-lg shrink-0 mt-0.5">error</span>
                    <span className="leading-relaxed">{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative mt-4 w-full bg-[var(--primary)] text-[var(--on-primary)] py-4 rounded-xl font-bold shadow-[0_8px_20px_-6px_var(--primary)] hover:shadow-[0_12px_25px_-8px_var(--primary)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none overflow-hidden"
                >
                  {!isLoading && (
                    <span className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:animate-[shine_1s_ease-in-out]" />
                  )}
                  {isLoading ? (
                    <span className="material-symbols-outlined animate-spin text-[24px]">progress_activity</span>
                  ) : (
                    <>
                      {mode === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب'}
                      <span className="material-symbols-outlined text-[20px] transform group-hover:-translate-x-1 transition-transform">
                        arrow_back
                      </span>
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-[var(--outline-variant)]/40 flex items-center justify-center gap-2 text-sm text-[var(--on-surface-variant)]">
                <span>{mode === 'login' ? 'ليس لديك حساب؟' : 'لديك حساب بالفعل؟'}</span>
                <button
                  onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
                  disabled={isLoading}
                  className="font-bold text-[var(--primary)] hover:text-[var(--on-tertiary-container)] transition-colors duration-300 disabled:opacity-60 flex items-center gap-1 group/btn"
                >
                  {mode === 'login' ? 'سجل الآن' : 'تسجيل الدخول'}
                  <span className="material-symbols-outlined text-[16px] opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all duration-300">
                    arrow_back
                  </span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}