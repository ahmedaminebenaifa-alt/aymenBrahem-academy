import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useLiveSession from '../../hooks/useLiveSession';
import { useAuth } from '../../context/AuthContext';
import { useCourses } from '../../hooks/useCourses';
import SchedulePlanner from '../dashboard/admin/live/SchedulePlanner'

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

export default function LiveWidget() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'ADMIN';

  const { isActive, title, startedAt, host, loading, error, startLive, endLive } = useLiveSession();
  const { courses, isLoading: coursesLoading } = useCourses();
  const publishedCourses = courses.filter((c) => c.published === true);

  const [formTitle, setFormTitle] = useState('');
  const [courseId, setCourseId] = useState('');
  const [starting, setStarting] = useState(false);
  const elapsed = useElapsed(startedAt);

  const handleStart = async () => {
    setStarting(true);
    try {
      await startLive(formTitle.trim() || undefined, courseId || undefined);
      navigate('/live');
    } catch {
      // error already captured in hook state, shown below
    } finally {
      setStarting(false);
    }
  };

  const handleEnd = async () => {
    if (!window.confirm('هل أنت متأكد من إنهاء البث المباشر؟')) return;
    await endLive();
  };

  // Subtle background pattern component to reuse
  const WidgetBackground = () => (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-2xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(212,175,55,0.08)_0%,transparent_70%)]" />
      <svg width="100%" height="100%" className="absolute inset-0 opacity-[0.05]">
        <defs>
          <pattern id="widget-pattern" width="60" height="60" patternUnits="userSpaceOnUse" patternTransform="scale(1.5)">
            <g stroke="#d4af37" fill="none">
              <path strokeWidth="0.5" d="M30 0 L37.5 12.5 L50 12.5 L42.5 22.5 L47.5 35 L30 27.5 L12.5 35 L17.5 22.5 L10 12.5 L22.5 12.5 Z" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#widget-pattern)" />
      </svg>
    </div>
  );

  // -------------------- LOADING STATE --------------------
  if (loading) {
    return (
      <div className="relative bg-[#023321] rounded-2xl shadow-sm border border-[#d4af37]/10 p-6 animate-pulse overflow-hidden">
        <WidgetBackground />
        <div className="relative z-10 flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-[#02422a] border border-[#d4af37]/20 rounded-full" />
          <div className="space-y-2 flex-1">
            <div className="h-4 w-1/3 bg-[#02422a] rounded" />
            <div className="h-3 w-1/4 bg-[#02422a] rounded" />
          </div>
        </div>
        <div className="relative z-10 h-12 w-full bg-[#02422a] rounded-xl" />
      </div>
    );
  }

  // -------------------- ADMIN VIEW --------------------
  if (isAdmin) {
    return (
      <div className="relative bg-[#023321] rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.2)] border border-[#d4af37]/20 overflow-hidden transition-all duration-300">
        <WidgetBackground />
        
        {/* Header section */}
        <div className={`relative z-10 px-6 py-4 border-b border-[#d4af37]/10 flex items-center justify-between ${isActive ? 'bg-[#d4af37]/5' : 'bg-transparent'}`}>
          <div className="flex items-center gap-3">
            <div className={`flex items-center justify-center w-10 h-10 rounded-xl border ${isActive ? 'bg-[#d4af37]/20 border-[#d4af37]/30 text-[#d4af37]' : 'bg-[#02422a] border-[#d4af37]/10 text-[#a4ceb5]'}`}>
              <span className="material-symbols-outlined text-xl">
                {isActive ? 'podcasts' : 'settings_input_antenna'}
              </span>
            </div>
            <div>
              <h3 className="font-bold text-[#e8dbb7] text-base">إدارة البث المباشر</h3>
              <p className="text-xs text-[#a4ceb5]">{isActive ? 'بث مباشر قيد التشغيل' : 'إعداد مجلس علم جديد'}</p>
            </div>
          </div>
          
          {isActive && (
            <div className="flex items-center gap-2 bg-[#012d1d] px-3 py-1.5 rounded-full shadow-inner border border-[#d4af37]/30">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d4af37] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#d4af37]"></span>
              </span>
              <span className="text-[#d4af37] text-xs font-bold tracking-wider font-mono">{elapsed}</span>
            </div>
          )}
        </div>

        <div className="relative z-10 p-6">
          {isActive ? (
            <div className="space-y-6">
              {/* Active Broadcast Info Card */}
              <div className="bg-[#02422a]/80 backdrop-blur-sm rounded-xl p-5 border border-[#d4af37]/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1.5 h-full bg-[#d4af37]" />
                <p className="text-xs font-medium text-[#a4ceb5] mb-2 uppercase tracking-wider">عنوان المجلس الحالي</p>
                <p className="font-quran text-[#e8dbb7] text-xl leading-snug">{title}</p>
                {host?.name && (
                  <div className="flex items-center gap-2 mt-4 text-sm text-[#a4ceb5]">
                    <span className="material-symbols-outlined text-[18px] text-[#d4af37]">person</span>
                    <span>المعلم: {host.name}</span>
                  </div>
                )}
              </div>

              {/* Admin Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => navigate('/live')}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#d4af37] hover:bg-[#c6a15a] text-[#012d1d] px-4 py-3 rounded-xl font-bold transition-all shadow-sm"
                >
                  <span className="material-symbols-outlined text-[20px]">login</span>
                  الدخول للمجلس
                </button>
                <button
                  onClick={handleEnd}
                  className="flex-none flex items-center justify-center gap-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 px-6 py-3 rounded-xl font-medium transition-colors border border-red-900/50"
                >
                  <span className="material-symbols-outlined text-[20px]">stop_circle</span>
                  إنهاء
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Setup Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#a4ceb5] mb-1.5">عنوان المجلس</label>
                  <div className="relative">
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#d4af37]/50 text-[20px]">edit_note</span>
                    <input
                      type="text"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      placeholder="مثال: شرح كتاب التوحيد..."
                      maxLength={100}
                      className="w-full pl-4 pr-10 py-3 bg-[#012d1d] border border-[#d4af37]/20 rounded-xl text-sm text-[#e8dbb7] focus:outline-none focus:ring-1 focus:ring-[#d4af37] focus:border-[#d4af37] transition-all placeholder:text-[#a4ceb5]/40"
                    />
                  </div>
                </div>

                {!coursesLoading && publishedCourses.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-[#a4ceb5] mb-1.5">ربط بدورة <span className="text-[#a4ceb5]/60 font-normal">(اختياري)</span></label>
                    <div className="relative">
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#d4af37]/50 text-[20px]">library_books</span>
                      <select
                        value={courseId}
                        onChange={(e) => setCourseId(e.target.value)}
                        className="w-full pl-4 pr-10 py-3 bg-[#012d1d] border border-[#d4af37]/20 rounded-xl text-sm text-[#e8dbb7] focus:outline-none focus:ring-1 focus:ring-[#d4af37] focus:border-[#d4af37] transition-all appearance-none"
                      >
                        <option value="" className="bg-[#02422a]">بث عام (بدون دورة محددة)</option>
                        {publishedCourses.map((c) => (
                          <option key={c.id} value={c.id} className="bg-[#02422a]">{c.title}</option>
                        ))}
                      </select>
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#d4af37]/50 pointer-events-none">expand_more</span>
                    </div>
                  </div>
                )}
              </div>

              {error && (
                <div className="flex items-center gap-2 text-sm text-red-400 bg-red-900/20 border border-red-900/50 rounded-lg px-4 py-3">
                  <span className="material-symbols-outlined text-[18px]">error</span>
                  <p>{error}</p>
                </div>
              )}

              <button
                onClick={handleStart}
                disabled={starting}
                className="w-full flex items-center justify-center gap-2 bg-[#d4af37] hover:bg-[#c6a15a] text-[#012d1d] px-4 py-3.5 rounded-xl font-bold transition-all shadow-[0_4px_15px_rgba(212,175,55,0.15)] hover:shadow-[0_4px_20px_rgba(212,175,55,0.3)] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {starting ? (
                  <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                ) : (
                  <span className="material-symbols-outlined text-[20px]">campaign</span>
                )}
                {starting ? 'جاري بدء المجلس...' : 'بدء المجلس المباشر الآن'}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // -------------------- STUDENT VIEW --------------------
  return (
    <div className={`relative overflow-hidden rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.15)] border transition-all duration-500 ${isActive ? 'bg-[#023321] border-[#d4af37]/30' : 'bg-[#023321]/80 border-[#d4af37]/10'}`}>
      <WidgetBackground />
      
      {/* Background ambient glow if active */}
      {isActive && (
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      )}

      <div className="relative z-10 p-6">
        {isActive ? (
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="relative">
              <div className="absolute inset-0 bg-[#d4af37]/30 rounded-full animate-ping opacity-75"></div>
              <div className="relative flex items-center justify-center w-14 h-14 bg-[#012d1d] rounded-full border-2 border-[#d4af37]/50 text-[#d4af37]">
                <span className="material-symbols-outlined text-2xl">sensors</span>
              </div>
            </div>
            
            <div>
              <div className="inline-flex items-center gap-1.5 bg-[#d4af37]/10 text-[#d8c386] px-3 py-1 rounded-full text-xs font-bold mb-3 border border-[#d4af37]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-pulse" />
                مجلس علم مباشر
              </div>
              <h3 className="font-quran text-[#e8dbb7] text-xl mb-2">{title}</h3>
              {host?.name && (
                <p className="text-sm text-[#a4ceb5] flex items-center justify-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">record_voice_over</span>
                  المعلم: {host.name}
                </p>
              )}
            </div>

            <button
              onClick={() => navigate('/live')}
              className="w-full mt-2 flex items-center justify-center gap-2 bg-[#d4af37] hover:bg-[#c6a15a] text-[#012d1d] px-6 py-3.5 rounded-xl font-bold transition-all shadow-[0_4px_15px_rgba(212,175,55,0.15)] hover:shadow-[0_4px_20px_rgba(212,175,55,0.3)] hover:-translate-y-0.5"
            >
              <span className="material-symbols-outlined text-[20px]">login</span>
              الانضمام للمجلس المباشر
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-6">
            <div className="w-16 h-16 bg-[#012d1d] border border-[#d4af37]/10 rounded-full flex items-center justify-center text-[#d4af37]/40 mb-4 shadow-inner">
              <span className="material-symbols-outlined text-3xl">menu_book</span>
            </div>
            <h3 className="font-bold text-[#e8dbb7] mb-1">لا يوجد مجلس مباشر حالياً</h3>
            <p className="text-sm text-[#a4ceb5] max-w-[200px]">نحن في انتظار المعلم لبدء حلقة العلم القادمة...</p>
          </div>
        )}
      </div>
    </div>
  );
}