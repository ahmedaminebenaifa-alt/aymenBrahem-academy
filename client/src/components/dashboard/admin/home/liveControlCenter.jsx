import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useLiveSession from '../../../../hooks/useLiveSession';
import { useCourses } from '../../../../hooks/useCourses';

function useElapsed(startedAt) {
  const [elapsed, setElapsed] = useState('00:00');
  useEffect(() => {
    if (!startedAt) return;
    const start = new Date(startedAt).getTime();
    const tick = () => {
      const diff = Math.max(0, Date.now() - start);
      const m = String(Math.floor(diff / 60000)).padStart(2, '0');
      const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
      setElapsed(`${m}:${s}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [startedAt]);
  return elapsed;
}

const LiveControlCenter = () => {
  const navigate = useNavigate();
  const { isActive, title, startedAt, host, loading, error, startLive, endLive } = useLiveSession();
  const { courses } = useCourses();
  const publishedCourses = courses.filter((c) => c.published === true);

  const [formTitle, setFormTitle] = useState('');
  const [courseId, setCourseId] = useState('');
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [animateState, setAnimateState] = useState(false);
  const elapsed = useElapsed(startedAt);

  useEffect(() => {
    setTimeout(() => setAnimateState(true), 50);
  }, []);

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    if (type === 'success') {
      setTimeout(() => setFeedback({ type: '', message: '' }), 4000);
    }
  };

  const handleStart = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await startLive(formTitle.trim() || undefined, courseId || undefined);
      showFeedback('success', 'البث المباشر يعمل الآن!');
      setFormTitle('');
      setCourseId('');
    } catch (err) {
      showFeedback('error', err.response?.data?.message || 'فشل في بدء البث، يرجى المحاولة لاحقاً.');
    } finally {
      setBusy(false);
    }
  };

  const handleEnd = async () => {
    setBusy(true);
    try {
      await endLive();
      showFeedback('success', 'تم إيقاف البث بنجاح.');
    } catch (err) {
      showFeedback('error', err.response?.data?.message || 'فشل إيقاف البث');
    } finally {
      setBusy(false);
    }
  };

  const isLoading = loading || busy;

  return (
    <div className={`relative overflow-hidden rounded-[4px] border transition-all duration-700 ease-in-out transform-gpu will-change-transform ${
      isActive
        ? 'bg-primary-container text-on-primary p-10 shadow-md border-primary/40'
        : 'bg-surface-container-lowest border-outline-variant/30 p-10 shadow-sm'
    }`}>

      <div className={`absolute top-4 left-1/2 -translate-x-1/2 px-5 py-2.5 rounded-[4px] text-xs font-bold font-label flex items-center gap-2 shadow-lg transition-all duration-500 transform-gpu ease-out z-50 ${
        feedback.message
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 -translate-y-4 scale-95 pointer-events-none'
      } ${feedback.type === 'error' ? 'bg-red-700 text-white' : 'bg-emerald-700 text-white'}`}>
        <span className="material-symbols-outlined text-sm">
          {feedback.type === 'error' ? 'error' : 'check_circle'}
        </span>
        {feedback.message}
      </div>

      <div className={`transition-all duration-500 ease-out transform-gpu will-change-[opacity,transform] ${
        animateState ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }`}>

        {!isActive ? (
          <div className="flex flex-col items-center text-center relative z-10">
            <div className="absolute top-0 left-0 flex items-center gap-1.5 opacity-60">
              <span className="w-2 h-2 rounded-full bg-outline"></span>
              <span className="text-xs font-label text-on-surface-variant font-bold">غير متصل</span>
            </div>

            <h2 className="font-display font-bold text-3xl text-on-surface mt-4 mb-3">
              مركز التحكم في البث المباشر
            </h2>

            <p className="font-sans text-sm text-on-surface-variant mb-8 max-w-2xl leading-relaxed opacity-90">
              قم بتشغيل البث المباشر للأكاديمية. سيظهر تلقائياً لجميع الطلاب في لوحة التحكم الخاصة بهم فور تفعيله.
            </p>

            {error && (
              <p className="text-sm text-error bg-error/10 rounded-[4px] px-4 py-2 mb-4 max-w-md">{error}</p>
            )}

            <form onSubmit={handleStart} className="flex flex-col gap-4 w-full max-w-md mx-auto">
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="عنوان البث (مثال: شرح كتاب التوحيد - المجلس الرابع)"
                maxLength={100}
                className="w-full bg-surface-container-low border border-outline-variant/20 rounded-[4px] px-5 py-4 text-sm text-right focus:outline-none focus:border-primary/60 text-on-surface disabled:opacity-50 transition-all duration-300"
                disabled={isLoading}
              />

              {publishedCourses.length > 0 && (
                <select
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  disabled={isLoading}
                  className="w-full bg-surface-container-low border border-outline-variant/20 rounded-[4px] px-5 py-4 text-sm text-right focus:outline-none focus:border-primary/60 text-on-surface disabled:opacity-50 transition-all duration-300"
                >
                  <option value="">بث عام (بدون دورة محددة)</option>
                  {publishedCourses.map((c) => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="mt-4 bg-primary text-on-primary font-bold text-sm px-6 py-4 rounded-[4px] hover:bg-primary-container transition-all duration-300 ease-out flex items-center justify-center gap-3 w-full disabled:opacity-75 disabled:cursor-not-allowed shadow-sm active:scale-[0.99] transform-gpu"
              >
                {isLoading ? (
                  <span className="material-symbols-outlined text-xl animate-[spin_1.5s_linear_infinite] will-change-transform">progress_activity</span>
                ) : (
                  <span className="material-symbols-outlined text-xl">videocam</span>
                )}
                {isLoading ? 'جاري تهيئة الاتصال...' : 'بدء بث مباشر جديد'}
              </button>
            </form>
          </div>

        ) : (
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 text-center md:text-right">

              <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                <span className="bg-red-900/40 text-red-200 px-3 py-0.5 rounded-[4px] text-[10px] font-bold font-label tracking-wider border border-red-500/30">
                  LIVE · {elapsed}
                </span>
              </div>

              <h2 className="font-display font-bold text-3xl mb-3 leading-tight text-white drop-shadow-sm">
                {title}
              </h2>

              {host?.name && (
                <p className="text-sm opacity-80 mb-4">يقدمه: {host.name}</p>
              )}

              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <button
                  onClick={() => navigate('/live')}
                  disabled={isLoading}
                  className="bg-primary text-white px-8 py-4 rounded-[4px] font-bold text-sm flex items-center gap-3 hover:bg-primary-container transition-all duration-300 shadow-md active:scale-[0.99] transform-gpu"
                >
                  <span className="material-symbols-outlined">login</span>
                  الدخول إلى البث
                </button>

                <button
                  onClick={handleEnd}
                  disabled={isLoading}
                  className="bg-white text-red-950 px-8 py-4 rounded-[4px] font-bold text-sm flex items-center gap-3 hover:bg-surface transition-all duration-300 shadow-md active:scale-[0.99] transform-gpu disabled:opacity-80"
                >
                  {isLoading ? (
                    <span className="material-symbols-outlined animate-[spin_1.5s_linear_infinite]">progress_activity</span>
                  ) : (
                    <span className="material-symbols-outlined">videocam_off</span>
                  )}
                  {isLoading ? 'جاري إيقاف البث...' : 'إيقاف البث لجميع الطلاب'}
                </button>
              </div>
            </div>

            <div className="w-52 h-52 bg-white/5 rounded-full flex items-center justify-center border border-white/10 relative shrink-0 hidden md:flex shadow-inner transform-gpu">
              <div className="absolute inset-0 rounded-full border-t border-b border-primary-fixed/40 animate-[spin_6s_linear_infinite] transform-gpu will-change-transform"></div>
              <div className="absolute inset-4 rounded-full border-r border-l border-white/15 animate-[spin_4s_linear_infinite] [animation-direction:reverse] transform-gpu will-change-transform"></div>
              <span className="material-symbols-outlined text-6xl text-primary-fixed/90 drop-shadow-md animate-[pulse_3s_ease-in-out_infinite] will-change-opacity">
                podcasts
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveControlCenter;